import { NextFunction, Request, Response } from 'express';
import { ITask, IUser } from '../models/user.model';
import mongoose from 'mongoose';

export interface ITasksRepository {
	createUserAndTask: (
		email: string,
		task: ITask
	) => Promise<
		| (mongoose.Document<unknown, {}, IUser> &
				IUser & {
					_id: mongoose.Types.ObjectId;
				})
		| null
	>;
	findUser: (email: string) => Promise<
		| (mongoose.FlattenMaps<IUser> & {
				_id: mongoose.Types.ObjectId;
		  })
		| null
	>;
	createUser: (email: string) => Promise<
		mongoose.Document<unknown, {}, IUser> &
			IUser & {
				_id: mongoose.Types.ObjectId;
			}
	>;
	createTask: (
		id: string,
		task: ITask
	) => Promise<
		| (mongoose.Document<unknown, {}, IUser> &
				IUser & {
					_id: mongoose.Types.ObjectId;
				})
		| null
	>;
	deleteTask: (taskId: string) => void;
	findUserByTaskId: (taskId: string) => Promise<
		| (mongoose.FlattenMaps<IUser> & {
				_id: mongoose.Types.ObjectId;
		  })
		| null
	>;
}
