import { injectable } from 'inversify';
import { UserModel } from './user.model';

@injectable()
export class MainClassModel {
	userModel: typeof UserModel;

	constructor() {
		this.userModel = UserModel;
	}
	get user(): typeof UserModel {
		return this.userModel;
	}
}
