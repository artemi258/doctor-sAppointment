import { inject, injectable } from 'inversify';
import puppeteer, { Browser, Page } from 'puppeteer';
import { NearestTicketDto } from './dto/task-nearestTicket.dto';
import { ITasksService } from './tasks.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { BySelectedDateDto } from './dto/task-bySelectedDate';
import { IWaitingForCoupons } from '../utils/waitingForCoupons.interface';
import { ITasksRepository } from './tasks.repository.interface';

@injectable()
export class TasksService implements ITasksService {
	browser: Browser;
	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.WaitingForCoupons) private waitingForCoupons: IWaitingForCoupons,
		@inject(TYPES.TasksRepository) private tasksRepository: ITasksRepository
	) {}

	createTaskNearestTicketServise = async ({
		email,
		url,
	}: NearestTicketDto): Promise<{
		doctorName: string;
	}> => {
		try {
			const existUser = await this.tasksRepository.findUser(email);
			if (existUser) {
				const taskUrl = existUser.tasks.find(
					(elem) => elem.url === url && elem.nameTask === 'nearestTicket'
				);

				if (taskUrl) throw new Error('Задача с таким доктором уже создана.');
			}
			const doctor = await this.createTaskNearestTicket({ email, url });

			const user = await this.tasksRepository.createUserAndTask(email, {
				nameTask: 'nearestTicket',
				doctorName: doctor.doctorName,
				url,
			});

			if (doctor && user) {
				return doctor;
			}
			throw new Error('Неудолось создать задачу, попробуйте в другой раз');
		} catch (error) {
			this.logger.error(error);
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error('Произошла ошибка на стороне сервера, попробуйте еще раз чуть позже.');
		}
	};
	createTaskBySelectedDateServise = async ({
		email,
		url,
		byDate,
	}: BySelectedDateDto): Promise<{
		doctorName: string;
	}> => {
		try {
			const existUser = await this.tasksRepository.findUser(email);
			if (existUser) {
				const taskUrl = existUser.tasks.find(
					(elem) => elem.url === url && elem.nameTask === 'byDateTicket'
				);

				if (taskUrl) throw new Error('Задача с таким доктором уже создана.');
			}
			const doctor = await this.createTaskBySelectedDate({ email, url, byDate });

			const user = await this.tasksRepository.createUserAndTask(email, {
				nameTask: 'byDateTicket',
				doctorName: doctor.doctorName,
				url,
				byDate,
			});

			if (doctor && user) {
				return doctor;
			}
			throw new Error('Неудолось создать задачу, попробуйте в другой раз');
		} catch (error) {
			this.logger.error(error);
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error('Произошла ошибка на стороне сервера, попробуйте еще раз чуть позже.');
		}
	};

	createTaskNearestTicket = async ({
		email,
		url,
	}: NearestTicketDto): Promise<{ doctorName: string }> => {
		let doctorName: string | undefined;

		const page: Page = await this.browser.newPage();

		await page.goto(url).catch(async () => {
			await page.close();
			throw new Error('Неверно указан url адрес врача или страница не доступна!');
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
			throw new Error('Неверно указан url адрес врача!');
		}

		this.waitingForCoupons.getCoupons(page, doctorName, email, this.logger);
		return { doctorName };
	};

	createTaskBySelectedDate = async ({ email, url, byDate }: BySelectedDateDto) => {
		try {
			let doctorName: string | undefined;
			const page: Page = await this.browser.newPage();

			await page.goto(url).catch(async () => {
				await page.close();
				throw new Error('Неверно указан url адрес врача или страница не доступна!');
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
				throw new Error('Неверно указан url адрес врача!');
			}

			this.waitingForCoupons.getCouponsByDate(page, doctorName, email, byDate, this.logger);

			return { doctorName };
		} catch (error) {
			this.logger.error(error);
			if (error instanceof Error) {
				throw new Error(error.message);
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
