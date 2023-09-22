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
import { ITasksRepository } from './tasks.repository.interface';

export class TasksController extends BaseController implements ITasksController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.TasksService) private tasksService: ITasksService,
		@inject(TYPES.TasksRepository) private tasksRepository: ITasksRepository
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
				path: '/createUser',
				func: this.createUser,
				method: 'post',
			},
			{
				path: '/deleteTask',
				func: this.deleteTask,
				method: 'post',
			},
			{
				path: '/findUserByTaskId',
				func: this.findUserByTaskId,
				method: 'post',
			},
			// {
			// 	path: '/createUserAndTask',
			// 	func: this.createUserAndTask,
			// 	method: 'post',
			// },
			// {
			// 	path: '/find',
			// 	func: this.find,
			// 	method: 'get',
			// },
		];
	}

	deleteTask = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.tasksRepository.deleteTask(req.body.id);
		res.json(result);
	};

	createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const result = await this.tasksRepository.createUser(req.body.email);
		res.json(result);
	};
	findUserByTaskId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const result = await this.tasksRepository.findUserByTaskId(req.body.id);
		res.json(result);
	};
	// createTask = (req: Request, res: Response, next: NextFunction): void => {
	// 	const result = this.tasksRepository.createTask(req.body.id, {
	// 		nameTask: req.body.nameTask,
	// 		url: req.body.url,
	// 	});
	// 	res.send(result);
	// };
	// createUserAndTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// 	const result = await this.tasksRepository.createUserAndTask(req.body.email, {
	// 		nameTask: req.body.nameTask,
	// 		url: req.body.url,
	// 	});
	// 	res.send(result);
	// };
	// find = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// 	const result = await this.tasksRepository.findUsers();

	// 	res.send(result);
	// };

	taskNearestTicket = (
		{ body }: Request<{}, {}, NearestTicketDto>,
		res: Response,
		next: NextFunction
	): void => {
		this.tasksService
			.createTaskNearestTicketServise(body)
			.then((result) => {
				this.loggerService.log(
					`емаил: ${body.email} ФИО доктора: ${result.doctorName} - задача создана`
				);
				const mem = Math.round((os.freemem() / os.totalmem()) * 100);
				this.loggerService.log(`осталось свободной памяти: ${mem}%`);
				this.created(res, result.doctorName);
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
			.createTaskBySelectedDateServise(body)
			.then((result) => {
				this.loggerService.log(
					`емаил: ${body.email} ФИО доктора: ${result.doctorName} - задача создана по ${body.byDate}`
				);
				const mem = Math.round((os.freemem() / os.totalmem()) * 100);
				this.loggerService.log(`осталось свободной памяти: ${mem}%`);
				this.created(res, result.doctorName);
			})
			.catch((err) => {
				next(err);
			});
	};
}
