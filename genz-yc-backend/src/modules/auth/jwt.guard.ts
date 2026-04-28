import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly jwtSecret = process.env.JWT_SECRET || 'replace-this-secret-in-production';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const decoded = verify(token, this.jwtSecret) as {
        sub?: string;
        id?: string;
        email?: string;
      };
      // JWT uses 'sub' for subject (user ID), but store as 'id' for convenience
      request.user = {
        id: decoded.sub || decoded.id,
        email: decoded.email,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    // Check for "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }

    // Check for token in query params (for convenience in dev)
    return (request.query.token as string) || null;
  }
}
