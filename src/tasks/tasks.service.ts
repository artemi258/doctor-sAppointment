import { inject, injectable } from 'inversify';
import puppeteer, { Browser, Page } from 'puppeteer';
import { TaskNearestTicketDto } from './dto/task-taskNearestTicket.dto';
import { IGetDates, ITasksService } from './tasks.service.interface';
import { sendMail } from '../utils/sendEmail';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class TasksService implements ITasksService {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	createTaskNearestTicket = async ({ email, url }: TaskNearestTicketDto): Promise<void> => {
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

		this.getCoupons(page, browser, doctorName);

		// this.logger.log(doctorName);
	};
	getCoupons = async (
		page: Page,
		browser: Browser,
		doctorName: string
	): Promise<string[] | void> => {
		let numberCoupons: number = 0;
		let date: string[] = [];
		let arrTitle: string[] = [];

		const title = await page.$$eval('.fc-title', (title) =>
			title.map((el) => el.textContent ?? '')
		);
		const filteringFuture = await page.evaluate(this.getDates);

		const btnDisabled = await page.evaluate(() => {
			return !(document.querySelector('.fc-corner-right') as HTMLButtonElement)?.disabled;
		});

		date = [...filteringFuture.future];
		arrTitle = title.filter((el, i) => !filteringFuture.numberingOtherMonth.includes(i));

		if (btnDisabled) {
			const btn = await page.$('.fc-corner-right');
			if (btn) await btn.click();
			const filteringFutureTwo = await page.evaluate(this.getDates);
			const titleTwo = await page.$$eval('.fc-title', (title) =>
				title.map((el) => el.textContent ?? '')
			);
			arrTitle = [
				...arrTitle,
				...titleTwo.filter((el, i) => !filteringFutureTwo.numberingOtherMonth.includes(i)),
			];

			date = [...date, ...filteringFutureTwo.future];
		}

		date.length = 21;

		if (arrTitle.length) {
			await browser.close();
			arrTitle.forEach((item) => {
				numberCoupons += +item.slice(-1);
			});
			this.logger.log(`Талонов: ${numberCoupons}, Доктор: ${doctorName}`);
			// sendMail(email, { numberCoupons, doctorName });
		} else {
			setTimeout(async () => {
				await page.reload();
				this.getCoupons(page, browser, doctorName);
			}, 1000 * 60);
		}
	};

	getDates = (): IGetDates => {
		const numberingOtherMonth: number[] = [];
		let future = Array.from(document.querySelectorAll('.fc-day-top.fc-future')) ?? [];
		const today = document.querySelector('.fc-today');
		if (today) {
			future = [today, ...future];
		}
		const dates = future
			.filter((el, i) => {
				if (el.classList.contains('fc-other-month')) {
					numberingOtherMonth.push(i);
				}
				return !el.classList.contains('fc-other-month') && !el.classList.contains('fc-past');
			})
			.map((el) => el.getAttribute('data-date') ?? '');

		return {
			future: dates,
			numberingOtherMonth,
		};
	};
}
