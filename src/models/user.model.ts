import { ObjectId, Schema, model } from 'mongoose';

type task = 'nearestTicket' | 'byDateTicket';

export interface ITask {
	nameTask: task;
	doctorName: string;
	url: string;
	byDate?: Date;
	_id: ObjectId;
}

export interface IUser {
	email: string;
	tasks: ITask[];
}

const userSchema = new Schema<IUser>(
	{
		email: { type: String, unique: true, lowercase: true },
		tasks: [{ nameTask: String, doctorName: String, url: String, byDate: String }],
	},
	{ timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);
