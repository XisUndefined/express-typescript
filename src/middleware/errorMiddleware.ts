import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../utils/ResponseError";

export const globalErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ResponseError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stackTrace: error.stack,
      error,
    });
  } else {
    res.status(500).json({
      status: "status",
      message: error.message,
      stackTrace: error.stack,
      error,
    });
  }
};
