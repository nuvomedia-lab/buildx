import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../common/services/mailer.service';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  role: string;
  user: {
    id: number;
    fullname: string;
    email: string;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    role: string;
    activities: string[];
    status: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async login(email: string, password: string): Promise<Tokens> {
    try {
      console.log(`[LOGIN] Attempting login for email: ${email}`);
      
      const user: any = await this.prisma.user.findUnique({ 
        where: { email },
      });
      
      if (!user) {
        console.log(`[LOGIN] User not found for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log(`[LOGIN] User found - ID: ${user.id}, Role: ${user.role}, isActive: ${(user as any).isActive}`);

      // Check if user is active
      if (!(user as any).isActive) {
        console.log(`[LOGIN] User account is deactivated for email: ${email}`);
        throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
      }

      console.log(`[LOGIN] Validating password for email: ${email}`);
      const valid = await bcrypt.compare(password, user.password);
      console.log(`[LOGIN] Password validation result: ${valid}`);
      
      if (!valid) {
        console.log(`[LOGIN] Invalid password for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
      });
      const refreshToken = await this.jwtService.signAsync({ sub: user.id }, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me',
      });

      const safeUser = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber ?? null,
        avatarUrl: user.avatarUrl ?? null,
        role: user.role,
        activities: user.activities,
        status: user.status,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      console.log(`[LOGIN] Login successful for email: ${email}, role: ${user.role}`);
      return { accessToken, refreshToken, role: user.role, user: safeUser };
    } catch (error) {
      console.log(`[LOGIN] Login failed for email: ${email}`, error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async googleSignIn(idToken: string): Promise<Tokens> {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new UnauthorizedException('Google auth not configured');
      }

      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({ idToken, audience: clientId });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }
      const email = payload.email;
      if (payload.email_verified !== true) {
        throw new UnauthorizedException('Email not verified with Google');
      }

      // email must match exactly; find existing user
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Account not found');
      }

      const jwtPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(jwtPayload, { expiresIn: '24h' });
      const refreshToken = await this.jwtService.signAsync({ sub: user.id }, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me',
      });

      const safeUser = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber ?? null,
        avatarUrl: user.avatarUrl ?? null,
        role: user.role,
        activities: user.activities,
        status: user.status,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return { accessToken, refreshToken, role: user.role, user: safeUser };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to sign in with Google');
    }
  }

  getGoogleAuthUrl(state?: string): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      throw new UnauthorizedException('Google auth not configured');
    }
    const client = new OAuth2Client(clientId, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
    const url = client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['openid', 'email', 'profile'],
      state,
    });
    return url;
  }

  async handleGoogleCallback(code: string): Promise<Tokens> {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;
      if (!clientId || !clientSecret || !redirectUri) {
        throw new UnauthorizedException('Google auth not configured');
      }
      const client = new OAuth2Client(clientId, clientSecret, redirectUri);
      const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
      if (!tokens.id_token) {
        throw new UnauthorizedException('Invalid Google response');
      }
      const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
      const payload = ticket.getPayload();
      if (!payload || !payload.email || payload.email_verified !== true) {
        throw new UnauthorizedException('Invalid Google token');
      }
      const email = payload.email;
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Account not found');
      }
      const jwtPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(jwtPayload, { expiresIn: '24h' });
      const refreshToken = await this.jwtService.signAsync({ sub: user.id }, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me',
      });
      const safeUser = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber ?? null,
        avatarUrl: user.avatarUrl ?? null,
        role: user.role,
        activities: user.activities,
        status: user.status,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return { accessToken, refreshToken, role: user.role, user: safeUser };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Unable to sign in with Google');
    }
  }

  getMicrosoftAuthUrl(state?: string): string {
    const clientId = process.env.MS_CLIENT_ID;
    const tenantId = process.env.MS_TENANT_ID || 'common';
    const redirectUri = process.env.MS_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      throw new UnauthorizedException('Microsoft auth not configured');
    }
    const base = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: 'openid email profile',
      prompt: 'consent',
    });
    if (state) params.set('state', state);
    return `${base}?${params.toString()}`;
  }
  
  async handleMicrosoftCallback(code: string): Promise<Tokens> {
    try {
      const clientId = process.env.MS_CLIENT_ID;
      const clientSecret = process.env.MS_CLIENT_SECRET;
      const redirectUri = process.env.MS_REDIRECT_URI;
      const tenantId = process.env.MS_TENANT_ID || 'common';
      if (!clientId || !clientSecret || !redirectUri) {
        throw new UnauthorizedException('Microsoft auth not configured');
      }
  
      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
      const form = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      });
  
      const { data } = await axios.post(tokenUrl, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      if (!data?.id_token) throw new UnauthorizedException('Invalid Microsoft response');
  
      // Decode id_token (no signature verify here; token endpoint success is required)
      const decoded: any = this.jwtService.decode(data.id_token);
      const email: string | undefined = decoded?.email || decoded?.preferred_username;
      const emailVerified: boolean = decoded?.email_verified ?? true; // Microsoft may not set this
  
      if (!email || emailVerified === false) {
        throw new UnauthorizedException('Invalid Microsoft token');
      }
  
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Account not found');
      }
  
      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '24h' });
      const refreshToken = await this.jwtService.signAsync({ sub: user.id }, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me',
      });
  
      const safeUser = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber ?? null,
        avatarUrl: user.avatarUrl ?? null,
        role: user.role,
        activities: user.activities,
        status: user.status,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return { accessToken, refreshToken, role: user.role, user: safeUser };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Unable to sign in with Microsoft');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Do not reveal user existence
        return;
      }

      // generate 6-digit OTP and hash
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await this.prisma.passwordReset.create({
        data: { email, otpHash, expiresAt },
      });

      // send mail via centralized mailer
      await this.mailer.sendTemplate({
        to: email,
        templateId: process.env.ZEPTO_FORGOT_TEMPLATE_ID || 'forgot-password',
        subject: 'Your password reset code',
        variables: { fullname: user.fullname, otp },
      });
    } catch (error) {
      // swallow to avoid user enumeration but log if needed
      return;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<string> {
    try {
      const record = await this.prisma.passwordReset.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' },
      });
      if (!record) {
        throw new UnauthorizedException('Invalid or expired code');
      }
      if (record.usedAt) {
        throw new UnauthorizedException('Code already used');
      }
      if (record.expiresAt < new Date()) {
        throw new UnauthorizedException('Code expired');
      }
      const valid = await bcrypt.compare(otp, record.otpHash);
      if (!valid) {
        // increment attempts and optionally lock
        await this.prisma.passwordReset.update({
          where: { id: record.id },
          data: { attempts: { increment: 1 } },
        });
        throw new UnauthorizedException('Invalid code');
      }
      // mark used
      await this.prisma.passwordReset.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      // issue short-lived reset token (5 minutes)
      const resetToken = await this.jwtService.signAsync(
        { email },
        { secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me', expiresIn: '5m' },
      );
      return resetToken;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired code');
    }
  }

  async resetPassword(email: string, newPassword: string, confirmPassword: string, resetToken: string): Promise<void> {
    try {
      // verify reset token ties to this email
      const decoded = await this.jwtService.verifyAsync<{ email: string }>(resetToken, {
        secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me',
      });
      if (!decoded || decoded.email !== email) {
        throw new UnauthorizedException('Invalid reset token');
      }
      if (newPassword !== confirmPassword) {
        throw new UnauthorizedException('Passwords do not match');
      }
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        // avoid user enumeration
        return;
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({ where: { email }, data: { password: hash } });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to reset password');
    }
  }
}


