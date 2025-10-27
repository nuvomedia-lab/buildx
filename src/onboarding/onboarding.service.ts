import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../common/services/mailer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ApprovalStatus } from '@prisma/client';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { PersonalDetailsDto } from './dto/personal-details.dto';
import { ConfirmDetailsDto } from './dto/confirm-details.dto';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    try {
      // Verify invitation token
      const decoded = this.jwtService.verify(dto.token);
      const email = decoded.email;

      // Find user
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

      // Store OTP in password reset table (or create new onboarding OTP table)
      await this.prisma.passwordReset.create({
        data: {
          email,
          otpHash,
          expiresAt,
          attempts: 0,
        },
      });

      // Send OTP via email
      await this.mailer.sendTemplate({
        to: email,
        templateId: process.env.ZEPTO_ONBOARDING_OTP_TEMPLATE_ID || 'onboarding-otp',
        subject: 'Your BuildX Onboarding Code',
        variables: {
          fullname: user.fullname,
          otp,
        },
      });

      return {
        message: 'OTP sent to your email',
        email,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const record = await this.prisma.passwordReset.findFirst({
        where: { email: dto.email },
        orderBy: { createdAt: 'desc' },
      });

      if (!record) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      if (record.usedAt) {
        throw new UnauthorizedException('OTP already used');
      }

      if (record.expiresAt < new Date()) {
        throw new UnauthorizedException('OTP expired');
      }

      const valid = await bcrypt.compare(dto.otp, record.otpHash);
      if (!valid) {
        await this.prisma.passwordReset.update({
          where: { id: record.id },
          data: { attempts: { increment: 1 } },
        });
        throw new UnauthorizedException('Invalid OTP');
      }

      // Mark OTP as used
      await this.prisma.passwordReset.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });

      // Generate onboarding token (valid for 1 hour)
      const onboardingToken = this.jwtService.sign(
        { email: dto.email, step: 'otp-verified' },
        { expiresIn: '1h' },
      );

      return {
        message: 'OTP verified successfully',
        onboardingToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException('Failed to verify OTP');
    }
  }

  async setPassword(dto: SetPasswordDto) {
    try {
      // Verify onboarding token (would be passed from frontend but we'll validate email)
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.password && user.password !== 'pending') {
        throw new BadRequestException('Password already set');
      }

      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      // Validate password strength
      if (dto.password.length < 8) {
        throw new BadRequestException('Password must be at least 8 characters');
      }

      // Hash and set password
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      await this.prisma.user.update({
        where: { email: dto.email },
        data: { password: hashedPassword },
      });

      return {
        message: 'Password set successfully',
        email: dto.email,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to set password');
    }
  }

  async savePersonalDetails(dto: PersonalDetailsDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const fullname = `${dto.firstName} ${dto.lastName}`;

      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          fullname,
          ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
        },
      });

      return {
        message: 'Personal details saved successfully',
        email: dto.email,
        fullname,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to save personal details');
    }
  }

  async confirmDetails(dto: ConfirmDetailsDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Validate that user has completed all steps
      if (!user.password || user.password === 'pending') {
        throw new BadRequestException('Password not set');
      }

      if (!user.fullname || user.fullname === 'New Member') {
        throw new BadRequestException('Personal details not completed');
      }

      // Change status from PENDING to APPROVED
      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          status: ApprovalStatus.APPROVED,
        },
      });

      return {
        message: 'Registration completed successfully',
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        status: 'APPROVED',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to confirm details');
    }
  }
}

