import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError{
    statusCode = 400;
    reason = "";
  
    constructor(message:string) {
      super("");
      this.reason=message;
      Object.setPrototypeOf(this, BadRequestError.prototype);
    }
  
    serializeErrors() {
      return [{ message: this.reason }];
    }
}