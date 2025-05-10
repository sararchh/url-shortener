import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        console.error('Unhandled error:', error);

        return throwError(
          () =>
            new HttpException(
              {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
