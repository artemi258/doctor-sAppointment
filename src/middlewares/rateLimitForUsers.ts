import rateLimit from "express-rate-limit";
import { IMiddleware } from "../common/middleware.interface";
import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../errors/http-error.class";

export class RateLimitForUsers implements IMiddleware {
  excute = () => {
    return rateLimit({
      windowMs: 1000 * 60 * 60 * 24,
      limit: 2,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      skipFailedRequests: true,
      handler: (req: Request, res: Response, next: NextFunction, options) => {
        const hours = Math.floor(
          +(req.res?.getHeaders()["retry-after"]?.valueOf() ?? 0) / 60 / 60
        );
        const minuts = Math.floor(
          (+(req.res?.getHeaders()["retry-after"]?.valueOf() ?? 0) / 60) % 60
        );

        next(
          new HTTPError(
            options.statusCode,
            `превышен лимит создания задач, лимит будет снят через 24ч. после получения лимита. Осталось: ${
              hours < 10 ? "0" + hours : hours
            }:${minuts < 10 ? "0" + minuts : minuts}ч.`,
            "rateLimit"
          )
        );
      },
    });
  };
}
