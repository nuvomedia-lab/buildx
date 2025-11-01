import { ApiProperty } from '@nestjs/swagger';

export class MemberDetailsResponseDto {
  @ApiProperty({ description: 'Full role name', example: 'Project Manager' })
  role: string;

  @ApiProperty({ description: 'Access level', example: 'Full', enum: ['Full', 'Limited'] })
  accessLevel: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false, nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'Avatar image URL', example: 'https://res.cloudinary.com/...', required: false, nullable: true })
  image: string | null;
}

