import { inject } from 'inversify';
import { Page } from 'puppeteer';
import { ILogger } from '../logger/logger.interface';
import { IWaitingForCoupons } from './waitingForCoupons.interface';
import { getDates } from '../helpers/getDates';
import { injectable } from 'inversify';
import { TYPES } from '../types';
import { ISendMail } from './sendMail.interface';
import { ObjectId } from 'mongoose';
import { ITasksRepository } from '../tasks/tasks.repository.interface';

@injectable()
export class WaitingForCoupons implements IWaitingForCoupons {
	constructor(
		@inject(TYPES.SendMail) private sendMail: ISendMail,
		@inject(TYPES.TasksRepository) private tasksRepository: ITasksRepository
	) {}

	getCoupons = async (
		page: Page,
		doctorName: string,
		email: string,
		url: string,
		logger: ILogger,
		taskId: ObjectId
	): Promise<void> => {
		try {
			let numberCoupons: number = 0;
			let arrTitle: string[] = [];

			const title = await page.$$eval('.fc-title', (title) =>
				title.map((el) => el.textContent ?? '')
			);
			const filteringFuture = await page.evaluate(getDates);

			const btnDisabled = await page.evaluate(() => {
				return !(document.querySelector('.fc-corner-right') as HTMLButtonElement)
					?.disabled;
			});

			arrTitle = title.filter(
				(el, i) => !filteringFuture.numberingOtherMonth.includes(i)
			);

			if (btnDisabled) {
				const btn = await page.$('.fc-corner-right');
				if (btn) await btn.click();
				const filteringFutureTwo = await page.evaluate(getDates);
				const titleTwo = await page.$$eval('.fc-title', (title) =>
					title.map((el) => el.textContent ?? '')
				);
				arrTitle = [
					...arrTitle,
					...titleTwo.filter(
						(el, i) => !filteringFutureTwo.numberingOtherMonth.includes(i)
					),
				];
			}

			arrTitle.forEach((item) => {
				const num = +item.slice(-2);
				if (num) numberCoupons += num;
			});
			if (numberCoupons) {
				const text = `доступен(но) ${numberCoupons} талон(a/ов)`;
				logger.log(`${text}, Доктор: ${doctorName}`);
				this.sendMail.sendEmail(email, { text, doctorName, url });
				await page.close();
				logger.warn(`${doctorName} страница закрыта`);
				await this.tasksRepository.deleteTask(taskId);
				logger.warn(`${doctorName} с сервера задача удалена`);
			} else {
				setTimeout(async () => {
					await page.reload({ timeout: 1000 * 60 * 5 }).catch(async (err) => {
						logger.error(err);
						await page.close();
						await this.tasksRepository.deleteTask(taskId);

						throw new Error('неудолось перезагрузить страницу');
					});
					this.getCoupons(page, doctorName, email, url, logger, taskId);
				}, 1000 * 60);
			}
		} catch (error) {
			const text =
				'<span style="color: red; margin: 0">Возникла ошибка при ожидании талона или врач убран из списка</span>';
			this.sendMail.sendEmail(email, { text, doctorName, url });
		}
	};
	getCouponsByDate = async (
		page: Page,
		doctorName: string,
		email: string,
		url: string,
		byDate: Date,
		logger: ILogger,
		taskId: ObjectId
	): Promise<void> => {
		try {
			let numberCoupons: number = 0;
			let date: Date[] = [];
			let arrTitle: string[] = [];

			const title = await page.$$eval('.fc-title', (title) =>
				title.map((el) => el.textContent ?? '')
			);
			const filteringFuture = await page.evaluate(getDates);

			const btnDisabled = await page.evaluate(() => {
				return !(document.querySelector('.fc-corner-right') as HTMLButtonElement)
					?.disabled;
			});

			date = [...filteringFuture.future];
			arrTitle = title.filter(
				(el, i) => !filteringFuture.numberingOtherMonth.includes(i)
			);

			if (btnDisabled) {
				const btn = await page.$('.fc-corner-right');
				if (btn) await btn.click();
				const filteringFutureTwo = await page.evaluate(getDates);
				const titleTwo = await page.$$eval('.fc-title', (title) =>
					title.map((el) => el.textContent ?? '')
				);
				arrTitle = [
					...arrTitle,
					...titleTwo.filter(
						(el, i) => !filteringFutureTwo.numberingOtherMonth.includes(i)
					),
				];

				date = [...date, ...filteringFutureTwo.future];
			}

			const dateObj = new Date(),
				currentDate =
					new Date(
						dateObj.getUTCFullYear(),
						dateObj.getUTCMonth(),
						dateObj.getUTCDate(),
						dateObj.getUTCHours(),
						dateObj.getUTCMinutes(),
						dateObj.getUTCSeconds()
					).getTime() +
					300 * 60 * 1000,
				byDateFull = new Date(`${byDate}T23:59:59`).getTime();

			if (currentDate > byDateFull) {
				await page.close();
				await this.tasksRepository.deleteTask(taskId);

				logger.error(
					`выбранная дата ${byDate} прошла Доктор: $${doctorName} email: ${email}`
				);
				const text = `<span style="color: red; margin: 0">выбранная дата ${byDate} прошла и ожидание талонов ${doctorName} окончена</span>`;
				this.sendMail.sendEmail(email, { text, doctorName, url });
				return;
			}

			date.length = new Date(byDateFull - currentDate).getDate();

			arrTitle.length = date.length;

			arrTitle.forEach((item) => {
				const num = +item.slice(-2);
				if (num) numberCoupons += num;
			});
			logger.warn(arrTitle);

			if (numberCoupons) {
				const text = `в период выбранной даты, появился(ось) ${numberCoupons} талон(а/ов)`;
				logger.log(`${text}, Доктор: ${doctorName}`);
				this.sendMail.sendEmail(email, { text, doctorName, url });
				await page.close();
				logger.warn(`${doctorName} страница закрыта`);
				await this.tasksRepository.deleteTask(taskId);
				logger.warn(`${doctorName} с сервера задача удалена`);
			} else {
				setTimeout(async () => {
					await page.reload({ timeout: 1000 * 60 * 5 }).catch(async (err) => {
						logger.error(err);
						await page.close();
						await this.tasksRepository.deleteTask(taskId);

						throw new Error('неудолось перезагрузить страницу');
					});
					this.getCouponsByDate(page, doctorName, email, url, byDate, logger, taskId);
				}, 1000 * 60);
			}
		} catch (error) {
			const text = `<span style="color: red; margin: 0">Возникла ошибка при ожидании талона или врач убран из списка</span>`;
			this.sendMail.sendEmail(email, { text, doctorName, url });
		}
	};
}
