import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs'; // Sửa import EventPublisher
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { RegisterUserCommand } from './register-user.command';
import { UserRepository } from '../../../domain/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserId } from '../../../domain/value-objects/user-id.vo';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<{ id: string }> {
    const { email, password } = command.payload;

    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Identity already exists in this reality');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = this.publisher.mergeObjectContext(
        new User(UserId.create(uuidv4()), email, passwordHash, new Date()),
      );

      user.register();

      await this.userRepository.save(user);
      user.commit();

      return { id: user.id.value };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('Registration flow failed:', error);
      throw new InternalServerErrorException(
        'Failed to manifest user in reality',
      );
    }
  }
}
