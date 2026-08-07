import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 检查是否标记了跳过转换
    const skipTransform = this.reflector.get<boolean>(
      'skipTransform',
      context.getHandler(),
    );

    if (skipTransform) {
      return next.handle(); // 直接返回，不进行格式转换
    }

    return next.handle().pipe(
      map((data) => {
        return {
          errno: 0,
          data,
        };
      }),
    );
  }
}
