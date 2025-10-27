import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber, Min, IsInt } from 'class-validator';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';

export class GetMembersQueryDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', example: 10, required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ description: 'Search by name or ID', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by role', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

