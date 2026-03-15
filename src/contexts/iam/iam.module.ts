import { Module } from '@nestjs/common';
import { UserRepository } from './users/domain/user.repository';
import { PrismaUserRepository } from './users/infrastructure/repositories/prisma-user.repository';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class IamModule {}
