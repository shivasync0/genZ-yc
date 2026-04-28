import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { promisify } from 'util';
import { PrismaService } from '../prisma/prisma.service';

const scrypt = promisify(scryptCallback);

interface AuthPayload {
  email?: string;
  password?: string;
  username?: string;
}

type OAuthProvider = 'google' | 'github' | 'linkedin';

interface OAuthIdentity {
  providerId: string;
  email?: string;
  displayName?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  private readonly jwtSecret = process.env.JWT_SECRET || 'replace-this-secret-in-production';

  getGoogleAuthUrl() {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: `${this.backendUrl}/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      access_type: 'offline',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  getGithubAuthUrl() {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || '',
      redirect_uri: `${this.backendUrl}/auth/github/callback`,
      scope: 'read:user user:email',
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  getLinkedinAuthUrl() {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID || '',
      redirect_uri: `${this.backendUrl}/auth/linkedin/callback`,
      scope: 'openid profile email',
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  async register(payload: AuthPayload) {
    const email = this.normalizeEmail(payload.email);
    const password = payload.password?.trim() ?? '';
    const username = payload.username?.trim();

    this.validatePassword(password);

    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        username: username || null,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    return {
      message: 'Registration successful.',
      user,
    };
  }

  async login(payload: AuthPayload) {
    const email = this.normalizeEmail(payload.email);
    const password = payload.password?.trim() ?? '';

    if (!password) {
      throw new BadRequestException('Password is required.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
      },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const valid = await this.verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      message: 'Login successful.',
      token: this.createJwt(user.id, user.email, 'password'),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async getCurrentUserFromToken(authorizationHeader?: string) {
    const token = this.extractBearerToken(authorizationHeader);
    if (!token) {
      throw new UnauthorizedException('Missing access token.');
    }

    try {
      const decoded = verify(token, this.jwtSecret) as {
        sub: string;
        email: string;
      };

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token user.');
      }

      return { user };
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  async handleGoogleCallback(code?: string) {
    if (!code) {
      throw new BadRequestException('Missing Google authorization code.');
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${this.backendUrl}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      throw new UnauthorizedException('Google token exchange failed.');
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('Google access token missing.');
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      throw new UnauthorizedException('Google profile fetch failed.');
    }

    const profile = (await profileRes.json()) as {
      sub?: string;
      email?: string;
      name?: string;
    };

    if (!profile.sub) {
      throw new UnauthorizedException('Google profile ID missing.');
    }

    return this.buildOAuthSuccessRedirect(
      await this.completeOAuthLogin('google', {
        providerId: profile.sub,
        email: profile.email,
        displayName: profile.name,
      }),
    );
  }

  async handleGithubCallback(code?: string) {
    if (!code) {
      throw new BadRequestException('Missing GitHub authorization code.');
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GITHUB_CLIENT_ID || '',
        client_secret: process.env.GITHUB_CLIENT_SECRET || '',
        redirect_uri: `${this.backendUrl}/auth/github/callback`,
      }),
    });

    if (!tokenRes.ok) {
      throw new UnauthorizedException('GitHub token exchange failed.');
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('GitHub access token missing.');
    }

    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!profileRes.ok) {
      throw new UnauthorizedException('GitHub profile fetch failed.');
    }

    const profile = (await profileRes.json()) as {
      id?: number;
      email?: string;
      login?: string;
      name?: string;
    };

    if (!profile.id) {
      throw new UnauthorizedException('GitHub profile ID missing.');
    }

    let email = profile.email;
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      });

      if (emailRes.ok) {
        const emails = (await emailRes.json()) as Array<{
          email: string;
          primary: boolean;
          verified: boolean;
        }>;
        const primary = emails.find((item) => item.primary && item.verified);
        email = primary?.email || emails.find((item) => item.verified)?.email;
      }
    }

    return this.buildOAuthSuccessRedirect(
      await this.completeOAuthLogin('github', {
        providerId: String(profile.id),
        email,
        displayName: profile.name || profile.login,
      }),
    );
  }

  async handleLinkedinCallback(code?: string) {
    if (!code) {
      throw new BadRequestException('Missing LinkedIn authorization code.');
    }

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID || '',
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
        redirect_uri: `${this.backendUrl}/auth/linkedin/callback`,
      }),
    });

    if (!tokenRes.ok) {
      throw new UnauthorizedException('LinkedIn token exchange failed.');
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('LinkedIn access token missing.');
    }

    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      throw new UnauthorizedException('LinkedIn profile fetch failed.');
    }

    const profile = (await profileRes.json()) as {
      sub?: string;
      email?: string;
      name?: string;
      given_name?: string;
      family_name?: string;
    };

    if (!profile.sub) {
      throw new UnauthorizedException('LinkedIn profile ID missing.');
    }

    return this.buildOAuthSuccessRedirect(
      await this.completeOAuthLogin('linkedin', {
        providerId: profile.sub,
        email: profile.email,
        displayName:
          profile.name ||
          `${profile.given_name || ''} ${profile.family_name || ''}`.trim() ||
          undefined,
      }),
    );
  }

  buildOAuthErrorRedirect(errorMessage: string) {
    const params = new URLSearchParams({
      status: 'error',
      message: errorMessage,
    });
    return `${this.frontendUrl}/oauth/callback?${params.toString()}`;
  }

  private async completeOAuthLogin(provider: OAuthProvider, identity: OAuthIdentity) {
    const providerLink = await this.prisma.authProvider.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId: identity.providerId,
        },
      },
      include: { user: true },
    });

    if (providerLink?.user) {
      return {
        token: this.createJwt(providerLink.user.id, providerLink.user.email, provider),
        email: providerLink.user.email,
        provider,
      };
    }

    const normalizedEmail = identity.email ? this.normalizeEmail(identity.email) : null;
    const fallbackEmail = `${provider}.${identity.providerId}@oauth.local`;
    const emailToUse = normalizedEmail || fallbackEmail;

    let user = await this.prisma.user.findUnique({ where: { email: emailToUse } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: emailToUse,
          username: this.generateUsername(identity.displayName),
        },
      });
    }

    await this.prisma.authProvider.create({
      data: {
        userId: user.id,
        provider,
        providerId: identity.providerId,
      },
    });

    return {
      token: this.createJwt(user.id, user.email, provider),
      email: user.email,
      provider,
    };
  }

  private buildOAuthSuccessRedirect(payload: { token: string; email: string; provider: OAuthProvider }) {
    const params = new URLSearchParams({
      status: 'success',
      token: payload.token,
      email: payload.email,
      provider: payload.provider,
    });
    return `${this.frontendUrl}/oauth/callback?${params.toString()}`;
  }

  private extractBearerToken(authorizationHeader?: string) {
    if (!authorizationHeader) {
      return null;
    }
    const [type, token] = authorizationHeader.split(' ');
    if (type?.toLowerCase() !== 'bearer' || !token) {
      return null;
    }
    return token;
  }

  private createJwt(userId: string, email: string, provider: string) {
    return sign(
      {
        sub: userId,
        email,
        provider,
      },
      this.jwtSecret,
      { expiresIn: '7d' },
    );
  }

  private generateUsername(displayName?: string) {
    if (!displayName) {
      return null;
    }

    const cleaned = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (!cleaned) {
      return null;
    }

    return `${cleaned.slice(0, 20)}_${randomBytes(2).toString('hex')}`;
  }

  private normalizeEmail(email?: string) {
    const normalized = email?.trim().toLowerCase() ?? '';
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      throw new BadRequestException('Please provide a valid email address.');
    }

    return normalized;
  }

  private validatePassword(password: string) {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(password: string, storedHash: string) {
    const [salt, savedKeyHex] = storedHash.split(':');
    if (!salt || !savedKeyHex) {
      return false;
    }

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const savedKey = Buffer.from(savedKeyHex, 'hex');

    if (derivedKey.length !== savedKey.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, savedKey);
  }
}
