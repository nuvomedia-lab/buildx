import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseResponseDto } from '../dto/base-response.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let errorMessage = 'An error occurred';
    let errorCode = 'HTTP_EXCEPTION';
    let errorDetails: any = null;

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      errorMessage = responseObj.message || errorMessage;
      errorCode = responseObj.error || errorCode;
      errorDetails = responseObj.details || null;
    }

    const errorResponse = new ErrorResponseDto(errorCode, errorMessage, errorDetails);
    const baseResponse = BaseResponseDto.error(errorMessage, status, errorResponse);

    response.status(status).json(baseResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        errorMessage = responseObj.message || errorMessage;
        errorCode = responseObj.error || errorCode;
        errorDetails = responseObj.details || null;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      errorCode = 'UNKNOWN_ERROR';
    }

    const errorResponse = new ErrorResponseDto(errorCode, errorMessage, errorDetails);
    const baseResponse = BaseResponseDto.error(errorMessage, status, errorResponse);

    response.status(status).json(baseResponse);
  }
}
