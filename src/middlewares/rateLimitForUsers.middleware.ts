import rateLimit, { Options } from 'express-rate-limit';
import { IMiddleware } from '../common/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';

export class RateLimitForUsers implements IMiddleware {
	constructor(private logger: ILogger) {}

	excute = () => {
		return rateLimit({
			windowMs: 1000 * 60 * 60 * 24,
			limit: 110,
			standardHeaders: 'draft-7',
			legacyHeaders: false,
			skipFailedRequests: true,
			handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
				const hours = Math.floor(+(req.res?.getHeaders()['retry-after']?.valueOf() ?? 0) / 60 / 60);
				const minuts = Math.floor(
					(+(req.res?.getHeaders()['retry-after']?.valueOf() ?? 0) / 60) % 60
				);
				this.logger.warn(`превышен лимит ip: ${req.ip}`);
				next(
					new HTTPError(
						options.statusCode,
						`превышен лимит создания задач, лимит будет снят через 24ч. после получения лимита. Осталось: ${
							hours < 10 ? '0' + hours : hours
						}:${minuts < 10 ? '0' + minuts : minuts}ч.`,
						'rateLimit'
					)
				);
			},
		});
	};
}
