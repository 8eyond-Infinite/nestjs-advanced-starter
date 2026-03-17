import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';

import { RegisterUserCommand } from './register-user.command';
import { UserRepositoryPort } from '../../ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { IdGenerator } from '../../ports/id-generator.port';
import { IdentityAlreadyExistsException } from 'src/contexts/iam/users/domain/exceptions/identity-already-exists.exception';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly publisher: EventPublisher,
    private readonly passwordHasher: PasswordHasher,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { email, password } = command.payload;

    const existingUser = await this.userRepositoryPort.findByEmail(email);
    if (existingUser) {
      throw new IdentityAlreadyExistsException(email);
    }

    const userId = this.idGenerator.generate();
    const passwordHash = await this.passwordHasher.hash(password);

    const user = this.publisher.mergeObjectContext(
      User.create(userId, email, passwordHash),
    );

    user.register();

    await this.userRepositoryPort.save(user);
    user.commit();

    return user;
  }
}
