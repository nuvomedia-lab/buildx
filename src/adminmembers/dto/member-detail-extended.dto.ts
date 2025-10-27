import { ApiProperty } from '@nestjs/swagger';
import { Role, ApprovalStatus } from '@prisma/client';

export class OverviewDto {
  @ApiProperty({ description: 'Completed projects count', example: 5 })
  completedProjects: number;

  @ApiProperty({ description: 'Ongoing projects count', example: 3 })
  ongoingProjects: number;

  @ApiProperty({ description: 'Total projects count', example: 8 })
  totalProjects: number;

  @ApiProperty({ description: 'Member status', enum: ApprovalStatus })
  status: ApprovalStatus;

  @ApiProperty({ description: 'Last login date', example: '2024-01-15T10:30:00.000Z', nullable: true })
  lastLogin: Date | null;

  @ApiProperty({ description: 'Last logout date', example: '2024-01-15T10:30:00.000Z', nullable: true })
  lastLogout: Date | null;

  @ApiProperty({ description: 'Is member active', example: true })
  isActive: boolean;
}

export class ProjectDto {
  @ApiProperty({ description: 'Project ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Project name', example: 'Construction Project A' })
  name: string;

  @ApiProperty({ description: 'Project status', example: 'Ongoing' })
  status: string;

  @ApiProperty({ description: 'Start date', example: '2024-01-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2024-12-31T00:00:00.000Z', nullable: true })
  endDate: Date | null;
}

export class AccessDto {
  @ApiProperty({ description: 'Role of the member', enum: Role })
  role: Role;

  @ApiProperty({ description: 'Access type', example: 'Full' })
  accessType: string;

  @ApiProperty({ description: 'List of activities user has access to', type: [String] })
  activities: string[];
}

export class MemberDetailExtendedResponseDto {
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

  @ApiProperty({ type: OverviewDto })
  overview: OverviewDto;

  @ApiProperty({ description: 'List of projects', type: [ProjectDto] })
  projects: ProjectDto[];

  @ApiProperty({ description: 'User activities on the platform', type: [String] })
  activities: string[];

  @ApiProperty({ type: AccessDto })
  access: AccessDto;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  updatedAt: Date;
}

