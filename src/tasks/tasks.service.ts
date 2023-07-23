import { inject, injectable } from 'inversify';
import puppeteer, { Browser, Page } from 'puppeteer';
import { TaskNearestTicketDto } from './dto/task-taskNearestTicket.dto';
import { ITasksService } from './tasks.service.interface';
import { sendMail } from '../utils/sendEmail';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class TasksService implements ITasksService {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}
	createTaskNearestTicket = async ({ email, url }: TaskNearestTicketDto): Promise<void> => {
		let numberCoupons: number = 0;
		let doctorName: string = '';
		const browser: Browser = await puppeteer.launch();
		const page: Page = await browser.newPage();

		await page.goto(url);
		await page
			.evaluate(() => {
				const arr: string[] = Array.from(
					document.querySelectorAll('.text-primary.loader-link')
				).map((el) => el.textContent) as string[];
				return arr;
			})
			.then((res) => {
				doctorName = res[res.length - 1];
			});

		const getCoupons = async () => {
			const html: string = await page.content();
			const regexp = new RegExp(/Талонов:.{2}/, 'g');
			const arrCoupons: number[] = (html.match(regexp) ?? []).map((item) => +item.slice(-1));

			for (let item of arrCoupons) {
				if (item > 0) {
					numberCoupons += +item;
				}
			}

			if (numberCoupons) {
				await browser.close();
				this.logger.log(`Талонов: ${numberCoupons}, Доктор: ${doctorName}`);
				sendMail(email, { numberCoupons, doctorName });
			} else {
				setTimeout(async () => {
					await page.reload();
					getCoupons(), 1000 * 60;
				});
			}
		};
		getCoupons();
	};
}
