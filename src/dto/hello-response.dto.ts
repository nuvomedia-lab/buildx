import { ApiProperty } from '@nestjs/swagger';

export class HelloResponseDto {
  @ApiProperty({
    description: 'Greeting message',
    example: 'Hello World!',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API version',
    example: '1.0.0',
  })
  version: string;
}

