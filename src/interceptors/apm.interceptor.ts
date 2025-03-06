import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as apm from 'elastic-apm-node';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const transaction = apm.currentTransaction;

    if (transaction) {
      // Adiciona informações do usuário se disponível
      if (request.user) {
        apm.setUserContext({
          id: request.user.id,
          username: request.user.username,
        });
      }

      // Adiciona informações customizadas
      transaction.addLabels({
        route: request.route?.path,
        method: request.method,
        correlationId: request.headers['x-correlation-id'],
      });
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          if (transaction) {
            // Adiciona métricas de resposta
            transaction.addLabels({
              responseTime: Date.now() - startTime,
              statusCode: context.switchToHttp().getResponse().statusCode,
            });
          }
        },
        error: (error) => {
          if (transaction) {
            // Captura informações detalhadas do erro
            apm.captureError(error, {
              custom: {
                route: request.route?.path,
                method: request.method,
                body: request.body,
                params: request.params,
                query: request.query,
              },
            });
          }
        },
      }),
    );
  }
}
