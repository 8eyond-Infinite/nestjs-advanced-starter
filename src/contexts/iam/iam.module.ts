import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './users/domain/user.repository';
import { PrismaUserRepository } from './users/infrastructure/repositories/prisma-user.repository';
import { UserCommandHandlers } from '../iam/users/application/commands';
import { UserEventHandlers } from '../iam/users/application/events/handlers';
import { UserQueryHandlers } from '../iam/users/application/queries';
import { UsersController } from './users/infrastructure/http/controllers/users.controller';

@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class IamModule {}
