import { validate as validateUuid } from 'uuid';
import { BaseId } from 'src/shared/value-objects/base-id.vo';

export class UserId extends BaseId {
  private constructor(value: string) {
    super(value);
  }
  static create(value: string): UserId {
    return new UserId(value);
  }

  protected validate(value: string): void {
    super.validate(value);
    if (!validateUuid(value)) {
      throw new Error(`INVALID_USER_ID_FORMAT: ${value}`);
    }
  }
}
