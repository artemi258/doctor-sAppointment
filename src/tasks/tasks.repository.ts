import mongoose, { ObjectId } from 'mongoose';
import { inject, injectable } from 'inversify';
import { ITasksRepository } from './tasks.repository.interface';
import { TYPES } from '../types';
import { ITask, IUser } from '../models/user.model';
import { IMainClassModel } from '../models/mainClassModel.interface';

@injectable()
export class TasksRepository implements ITasksRepository {
	constructor(@inject(TYPES.MainClassModel) private models: IMainClassModel) {}

	createUser = async (
		email: string
	): Promise<
		mongoose.Document<unknown, {}, IUser> &
			IUser & {
				_id: mongoose.Types.ObjectId;
			}
	> => {
		return await this.models.user.create({ email });
	};

	createUserAndTask = async (
		email: string,
		task: Omit<ITask, '_id'>
	): Promise<
		| (mongoose.Document<unknown, {}, IUser> &
				IUser & {
					_id: mongoose.Types.ObjectId;
				})
		| null
	> => {
		const user = await this.models.user.findOne({ email }).lean().exec();
		if (user) {
			return await this.createTask(user._id, task);
		}

		const newUser = await this.createUser(email);
		return await this.createTask(newUser._id, task);
	};

	createTask = async (
		id: string | mongoose.Types.ObjectId,
		{ nameTask, doctorName, url, byDate }: Omit<ITask, '_id'>
	): Promise<
		| (mongoose.Document<unknown, {}, IUser> &
				IUser & {
					_id: mongoose.Types.ObjectId;
				})
		| null
	> => {
		const taskData = byDate ? { nameTask, doctorName, url, byDate } : { nameTask, doctorName, url };

		return await this.models.user
			.findByIdAndUpdate(
				id,
				{
					$push: { tasks: taskData },
				},
				{ new: true }
			)
			.lean();
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

	findAllUsers = async (): Promise<
		(mongoose.FlattenMaps<IUser> & {
			_id: mongoose.Types.ObjectId;
		})[]
	> => {
		return await this.models.user.find({}).lean().exec();
	};

	deleteTask = async (
		taskId: ObjectId
	): Promise<
		| (mongoose.FlattenMaps<IUser> & {
				_id: mongoose.Types.ObjectId;
		  })
		| null
	> => {
		const user = await this.findUserByTaskId(taskId);

		if (user && user.tasks.length === 1) {
			return await this.models.user.findOneAndDelete({ 'tasks._id': taskId }).lean().exec();
		}
		return await this.models.user
			.findOneAndUpdate(
				{ 'tasks._id': taskId },
				{ $pull: { tasks: { _id: taskId } } },
				{ new: true }
			)
			.lean()
			.exec();
	};

	findUserByTaskId = async (
		taskId: ObjectId
	): Promise<
		| (mongoose.FlattenMaps<IUser> & {
				_id: mongoose.Types.ObjectId;
		  })
		| null
	> => {
		return await this.models.user.findOne({ 'tasks._id': taskId }).lean().exec();
	};
}
