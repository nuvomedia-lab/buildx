import { ApiProperty } from '@nestjs/swagger';
import { Role, ApprovalStatus } from '@prisma/client';

export class MemberResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  fullname: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: 'User role', enum: Role })
  role: Role;

  @ApiProperty({ description: 'Access type', example: 'Full' })
  accessType: string;

  @ApiProperty({ description: 'Account status', enum: ApprovalStatus })
  status: ApprovalStatus;

  @ApiProperty({ description: 'Is member active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Projects info', example: '5/10', nullable: true })
  projects: string | null;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;
}

export class PaginatedMembersResponseDto {
  @ApiProperty({ type: [MemberResponseDto] })
  data: MemberResponseDto[];

  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;
}

