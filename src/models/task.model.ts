import mongoose, { ObjectId, Schema, model } from 'mongoose';
import { UserModel } from './user.model';

type task = 'nearestTicket' | 'byDateTicket';

interface ITask {
	nameTask: task;
	url: string;
	// userId: ObjectId;
}

const taskSchema = new Schema<ITask>({
	nameTask: { type: String, required: true },
	url: { type: String, required: true },
	// userId: { type: mongoose.Types.ObjectId, ref: UserModel.name },
});

export const TaskModel = model<ITask>('Task', taskSchema);
