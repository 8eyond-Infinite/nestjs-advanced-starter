import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { UserRepositoryPort } from './users/application/ports/user.repository.port';
import { IdGenerator } from './users/application/ports/id-generator.port';
import { PasswordHasher } from './users/application/ports/password-hasher.port';

import { PrismaUserRepository } from './users/infrastructure/repositories/prisma-user.repository';
import { UuidGeneratorAdapter } from './users/infrastructure/generators/uuid-generator.adapter';
import { BcryptHasherAdapter } from './users/infrastructure/security/bcrypt-hasher.adapter';

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
      provide: UserRepositoryPort,
      useClass: PrismaUserRepository,
    },
    {
      provide: PasswordHasher,
      useClass: BcryptHasherAdapter,
    },
    {
      provide: IdGenerator,
      useClass: UuidGeneratorAdapter,
    },
  ],
  exports: [UserRepositoryPort, PasswordHasher, IdGenerator],
})
export class IamModule {}
