import { Browser, Page } from 'puppeteer';
import { TaskNearestTicketDto } from './dto/task-taskNearestTicket.dto';

export interface IGetDates {
	future: string[];
	numberingOtherMonth: number[];
}

export interface ITasksService {
	createTaskNearestTicket: ({ email, url }: TaskNearestTicketDto) => void;
	getCoupons: (page: Page, browser: Browser, doctorName: string) => Promise<string[] | void>;
	getDates: () => IGetDates;
}
