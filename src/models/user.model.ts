import mongoose, { Schema, model, connect } from 'mongoose';

interface IUser {
	email: string;
}

const userSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true, lowercase: true },
});

const UserModel = model<IUser>('User', userSchema);
UserModel.create({ email: 3 });
