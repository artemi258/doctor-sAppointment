import { injectable } from 'inversify';
import { TaskModel } from './task.model';
import { UserModel } from './user.model';

@injectable()
export class MainClassModel {
	userModel: typeof UserModel;
	taskModel: typeof TaskModel;

	constructor() {
		this.userModel = UserModel;
		this.taskModel = TaskModel;
	}
	get user(): typeof UserModel {
		return this.userModel;
	}
	get task(): typeof TaskModel {
		return this.taskModel;
	}
}
