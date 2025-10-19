import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ 
    description: 'Error code',
    example: 'VALIDATION_ERROR' 
  })
  errorCode: string;

  @ApiProperty({ 
    description: 'Detailed error message',
    example: 'The provided data is invalid' 
  })
  errorMessage: string;

  @ApiProperty({ 
    description: 'Additional error details',
    required: false,
    example: { field: 'email', message: 'Invalid email format' } 
  })
  errorDetails?: any;

  @ApiProperty({ 
    description: 'Timestamp when the error occurred',
    example: '2024-01-15T10:30:00.000Z' 
  })
  timestamp: string;

  constructor(errorCode: string, errorMessage: string, errorDetails?: any) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.errorDetails = errorDetails;
    this.timestamp = new Date().toISOString();
  }
}
