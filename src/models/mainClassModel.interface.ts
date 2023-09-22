import { UserModel } from './user.model';

export interface IMainClassModel {
	get user(): typeof UserModel;
}
