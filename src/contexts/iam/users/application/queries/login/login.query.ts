import { IQuery } from '@nestjs/cqrs';
import { LoginRequest } from '../../../infrastructure/http/requests/login-user.request';

export class LoginQuery implements IQuery {
  constructor(public readonly payload: LoginRequest) {}
}
