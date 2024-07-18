import { CustomError } from './customError.js';

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}
