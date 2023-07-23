import { ITasksService } from './src/tasks/tasks.service.interface';
export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	ITasksController: Symbol.for('ITasksController'),
	ITasksService: Symbol.for('ITasksService'),
};
