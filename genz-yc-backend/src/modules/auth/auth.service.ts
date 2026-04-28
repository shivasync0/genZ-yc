import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { PrismaService } from '../prisma/prisma.service';

const scrypt = promisify(scryptCallback);

interface AuthPayload {
  email?: string;
  password?: string;
  username?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
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
