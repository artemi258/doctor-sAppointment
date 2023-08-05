import { inject, injectable } from 'inversify';
import puppeteer, { Browser, Page } from 'puppeteer';
import { NearestTicketDto } from './dto/task-nearestTicket.dto';
import { ITasksService } from './tasks.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { getCoupons } from '../utils/getCoupons';
import { BySelectedDateDto } from './dto/task-bySelectedDate';
import { getCouponsByDate } from '../utils/getCouponsByDate';

@injectable()
export class TasksService implements ITasksService {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}

	createTaskNearestTicket = async ({ email, url }: NearestTicketDto): Promise<boolean> => {
		try {
			let doctorName: string | undefined;

			const browser: Browser = await puppeteer.launch();
			const page: Page = await browser.newPage();

			await page.goto(url);

			doctorName =
				(await page.$$eval('.text-primary.loader-link', (link) => {
					if (link) {
						return link.pop()?.textContent;
					}
				})) ?? '';

			getCoupons(page, browser, doctorName, email, this.logger);

			return true;
		} catch (error) {
			throw new Error('ошибка создания задачи');
		}
	};

	createTaskBySelectedDate = async ({ email, url, byDate }: BySelectedDateDto) => {
		try {
			let doctorName: string | undefined;

			const browser: Browser = await puppeteer.launch();
			const page: Page = await browser.newPage();

			await page.goto(url);

			doctorName =
				(await page.$$eval('.text-primary.loader-link', (link) => {
					if (link) {
						return link.pop()?.textContent;
					}
				})) ?? '';

			getCouponsByDate(page, browser, doctorName, email, byDate, this.logger);

			return true;
		} catch (error) {
			throw new Error('ошибка создания задачи');
		}
	};
}
