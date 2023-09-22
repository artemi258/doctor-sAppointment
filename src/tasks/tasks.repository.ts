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
		const result = await this.models.user.create({ email });
		return result;
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
		return await this.models.user
			.findByIdAndUpdate(
				id,
				{
					$push: { tasks: { nameTask: task.nameTask, doctorName: task.doctorName, url: task.url } },
				},
				{ new: true }
			)
			.lean();
	};

	createUserAndTask = async (email: string, task: ITask) => {
		const user = await this.models.user.findOne({ email }).lean().exec();
		if (user) {
			return await this.createTask(user._id, task);
		}

		const newUser = await this.createUser(email);
		return await this.createTask(newUser._id, task);
	};

	findUser = async (
		email: string
	): Promise<
		| (mongoose.FlattenMaps<IUser> & {
				_id: mongoose.Types.ObjectId;
		  })
		| null
	> => {
		return await this.models.user.findOne({ email }).lean().exec();
	};

	deleteTask = () => {};

	deleteUser = () => {};
}
