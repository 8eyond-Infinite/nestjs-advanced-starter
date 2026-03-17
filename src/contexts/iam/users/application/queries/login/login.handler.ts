import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginQuery } from './login.query';
import { UserRepositoryPort } from '../../../application/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { InvalidCredentialsException } from '../../../domain/exceptions/invalid-credentials.exception';

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(query: LoginQuery): Promise<User> {
    const { email, password } = query.payload;
    const user = await this.userRepositoryPort.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
