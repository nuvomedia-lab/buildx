import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleSignInDto } from './dto/google-signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials', type: BaseResponseDto })
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string; refreshToken: string; role: string }> {
    try {
      const tokens = await this.authService.login(dto.email, dto.password);
      return tokens;
    } catch (error) {
      // Rethrow so global filters format the error consistently
      throw error;
    }
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with Google ID token' })
  @ApiResponse({ status: 200, description: 'Login successful', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseResponseDto })
  async google(@Body() dto: GoogleSignInDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      return await this.authService.googleSignIn(dto.idToken);
    } catch (error) {
      throw error;
    }
  }

  @Post('google/url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Google OAuth URL' })
  @ApiResponse({ status: 200, description: 'URL generated', type: BaseResponseDto })
  async googleUrl(@Body('state') state?: string): Promise<{ url: string }> {
    try {
      return { url: this.authService.getGoogleAuthUrl(state) };
    } catch (error) {
      throw error;
    }
  }

  @Post('google/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Google OAuth callback (server-side)' })
  @ApiResponse({ status: 200, description: 'Login successful', type: BaseResponseDto })
  async googleCallback(@Body('code') code: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      return await this.authService.handleGoogleCallback(code);
    } catch (error) {
      throw error;
    }
  }

  @Post('microsoft/url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Microsoft OAuth URL' })
  @ApiResponse({ status: 200, description: 'URL generated', type: BaseResponseDto })
  async microsoftUrl(@Body('state') state?: string): Promise<{ url: string }> {
    try {
      return { url: this.authService.getMicrosoftAuthUrl(state) };
    } catch (error) {
      throw error;
    }
  }

  @Post('microsoft/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Microsoft OAuth callback (server-side)' })
  @ApiResponse({ status: 200, description: 'Login successful', type: BaseResponseDto })
  async microsoftCallback(@Body('code') code: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      return await this.authService.handleMicrosoftCallback(code);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiResponse({ status: 200, description: 'Code sent if email exists', type: BaseResponseDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    try {
      await this.authService.forgotPassword(dto.email);
      return;
    } catch (error) {
      throw error;
    }
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiResponse({ status: 200, description: 'OTP valid', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid/expired OTP', type: BaseResponseDto })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<{ resetToken: string }> {
    try {
      const resetToken = await this.authService.verifyOtp(dto.email, dto.otp);
      return { resetToken };
    } catch (error) {
      throw error;
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password after verifying OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successful', type: BaseResponseDto })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    try {
      await this.authService.resetPassword(dto.email, dto.newPassword, dto.confirmPassword, dto.resetToken);
      return;
    } catch (error) {
      throw error;
    }
  }
}


