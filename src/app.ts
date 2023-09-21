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
import { UserModel } from './models/user.model';
import { TaskModel } from './models/task.model';
import { ObjectId } from 'mongoose';

@injectable()
export class App {
	app: Express;
	server: Server | undefined;
	port: number | string;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.TasksController) private tasksController: TasksController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter
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

	public init = (): void => {
		this.app.set('trust proxy', 1);
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на ${this.port} порту`);
		// UserModel.create({ email: '098qwe@qew.ru' });
		// TaskModel.create({
		// 	nameTask: 'nearestTicket',
		// 	url: 'qwe123',
		// });
		// 650b13de7105b35f5d473d04
		// TaskModel.findOne({ email: 'qwe@qew.ru' })
		// 	.populate('userId')
		// 	.exec()
		// 	.then((res) => this.logger.warn(res));
		// UserModel.findOneAndUpdate(
		// 	{ email: 'qwe@qew.ru' },
		// 	{ $push: { tasks: { nameTask: 'nearest', url: 'qwe123' } } }
		// );
		// this.logger.log(new ObjectId() );
	};

	public close(): void {
		this.server?.close();
	}
}
