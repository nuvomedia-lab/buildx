import { ApiProperty } from '@nestjs/swagger';
import { Role, ApprovalStatus } from '@prisma/client';

export class MemberDetailResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  fullname: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ description: 'Avatar URL', example: 'https://...', nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ description: 'User role', enum: Role })
  role: Role;

  @ApiProperty({ description: 'User activities', example: ['View all requests', 'Validate requests from SEF'] })
  activities: string[];

  @ApiProperty({ description: 'Access type', example: 'Full' })
  accessType: string;

  @ApiProperty({ description: 'Account status', enum: ApprovalStatus })
  status: ApprovalStatus;

  @ApiProperty({ description: 'Date invited (created date)', example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date', example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

