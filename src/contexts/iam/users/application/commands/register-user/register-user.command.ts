import { Command } from '@nestjs/cqrs';

export interface RegisterUserPayload {
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

export class RegisterUserCommand extends Command<{ id: string }> {
  constructor(public readonly payload: RegisterUserPayload) {
    super();
  }
}
