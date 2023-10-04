import { NextFunction, Request, Response } from 'express';
import { IControllerRoute } from '../common/route.interface';

export interface ITasksController {
	get tasksRouter(): IControllerRoute[];
	taskNearestTicket: (req: Request, res: Response, next: NextFunction) => void;
}
