import { User } from '../../../domain/entities/user.entity';

export class UserResponse {
  readonly id: string;
  readonly email: string;
  readonly createdAt: string;

  private constructor(id: string, email: string, createdAt: Date) {
    this.id = id;
    this.email = email;
    this.createdAt = createdAt.toISOString();
  }

  static fromEntity(entity: User): UserResponse {
    return new UserResponse(entity.id.value, entity.email, entity.createdAt);
  }
}
