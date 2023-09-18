import { DotenvConfigOutput, config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvConfigOutput | undefined;
	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('Не удалось прочитать файл .env или он отсутствует');
		} else {
			this.config = result.parsed as DotenvConfigOutput;
		}
	}

	get(key: string): string | undefined {
		if (this.config) return this.config[key as keyof DotenvConfigOutput] as unknown as string;
	}
}
