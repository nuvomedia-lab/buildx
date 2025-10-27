import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { PersonalDetailsDto } from './dto/personal-details.dto';
import { ConfirmDetailsDto } from './dto/confirm-details.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';

@ApiTags('onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to user email (step 1)' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid token', type: BaseResponseDto })
  async sendOtp(@Body() dto: SendOtpDto) {
    try {
      return await this.onboardingService.sendOtp(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code (step 2)' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP', type: BaseResponseDto })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    try {
      return await this.onboardingService.verifyOtp(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('set-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set user password (step 3)' })
  @ApiResponse({ status: 200, description: 'Password set successfully', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input', type: BaseResponseDto })
  async setPassword(@Body() dto: SetPasswordDto) {
    try {
      return await this.onboardingService.setPassword(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('personal-details')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save personal details and avatar (step 4)' })
  @ApiResponse({ status: 200, description: 'Personal details saved successfully', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input', type: BaseResponseDto })
  async savePersonalDetails(@Body() dto: PersonalDetailsDto) {
    try {
      return await this.onboardingService.savePersonalDetails(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm and complete registration (step 5)' })
  @ApiResponse({ status: 200, description: 'Registration completed successfully', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Incomplete registration', type: BaseResponseDto })
  async confirmDetails(@Body() dto: ConfirmDetailsDto) {
    try {
      return await this.onboardingService.confirmDetails(dto);
    } catch (error) {
      throw error;
    }
  }
}

