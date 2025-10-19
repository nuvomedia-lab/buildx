import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'NewPassword@1234' })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({ example: 'NewPassword@1234' })
  @IsString()
  @MinLength(8)
  confirmPassword: string;

  @ApiProperty({ description: 'Token returned by verify-otp', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  @IsNotEmpty()
  resetToken: string;
}


