import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RoleResponseDto {
  @ApiProperty({ description: 'Role enum value', example: 'PM' })
  role: Role;

  @ApiProperty({ description: 'Role display name', example: 'Project Manager' })
  displayName: string;
}

export class ActivityResponseDto {
  @ApiProperty({ description: 'Activity name', example: 'View all requests' })
  activity: string;
}

