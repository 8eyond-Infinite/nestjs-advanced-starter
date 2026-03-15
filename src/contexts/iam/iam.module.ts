import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './users/domain/user.repository';
import { PrismaUserRepository } from './users/infrastructure/repositories/prisma-user.repository';
import { UserCommandHandlers } from '../iam/users/application/commands';
import { UserEventHandlers } from '../iam/users/application/events/handlers';
import { UsersController } from './users/infrastructure/http/controllers/users.controller';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    ...UserCommandHandlers,
    ...UserEventHandlers,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class IamModule {}
