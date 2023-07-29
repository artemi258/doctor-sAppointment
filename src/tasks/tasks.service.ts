import { inject, injectable } from 'inversify';
import puppeteer, { Browser, Page } from 'puppeteer';
import { TaskNearestTicketDto } from './dto/task-taskNearestTicket.dto';
import { ITasksService } from './tasks.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { getCoupons } from '../utils/getCoupons';

@injectable()
export class TasksService implements ITasksService {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}

	createTaskNearestTicket = async ({ email, url }: TaskNearestTicketDto): Promise<boolean> => {
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
			this.logger.error('ошибка создания задачи');
			throw new Error('ошибка создания задачи');
		}
	};
}
