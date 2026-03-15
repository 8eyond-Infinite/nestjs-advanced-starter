import { Command } from '@nestjs/cqrs';
import { User } from '../../../domain/entities/user.entity';

export interface RegisterUserPayload {
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

export class RegisterUserCommand extends Command<User> {
  constructor(public readonly payload: RegisterUserPayload) {
    super();
  }
}
