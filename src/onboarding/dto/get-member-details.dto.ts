import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetMemberDetailsDto {
  @ApiProperty({ description: 'Email address of the member', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

