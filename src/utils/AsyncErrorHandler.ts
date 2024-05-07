import { Request, Response, NextFunction } from "express";

interface AsyncRouteHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export default class AsyncErrorHandler {
  static wrapper(
    func: AsyncRouteHandler
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req, res, next) => {
      func(req, res, next).catch((err) => next(err));
    };
  }
}
