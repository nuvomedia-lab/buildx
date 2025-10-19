import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class BaseResponseDto<T = any> {
  @ApiProperty({ 
    description: 'Indicates if the request was successful',
    example: true 
  })
  isSuccessful: boolean;

  @ApiProperty({ 
    description: 'Error response details if any',
    required: false,
    example: null 
  })
  errorResponse?: ErrorResponseDto | null;

  @ApiProperty({ 
    description: 'Human readable response message',
    example: 'Operation completed successfully' 
  })
  responseMessage: string;

  @ApiProperty({ 
    description: 'HTTP status code',
    example: 200 
  })
  responseCode: number;

  @ApiProperty({ 
    description: 'The actual data returned by the endpoint',
    required: false 
  })
  data?: T;

  constructor(
    isSuccessful: boolean,
    responseMessage: string,
    responseCode: number,
    data?: T,
    errorResponse?: ErrorResponseDto | null
  ) {
    this.isSuccessful = isSuccessful;
    this.responseMessage = responseMessage;
    this.responseCode = responseCode;
    this.data = data;
    this.errorResponse = errorResponse;
  }

  static success<T>(data: T, message: string = 'Operation completed successfully', statusCode: number = 200): BaseResponseDto<T> {
    return new BaseResponseDto(true, message, statusCode, data, null);
  }

  static error(message: string, statusCode: number = 500, errorResponse?: ErrorResponseDto): BaseResponseDto {
    return new BaseResponseDto(false, message, statusCode, undefined, errorResponse);
  }
}
