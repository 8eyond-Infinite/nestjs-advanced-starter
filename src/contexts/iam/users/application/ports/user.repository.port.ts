import { User } from '../../domain/entities/user.entity';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
