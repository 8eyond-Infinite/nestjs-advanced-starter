import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginQuery } from './login.query';
import { UserRepository } from '../../../domain/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { PasswordHasher } from '../../ports/password-hasher.port'; // Dùng Port
import { InvalidCredentialsException } from '../../../domain/exceptions/invalid-credentials.exception';

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(query: LoginQuery): Promise<User> {
    const { email, password } = query.payload;
    const user = await this.userRepository.findByEmail(email);
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
