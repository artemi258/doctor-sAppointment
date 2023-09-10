import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IExeptionFilter } from "./exeption.filter.interface";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}
  catch = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    this.logger.error(`${err.message}`);
    res.status(500).send(err.message);
  };
}
