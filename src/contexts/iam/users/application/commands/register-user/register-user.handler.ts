import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';

import { RegisterUserCommand } from './register-user.command';
import { UserRepository } from '../../../domain/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { IdGenerator } from '../../ports/id-generator.port';
import { IdentityAlreadyExistsException } from 'src/contexts/iam/users/domain/exceptions/identity-already-exists.exception';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly publisher: EventPublisher,
    private readonly passwordHasher: PasswordHasher,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { email, password } = command.payload;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new IdentityAlreadyExistsException(email);
    }

    const userId = this.idGenerator.generate();
    const passwordHash = await this.passwordHasher.hash(password);

    const user = this.publisher.mergeObjectContext(
      User.create(userId, email, passwordHash),
    );

    user.register();

    await this.userRepository.save(user);
    user.commit();

    return user;
  }
}
