import { Page } from 'puppeteer';
import { ILogger } from '../logger/logger.interface';

export interface IWaitingForCoupons {
	getCoupons: (page: Page, doctorName: string, email: string, logger: ILogger) => void;
	getCouponsByDate: (
		page: Page,
		doctorName: string,
		email: string,
		byDate: Date,
		logger: ILogger
	) => void;
}
