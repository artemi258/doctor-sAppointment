import { Browser, Page } from "puppeteer";
import { getDates } from "./getDates";
import { ILogger } from "../logger/logger.interface";
import { sendMail } from "./sendEmail";

export const getCouponsByDate = async (
  page: Page,
  browser: Browser,
  doctorName: string,
  email: string,
  byDate: Date,
  logger: ILogger
): Promise<void> => {
  try {
    let numberCoupons: number = 0;
    let date: Date[] = [];
    let arrTitle: string[] = [];

    const title = await page.$$eval(".fc-title", (title) =>
      title.map((el) => el.textContent ?? "")
    );
    const filteringFuture = await page.evaluate(getDates);

    const btnDisabled = await page.evaluate(() => {
      return !(document.querySelector(".fc-corner-right") as HTMLButtonElement)
        ?.disabled;
    });

    date = [...filteringFuture.future];
    arrTitle = title.filter(
      (el, i) => !filteringFuture.numberingOtherMonth.includes(i)
    );

    if (btnDisabled) {
      const btn = await page.$(".fc-corner-right");
      if (btn) await btn.click();
      const filteringFutureTwo = await page.evaluate(getDates);
      const titleTwo = await page.$$eval(".fc-title", (title) =>
        title.map((el) => el.textContent ?? "")
      );
      arrTitle = [
        ...arrTitle,
        ...titleTwo.filter(
          (el, i) => !filteringFutureTwo.numberingOtherMonth.includes(i)
        ),
      ];

      date = [...date, ...filteringFutureTwo.future];
    }

    date.length = 21;

    const index = date.findIndex((date) => date === byDate);

    if (index < 0) {
      await browser.close();
      logger.error(`выбранная дата ${byDate} прошла`);
      const text = `<span style="color: red; margin: 0">выбранная дата ${byDate} прошла и ожидание талонов окончена</span>`;
      sendMail(email, { text, doctorName });
      return;
    }

    date = date.slice(0, index + 1);

    arrTitle.length = date.length;

    arrTitle.forEach((item) => {
      const num = +item.slice(-1);
      if (num) numberCoupons += num;
    });

    if (numberCoupons) {
      await browser.close();
      const text = `в период выбранной даты, появился(ось) ${numberCoupons} талон(а/ов)`;
      logger.log(`${text}, Доктор: ${doctorName}`);
      sendMail(email, { text, doctorName });
    } else {
      setTimeout(async () => {
        await page.reload({ timeout: 0 }).catch(async (err) => {
          logger.error(err);
          await browser.close();
          throw new Error();
        });
        getCouponsByDate(page, browser, doctorName, email, byDate, logger);
      }, 1000 * 60);
    }
  } catch (error) {
    const text = `<span style="color: red; margin: 0">Возникла ошибка при ожидании талона или врач убран из списка</span>`;
    sendMail(email, { text, doctorName });
  }
};
