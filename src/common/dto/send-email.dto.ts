import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  recipients: string;

  @ApiProperty({ example: 'Welcome to BuildX' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'template_id_here' })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ example: { fullname: 'Jane Doe', otp: '123456' } })
  @IsObject()
  @IsOptional()
  dynamicData?: Record<string, any>;
}


