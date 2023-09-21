import { inject } from 'inversify';
import os from 'os';
import { BaseController } from '../common/base.controller';
import { ITasksController } from './tasks.controller.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IControllerRoute } from '../common/route.interface';
import { Request, Response, NextFunction } from 'express';
import { NearestTicketDto } from './dto/task-nearestTicket.dto';
import { ITasksService } from './tasks.service.interface';
import { BySelectedDateDto } from './dto/task-bySelectedDate';
import { UserModel } from '../models/user.model';

export class TasksController extends BaseController implements ITasksController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.TasksService) private tasksService: ITasksService
	) {
		super(loggerService);
		this.bindRoutes(this.tasksRouter);
	}

	get tasksRouter(): IControllerRoute[] {
		return [
			{
				path: '/tasks/nearestTicket',
				func: this.taskNearestTicket,
				method: 'post',
			},
			{
				path: '/tasks/bySelectedDate',
				func: this.bySelectedDate,
				method: 'post',
			},
			{
				path: '/create',
				func: this.create,
				method: 'post',
			},
			{
				path: '/update',
				func: this.task,
				method: 'post',
			},
			{
				path: '/find',
				func: this.find,
				method: 'post',
			},
		];
	}

	create = (req: Request, res: Response, next: NextFunction): void => {
		this.loggerService.log(req.body);
		UserModel.create(req.body).then((res) => this.loggerService.log(res));
		res.send();
	};
	task = (req: Request, res: Response, next: NextFunction): void => {
		this.loggerService.log(req.body);
		UserModel.findByIdAndUpdate('650b3fa699d66b13945ae8a7', {
			$push: { tasks: { nameTask: req.body.nameTask, url: 'poiuytrewq' } },
		}).then((res) => this.loggerService.log(res));
		res.send();
	};
	find = (req: Request, res: Response, next: NextFunction): void => {
		this.loggerService.log(req.body);
		UserModel.findById('650b3fa699d66b13945ae8a7').then((res) => this.loggerService.log(res));
		res.send();
	};

	taskNearestTicket = (
		{ body }: Request<{}, {}, NearestTicketDto>,
		res: Response,
		next: NextFunction
	): void => {
		this.tasksService
			.createTaskNearestTicket(body)
			.then((result) => {
				this.loggerService.log(
					`емаил: ${body.email} ФИО доктора: ${result.doctorName} - задача создана`
				);
				const mem = Math.round((os.freemem() / os.totalmem()) * 100);
				this.loggerService.log(`осталось свободной памяти: ${mem}%`);
				this.created(res);
			})
			.catch((err) => {
				next(err);
			});
	};
	bySelectedDate = (
		{ body }: Request<{}, {}, BySelectedDateDto>,
		res: Response,
		next: NextFunction
	): void => {
		this.tasksService
			.createTaskBySelectedDate(body)
			.then((result) => {
				this.loggerService.log(
					`емаил: ${body.email} ФИО доктора: ${result.doctorName} - задача создана по ${body.byDate}`
				);
				const mem = Math.round((os.freemem() / os.totalmem()) * 100);
				this.loggerService.log(`осталось свободной памяти: ${mem}%`);
				this.created(res);
			})
			.catch((err) => {
				next(err);
			});
	};
}
