import { NextFunction, Request, Response } from 'express';
import { ITask, IUser } from '../models/user.model';
import mongoose from 'mongoose';

export interface ITasksRepository {
	createUserAndTask: (email: string, task: ITask) => void;
	findUsers: () => void;
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
	// deleteTask: (req: Request, res: Response, next: NextFunction) => void;
	// deleteUser: (req: Request, res: Response, next: NextFunction) => void;
}
