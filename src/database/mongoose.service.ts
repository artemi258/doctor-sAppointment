import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import mongoose from 'mongoose';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class MongooseService {
	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {}

	async connect(): Promise<void> {
		try {
			await mongoose.connect(
				`mongodb://${this.configService.get('MONGO_LOGIN')}:${this.configService.get(
					'MONGO_PASSWORD'
				)}@mongo:27017/admin`
			);

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
