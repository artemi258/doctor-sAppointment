import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from '../types';
import { App } from './app';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { ITasksController } from './tasks/tasks.controller.interface';
import { TasksController } from './tasks/tasks.controller';
import { ITasksService } from './tasks/tasks.service.interface';
import { TasksService } from './tasks/tasks.service';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<ITasksController>(TYPES.ITasksController).to(TasksController).inSingletonScope();
	bind<ITasksService>(TYPES.ITasksService).to(TasksService).inSingletonScope();
});

const bootstrap = () => {
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	// setInterval(() => {
	// 	fetch('https://doctor-sappointment.onrender.com', {
	// 		method: 'GET',
	// 	});
	// 	console.log('прошло 14 минут!');
	// }, 1000 * 60 * 14);
};

bootstrap();
