import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsArray, IsString, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateMemberAccessDto {
  @ApiProperty({ description: 'User role', enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ description: 'List of activities user should have access to', example: ['View all requests', 'Validate requests from SEF'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  activities?: string[];
}

