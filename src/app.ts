import { TasksController } from './tasks/tasks.controller';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { RateLimitForUsers } from './middlewares/rateLimitForUsers.middleware';
import { CheckingFreeMemory } from './middlewares/checkingFreeMemory.middleware';
import { MongooseService } from './database/mongoose.service';
import { ITasksService } from './tasks/tasks.service.interface';
import { ITasksRepository } from './tasks/tasks.repository.interface';
import { IWaitingForCoupons } from './utils/waitingForCoupons.interface';

@injectable()
export class App {
	app: Express;
	server: Server | undefined;
	port: number | string;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.TasksController) private tasksController: TasksController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.MongooseService) private mongooseService: MongooseService,
		@inject(TYPES.TasksService) private tasksService: ITasksService,
		@inject(TYPES.TasksRepository) private tasksRepository: ITasksRepository,
		@inject(TYPES.WaitingForCoupons) private waitingForCoupons: IWaitingForCoupons
	) {
		this.app = express();
		this.port = process.env.PORT ?? 8089;
	}

	useMiddleware = (): void => {
		this.app.use(express.json());
		this.app.use(cors());
		this.app.use(new RateLimitForUsers(this.logger).excute());
		this.app.use(new CheckingFreeMemory().excute);
	};

	useRoutes = (): void => {
		this.app.use('/api', this.tasksController.router);
	};

	useExeptionFilters = (): void => {
		this.app.use(this.exeptionFilter.catch);
	};

	public init = async (): Promise<void> => {
		this.app.set('trust proxy', 1);
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на ${this.port} порту`);
		await this.tasksService.initBrowser();
		await this.mongooseService.connect();
		const users = await this.tasksRepository.findAllUsers();

		for (let user of users) {
			const { tasks } = user;
			for (let task of tasks) {
				if (task.nameTask === 'nearestTicket') {
					this.tasksService.createTaskNearestTicket(
						{ email: user.email, url: task.url },
						task.doctorName,
						task._id
					);
				} else {
					this.tasksService.createTaskBySelectedDate(
						{ email: user.email, url: task.url, byDate: task.byDate! },
						task.doctorName,
						task._id
					);
				}
			}
		}
	};

	public close(): void {
		this.server?.close();
	}
}
