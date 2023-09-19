import { CustomError } from "./customError.js";

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}
