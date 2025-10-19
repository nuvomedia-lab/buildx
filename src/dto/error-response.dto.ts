import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'Error details',
    example: 'Invalid input parameters',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;
}

