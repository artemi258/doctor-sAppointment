import { Browser, Page } from 'puppeteer';
import { getDates } from './getDates';
import { ILogger } from '../logger/logger.interface';
import { sendMail } from './sendEmail';

export const getCoupons = async (
	page: Page,
	browser: Browser,
	doctorName: string,
	email: string,
	logger: ILogger
): Promise<string[] | void> => {
	let numberCoupons: number = 0;
	let date: Date[] = [];
	let arrTitle: string[] = [];

	const title = await page.$$eval('.fc-title', (title) => title.map((el) => el.textContent ?? ''));
	const filteringFuture = await page.evaluate(getDates);

	const btnDisabled = await page.evaluate(() => {
		return !(document.querySelector('.fc-corner-right') as HTMLButtonElement)?.disabled;
	});

	date = [...filteringFuture.future];
	arrTitle = title.filter((el, i) => !filteringFuture.numberingOtherMonth.includes(i));

	if (btnDisabled) {
		const btn = await page.$('.fc-corner-right');
		if (btn) await btn.click();
		const filteringFutureTwo = await page.evaluate(getDates);
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

	arrTitle.forEach((item) => {
		const num = +item.slice(-1);
		if (num) numberCoupons += num;
	});

	if (numberCoupons) {
		await browser.close();
		const text = `доступен(но) ${numberCoupons} талон(a/ов)`;
		logger.log(`${text}, Доктор: ${doctorName}`);
		sendMail(email, { text, doctorName });
	} else {
		setTimeout(async () => {
			await page.reload({ timeout: 0 });
			logger.log(`Произошло обновление страницы с доктором ${doctorName}`);
			getCoupons(page, browser, doctorName, email, logger);
		}, 1000 * 60);
	}
};
