import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { SUCCESS_MESSAGE_KEY } from "../decorators/success_message.decorator";
import { ApiResponse } from "../interfaces/api-response.interface";

export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const message =
      this.reflector.get<string>(SUCCESS_MESSAGE_KEY, context.getHandler()) || "Success";

    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return { result: true, message, data: null };
        }

        if (Array.isArray(data)) {
          return { result: true, message, data };
        }

        if (typeof data === "object") {
          const { __customMessage, ...cleanData } = data;
          return {
            result: true,
            message: __customMessage || message,
            data: cleanData,
          };
        }
        return { result: true, message, data };
      }),
    );
  }
}
