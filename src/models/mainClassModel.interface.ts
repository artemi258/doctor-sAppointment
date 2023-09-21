import { TaskModel } from './task.model';
import { UserModel } from './user.model';

export interface IMainClassModel {
	get user(): typeof UserModel;
	get task(): typeof TaskModel;
}
