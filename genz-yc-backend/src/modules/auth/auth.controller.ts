import { Body, Controller, Get, Headers, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  googleAuth(@Res() res: Response) {
    return res.redirect(this.authService.getGoogleAuthUrl());
  }

  @Get('github')
  githubAuth(@Res() res: Response) {
    return res.redirect(this.authService.getGithubAuthUrl());
  }

  @Get('linkedin')
  linkedinAuth(@Res() res: Response) {
    return res.redirect(this.authService.getLinkedinAuthUrl());
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string | undefined, @Res() res: Response) {
    try {
      const redirectUrl = await this.authService.handleGoogleCallback(code);
      return res.redirect(redirectUrl);
    } catch (error) {
      return res.redirect(
        this.authService.buildOAuthErrorRedirect(
          error instanceof Error ? error.message : 'Google login failed.',
        ),
      );
    }
  }

  @Get('github/callback')
  async githubCallback(@Query('code') code: string | undefined, @Res() res: Response) {
    try {
      const redirectUrl = await this.authService.handleGithubCallback(code);
      return res.redirect(redirectUrl);
    } catch (error) {
      return res.redirect(
        this.authService.buildOAuthErrorRedirect(
          error instanceof Error ? error.message : 'GitHub login failed.',
        ),
      );
    }
  }

  @Get('linkedin/callback')
  async linkedinCallback(@Query('code') code: string | undefined, @Res() res: Response) {
    try {
      const redirectUrl = await this.authService.handleLinkedinCallback(code);
      return res.redirect(redirectUrl);
    } catch (error) {
      return res.redirect(
        this.authService.buildOAuthErrorRedirect(
          error instanceof Error ? error.message : 'LinkedIn login failed.',
        ),
      );
    }
  }

  @Get('me')
  me(@Headers('authorization') authorization?: string) {
    return this.authService.getCurrentUserFromToken(authorization);
  }

  @Post('register')
  register(@Body() body: { email?: string; password?: string; username?: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email?: string; password?: string }) {
    return this.authService.login(body);
  }
}
