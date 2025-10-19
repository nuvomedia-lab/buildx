import { Injectable } from '@nestjs/common';
import { BaseResponseDto } from '../dto/base-response.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Injectable()
export class ResponseService {
  /**
   * Create a successful response
   */
  success<T>(data: T, message: string = 'Operation completed successfully', statusCode: number = 200): BaseResponseDto<T> {
    return BaseResponseDto.success(data, message, statusCode);
  }

  /**
   * Create an error response
   */
  error(message: string, statusCode: number = 500, errorCode: string = 'ERROR', errorDetails?: any): BaseResponseDto {
    const errorResponse = new ErrorResponseDto(errorCode, message, errorDetails);
    return BaseResponseDto.error(message, statusCode, errorResponse);
  }

  /**
   * Create a validation error response
   */
  validationError(message: string = 'Validation failed', errorDetails?: any): BaseResponseDto {
    return this.error(message, 400, 'VALIDATION_ERROR', errorDetails);
  }

  /**
   * Create a not found error response
   */
  notFound(message: string = 'Resource not found'): BaseResponseDto {
    return this.error(message, 404, 'NOT_FOUND');
  }

  /**
   * Create an unauthorized error response
   */
  unauthorized(message: string = 'Unauthorized access'): BaseResponseDto {
    return this.error(message, 401, 'UNAUTHORIZED');
  }

  /**
   * Create a forbidden error response
   */
  forbidden(message: string = 'Access forbidden'): BaseResponseDto {
    return this.error(message, 403, 'FORBIDDEN');
  }

  /**
   * Create a conflict error response
   */
  conflict(message: string = 'Resource conflict'): BaseResponseDto {
    return this.error(message, 409, 'CONFLICT');
  }
}
