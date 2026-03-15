import { User as PrismaUser } from '../../../../../shared/infrastructure/prisma/generated';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User(
      UserId.create(raw.id),
      raw.email,
      raw.passwordHash,
      raw.createdAt,
    );
  }

  static toPersistence(user: User) {
    return {
      id: user.id.value,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  }
}
