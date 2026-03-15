import { UserId } from '../value-objects/user-id.vo';

export class User {
  constructor(
    public readonly id: UserId,
    public readonly email: string,
    private _passwordHash: string,
    public readonly createdAt: Date,
  ) {}

  get passwordHash(): string {
    return this._passwordHash;
  }

  public updatePassword(newHash: string): void {
    this._passwordHash = newHash;
  }
}
