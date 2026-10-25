export class InvalidGameRulesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGameRulesError';
  }
}