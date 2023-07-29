import { Logger, ILogObj, ISettingsParam } from 'tslog';
import { ILogger } from './logger.interface';
import { decorate, injectable } from 'inversify';

export class LoggerService implements ILogger {
	public logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			hideLogPositionForProduction: true,
			displayFunctionName: false,
		} as ISettingsParam<ILogObj>);
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
decorate(injectable(), LoggerService);
