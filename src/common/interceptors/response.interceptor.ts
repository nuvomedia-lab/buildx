import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/base-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => {
        // If the data is already a BaseResponseDto, return it as is
        if (data instanceof BaseResponseDto) {
          return data;
        }

        // Determine success message based on HTTP method
        let message = 'Operation completed successfully';
        const method = request.method;
        
        switch (method) {
          case 'GET':
            message = Array.isArray(data) ? 'Data retrieved successfully' : 'Data retrieved successfully';
            break;
          case 'POST':
            message = 'Resource created successfully';
            break;
          case 'PUT':
          case 'PATCH':
            message = 'Resource updated successfully';
            break;
          case 'DELETE':
            message = 'Resource deleted successfully';
            break;
        }

        return BaseResponseDto.success(data, message, response.statusCode);
      }),
    );
  }
}
