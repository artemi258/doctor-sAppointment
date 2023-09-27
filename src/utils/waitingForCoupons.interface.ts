import { Page } from 'puppeteer';
import { ILogger } from '../logger/logger.interface';
import { ObjectId } from 'mongoose';

export interface IWaitingForCoupons {
	getCoupons: (
		page: Page,
		doctorName: string,
		email: string,
		url: string,
		logger: ILogger,
		taskId: ObjectId
	) => void;
	getCouponsByDate: (
		page: Page,
		doctorName: string,
		email: string,
		url: string,
		byDate: Date,
		logger: ILogger,
		taskId: ObjectId
	) => void;
}
