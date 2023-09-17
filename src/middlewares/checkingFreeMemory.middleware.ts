import { Request, Response, NextFunction } from 'express';
import os from 'os';
import { IMiddleware } from '../common/middleware.interface';

export class CheckingFreeMemory implements IMiddleware {
	excute = (req: Request, res: Response, next: NextFunction) => {
		const mem = Math.round((os.freemem() / os.totalmem()) * 100);
		if (mem < 10) {
			return next({
				message:
					'вревышен лимит заявок на отслеживания талонов, попробуйте в другой раз, возможно освободится место для вас!',
			});
		}
		next();
	};
}
