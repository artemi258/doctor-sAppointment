import mongoose, { ObjectId, Schema, model } from 'mongoose';

type task = 'nearestTicket' | 'byDateTicket';

interface ITask {
	nameTask: task;
	url: string;
}

interface IUser {
	email: string;
	tasks: ITask[];
}

const userSchema = new Schema<IUser>(
	{
		email: { type: String, unique: true, lowercase: true },
		tasks: [{ nameTask: String, url: String }],
	},
	{ timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);
