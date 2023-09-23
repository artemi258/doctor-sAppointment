import { Container, ContainerModule, interfaces } from 'inversify';
import { setMaxListeners } from 'events';
import { TYPES } from './types';
import { App } from './app';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { ITasksController } from './tasks/tasks.controller.interface';
import { TasksController } from './tasks/tasks.controller';
import { ITasksService } from './tasks/tasks.service.interface';
import { TasksService } from './tasks/tasks.service';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { IWaitingForCoupons } from './utils/waitingForCoupons.interface';
import { WaitingForCoupons } from './utils/waitingForCoupons';
import { ISendMail } from './utils/sendMail.interface';
import { SendMail } from './utils/sendMail';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { MongooseService } from './database/mongoose.service';
import { IMainClassModel } from './models/mainClassModel.interface';
import { MainClassModel } from './models/mainClassModel';
import { ITasksRepository } from './tasks/tasks.repository.interface';
import { TasksRepository } from './tasks/tasks.repository';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
	bind<ITasksController>(TYPES.TasksController).to(TasksController).inSingletonScope();
	bind<ITasksService>(TYPES.TasksService).to(TasksService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IWaitingForCoupons>(TYPES.WaitingForCoupons).to(WaitingForCoupons).inSingletonScope();
	bind<ISendMail>(TYPES.SendMail).to(SendMail).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<MongooseService>(TYPES.MongooseService).to(MongooseService).inSingletonScope();
	bind<IMainClassModel>(TYPES.MainClassModel).to(MainClassModel).inSingletonScope();
	bind<ITasksRepository>(TYPES.TasksRepository).to(TasksRepository).inSingletonScope();
});

const bootstrap = () => {
	setMaxListeners(200);
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
};

bootstrap();
