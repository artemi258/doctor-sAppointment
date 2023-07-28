import { Browser, Page } from 'puppeteer';
import { getDates } from './getDates';
import { ILogger } from '../logger/logger.interface';

export const getCoupons = async (
	page: Page,
	browser: Browser,
	doctorName: string,
	logger: ILogger
): Promise<string[] | void> => {
	let numberCoupons: number = 0;
	let date: string[] = [];
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

	if (arrTitle.length) {
		await browser.close();
		arrTitle.forEach((item) => {
			numberCoupons += +item.slice(-1);
		});
		logger.log(`Талонов: ${numberCoupons}, Доктор: ${doctorName}`);
		// sendMail(email, { numberCoupons, doctorName });
	} else {
		setTimeout(async () => {
			await page.reload();
			getCoupons(page, browser, doctorName, logger);
		}, 1000 * 60);
	}
};
