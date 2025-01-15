import { Request, Response, NextFunction } from "express";
import HttpExeption from "../exceptions/Http.exeption";

function errorMiddleware(
  error: HttpExeption,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  res.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
