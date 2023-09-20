import { inject, injectable } from 'inversify';
import puppeteer, { Browser, Page } from 'puppeteer';
import { NearestTicketDto } from './dto/task-nearestTicket.dto';
import { ITasksService } from './tasks.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { BySelectedDateDto } from './dto/task-bySelectedDate';
import { IWaitingForCoupons } from '../utils/waitingForCoupons.interface';

@injectable()
export class TasksService implements ITasksService {
	browser: Browser;
	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.WaitingForCoupons) private waitingForCoupons: IWaitingForCoupons
	) {}

	createTaskNearestTicket = async ({
		email,
		url,
	}: NearestTicketDto): Promise<{ doctorName: string }> => {
		try {
			let doctorName: string | undefined;

			const page: Page = await this.browser.newPage();

			await page.goto(url).catch(async () => {
				await page.close();
				throw new Error('url');
			});
			doctorName =
				(await page.$$eval('.text-primary.loader-link', (link) => {
					if (link) {
						if (link.length < 6) return null;
						return link.pop()?.textContent;
					}
				})) ?? '';

			if (!doctorName) {
				await page.close();
				throw new Error('доктор');
			}

			this.waitingForCoupons.getCoupons(page, doctorName, email, this.logger);
			return { doctorName };
		} catch (error) {
			this.logger.error(error);
			if (error instanceof Error) {
				if (error.message === 'доктор') {
					throw new Error('неверно указан url адрес врача!');
				} else if (error.message === 'url') {
					throw new Error('неверно указан url адрес врача или страница не доступна!');
				}
			}
			throw new Error('Произошла ошибка на стороне сервера, попробуйте еще раз чуть позже.');
		}
	};

	createTaskBySelectedDate = async ({ email, url, byDate }: BySelectedDateDto) => {
		try {
			let doctorName: string | undefined;
			const page: Page = await this.browser.newPage();

			await page.goto(url).catch(async () => {
				await page.close();
				throw new Error('url');
			});

			doctorName =
				(await page.$$eval('.text-primary.loader-link', (link) => {
					if (link) {
						if (link.length < 6) return null;
						return link.pop()?.textContent;
					}
				})) ?? '';

			if (!doctorName) {
				await page.close();
				throw new Error('доктор');
			}

			this.waitingForCoupons.getCouponsByDate(page, doctorName, email, byDate, this.logger);

			return { doctorName };
		} catch (error) {
			this.logger.error(error);
			if (error instanceof Error) {
				if (error.message === 'доктор') {
					throw new Error('неверно указан url адрес врача!');
				} else if (error.message === 'url') {
					throw new Error('неверно указан url адрес врача или страница не доступна!');
				}
			}
			throw new Error('Произошла ошибка на стороне сервера, попробуйте еще раз чуть позже.');
		}
	};

	initBrowser = async () => {
		const options = process.env.NODE_ENV
			? undefined
			: {
					args: ['--no-sandbox'],
					executablePath: '../usr/bin/chromium-browser',
			  };
		this.browser = await puppeteer.launch(options);
	};
}
