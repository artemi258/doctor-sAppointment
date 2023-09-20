import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import mongoose from 'mongoose';

@injectable()
export class MongooseService {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}

	async connect(): Promise<void> {
		try {
			await mongoose.connect('mongodb://127.0.0.1:27017/test');

			this.logger.log('[MongooseService] Успешно подключились к базе данных');
		} catch (error) {
			if (error instanceof Error)
				this.logger.error(`[MongooseService] Ошибка подключения к базе данных: ${error.message}`);
		}
	}
	async disconnect(): Promise<void> {
		await mongoose.disconnect();
	}
}
