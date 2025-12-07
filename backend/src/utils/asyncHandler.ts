import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async express handler and forwards errors to the express error middleware.
 * This removes try/catch duplication from the controller functions.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
