import { inject, injectable } from "inversify";
import puppeteer, { Browser, Page } from "puppeteer";
import { NearestTicketDto } from "./dto/task-nearestTicket.dto";
import { ITasksService } from "./tasks.service.interface";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { getCoupons } from "../utils/getCoupons";
import { BySelectedDateDto } from "./dto/task-bySelectedDate";
import { getCouponsByDate } from "../utils/getCouponsByDate";

@injectable()
export class TasksService implements ITasksService {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  createTaskNearestTicket = async ({
    email,
    url,
  }: NearestTicketDto): Promise<boolean> => {
    try {
      let doctorName: string | undefined;
      const options = process.env.NODE_ENV
        ? undefined
        : {
            executablePath: "/usr/bin/chromium-browser",
            args: ["--no-sandbox"],
          };
      const browser: Browser = await puppeteer.launch(options);
      const page: Page = await browser.newPage();

      await page.goto(url);

      doctorName =
        (await page.$$eval(".text-primary.loader-link", (link) => {
          if (link) {
            if (link.length < 6) return null;
            return link.pop()?.textContent;
          }
        })) ?? "";

      if (!doctorName) throw new Error("доктор");

      getCoupons(page, browser, doctorName, email, this.logger);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "доктор") {
          throw new Error("неверно указан url адрес врача");
        }
      }
      throw new Error(
        "Произошла ошибка на стороне сервера, попробуйте еще раз чуть позже"
      );
    }
  };

  createTaskBySelectedDate = async ({
    email,
    url,
    byDate,
  }: BySelectedDateDto) => {
    try {
      let doctorName: string | undefined;
      const options = process.env.NODE_ENV
        ? undefined
        : {
            executablePath: "/usr/bin/chromium-browser",
            args: ["--no-sandbox"],
          };
      const browser: Browser = await puppeteer.launch(options);
      const page: Page = await browser.newPage();

      await page.goto(url);

      doctorName =
        (await page.$$eval(".text-primary.loader-link", (link) => {
          if (link) {
            if (link.length < 6) return null;
            return link.pop()?.textContent;
          }
        })) ?? "";

      if (!doctorName) throw new Error("доктор");

      getCouponsByDate(page, browser, doctorName, email, byDate, this.logger);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "доктор") {
          throw new Error("неверно указан url адрес врача");
        }
      }
      throw new Error(
        "Произошла ошибка на стороне сервера, попробуйте еще раз чуть позже"
      );
    }
  };
}
