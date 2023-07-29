import { TasksController } from './tasks/tasks.controller';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';

@injectable()
export class App {
	app: Express;
	server: Server | undefined;
	port: number;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.TasksController) private tasksController: TasksController
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware = (): void => {
		this.app.use(express.json());
		this.app.use(cors());
	};

	useRoutes = (): void => {
		this.app.use('/api', this.tasksController.router);
	};

	useExeptionFilters = (): void => {};

	public init = (): void => {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на ${this.port} порту`);
	};

	public close(): void {
		this.server?.close();
	}
}