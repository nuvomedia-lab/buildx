import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { Role } from '@prisma/client';

export class InviteMemberDto {
  @ApiProperty({ description: 'Email address of the member to invite', example: 'member@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number of the member', example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Role of the member', enum: Role, example: 'PM' })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({ description: 'List of activities the member has access to', example: ['activity1', 'activity2'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  activities?: string[];

  @ApiProperty({ description: 'Full name of the member', example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  fullname?: string;

  @ApiProperty({ description: 'Name of the admin sending the invitation', example: 'Jennifer Sherry', required: false })
  @IsString()
  @IsOptional()
  adminName?: string;
}

