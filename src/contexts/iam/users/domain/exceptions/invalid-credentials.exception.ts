export class InvalidCredentialsException extends Error {
  constructor() {
    super('The credentials provided are invalid in this reality');
    this.name = 'InvalidCredentialsException';
  }
}
