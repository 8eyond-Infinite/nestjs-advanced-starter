export class IdentityAlreadyExistsException extends Error {
  constructor(identifier: string) {
    super(`Identity [${identifier}] already exists in this reality`);
    this.name = 'IdentityAlreadyExistsException';
  }
}
