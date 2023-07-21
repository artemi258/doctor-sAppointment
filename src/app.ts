import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { TYPES } from '../types';
import { ILogger } from './logger/logger.interface';

@injectable()
export class App {
	app: Express;
	server: Server | undefined;
	port: number;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.json());
		this.app.use(cors());
	}

	useRoutes(): void {}

	useExeptionFilters(): void {}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на ${this.port} порту`);
	}

	public close(): void {
		this.server?.close();
	}
}

// exports.server = () => {
// 	const port = process.env.PORT || 5000;
// 	const app = express();

// 	app.use(cors());
// 	app.use(express.json());

// 	app.listen(port, () => {
// 		console.log('Сервер запущен!');
// 	});

// 	routes();
// };
