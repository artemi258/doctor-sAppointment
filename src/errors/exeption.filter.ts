import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}
  catch = (
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.contex}] Ошибка ${err.statusCode} : ${err.message}`
      );
      res.status(err.statusCode).send(err.message);
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send(err.message);
    }
  };
}
