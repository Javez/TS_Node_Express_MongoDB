import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import HttpExeption from "../exceptions/Http.exeption";

function validationMiddleware<T>(
  type: any,
  skipMissProperties = false
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req.body), {
      skipMissingProperties: skipMissProperties,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) =>
            Object.values(error.constraints as any)
          )
          .join(", ");
        next(new HttpExeption(400, message));
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
