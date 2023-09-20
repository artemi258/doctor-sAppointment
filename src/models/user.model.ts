import { Schema, model, connect } from 'mongoose';

interface IUser {
	email: string;
}

const userSchema = new Schema<IUser>({
	email: { type: String, required: true },
});

const User = model<IUser>('User', userSchema);
