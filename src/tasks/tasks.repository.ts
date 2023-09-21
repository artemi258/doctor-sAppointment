import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { ITasksRepository } from './tasks.repository.interface';
import { TYPES } from '../types';
import { ITask, IUser } from '../models/user.model';
import { IMainClassModel } from '../models/mainClassModel.interface';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class TasksRepository implements ITasksRepository {
	constructor(
		@inject(TYPES.MainClassModel) private models: IMainClassModel,
		@inject(TYPES.Logger) private logger: ILogger
	) {}

	createUser = async (
		email: string
	): Promise<
		mongoose.Document<unknown, {}, IUser> &
			IUser & {
				_id: mongoose.Types.ObjectId;
			}
	> => {
		return this.models.user.create({ email });
	};

	createTask = async (
		id: string | mongoose.Types.ObjectId,
		task: ITask
	): Promise<
		| (mongoose.Document<unknown, {}, IUser> &
				IUser & {
					_id: mongoose.Types.ObjectId;
				})
		| null
	> => {
		return await this.models.user.findByIdAndUpdate(id, {
			$push: { tasks: { nameTask: task.nameTask, url: task.url } },
		});
	};

	createUserAndTask = async (email: string, task: ITask) => {
		const user = await this.models.user.findOne({ email }).exec();
		if (user) {
			return await this.createTask(user._id, task);
		}

		return await this.createUser(email).then((user) => this.createTask(user._id, task));
	};
	findUsers = async () => {
		let arr: unknown = [];
		const res = await this.models.user
			.find({})
			.exec()
			.then((res) => {
				this.logger.log(res);
				arr = [...res];
			});
		this.logger.log(arr);
		return arr;
	};
	deleteTask = () => {};
	deleteUser = () => {};
}
