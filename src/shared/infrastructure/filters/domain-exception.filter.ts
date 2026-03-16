import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { IdentityAlreadyExistsException } from '../../../contexts/iam/users/domain/exceptions/identity-already-exists.exception';

@Catch(IdentityAlreadyExistsException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: IdentityAlreadyExistsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(409).json({
      statusCode: 409,
      message: exception.message,
      error: 'Conflict',
    });
  }
}
