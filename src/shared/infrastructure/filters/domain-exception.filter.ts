// src/shared/infrastructure/filters/domain-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IdentityAlreadyExistsException } from '../../../contexts/iam/users/domain/exceptions/identity-already-exists.exception';
import { InvalidCredentialsException } from '../../../contexts/iam/users/domain/exceptions/invalid-credentials.exception';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionMap = new Map<
    string,
    { status: number; error: string }
  >([
    [
      IdentityAlreadyExistsException.name,
      { status: HttpStatus.CONFLICT, error: 'Conflict' },
    ],
    [
      InvalidCredentialsException.name,
      { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized' },
    ],
  ]);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionConfig = this.exceptionMap.get(exception.constructor.name);
    if (exceptionConfig) {
      return response.status(exceptionConfig.status).json({
        statusCode: exceptionConfig.status,
        message: exception.message,
        error: exceptionConfig.error,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'An unexpected error occurred in this reality',
      error: 'Internal Server Error',
    });
  }
}
