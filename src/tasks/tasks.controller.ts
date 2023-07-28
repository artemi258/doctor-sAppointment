import { inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ITasksController } from './tasks.controller.interface';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';
import { IControllerRoute } from '../common/route.interface';
import { Request, Response, NextFunction } from 'express';
import { TaskNearestTicketDto } from './dto/task-taskNearestTicket.dto';
import { ITasksService } from './tasks.service.interface';

export class TasksController extends BaseController implements ITasksController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ITasksService) private tasksService: ITasksService
	) {
		super(loggerService);
		this.bindRoutes(this.tasksRouter);
	}

	get tasksRouter(): IControllerRoute[] {
		return [
			{
				path: '/taskNearestTicket',
				func: this.taskNearestTicket,
				method: 'post',
			},
		];
	}

	taskNearestTicket = (
		{ body }: Request<{}, {}, TaskNearestTicketDto>,
		res: Response,
		next: NextFunction
	): void => {
		this.tasksService
			.createTaskNearestTicket(body)
			.then(() => {
				this.loggerService.log(`${body.email} задача создана`);
				this.created(res);
			})
			.catch((err) => {
				this.loggerService.error(err);
				res.status(500).send('ошибка создания задачи');
			});
	};
}
