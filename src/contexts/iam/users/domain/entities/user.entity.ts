import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { UserId } from '../value-objects/user-id.vo';
import { UserRegisteredEvent } from '../events/user-registered.event';

export class User extends AggregateRoot<IEvent> {
  constructor(
    public readonly id: UserId,
    public readonly email: string,
    private _passwordHash: string,
    public readonly createdAt: Date,
  ) {
    super();
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  public updatePassword(newHash: string): void {
    this._passwordHash = newHash;
  }

  register() {
    this.apply(new UserRegisteredEvent(this.id.value, this.email));
  }
}
