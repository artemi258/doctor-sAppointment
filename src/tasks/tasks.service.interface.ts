import { Browser } from 'puppeteer';
import { BySelectedDateDto } from './dto/task-bySelectedDate';
import { NearestTicketDto } from './dto/task-nearestTicket.dto';

export interface ITasksService {
	browser: Browser;
	createTaskNearestTicket: ({ email, url }: NearestTicketDto) => Promise<{ doctorName: string }>;
	createTaskBySelectedDate: ({
		email,
		url,
		byDate,
	}: BySelectedDateDto) => Promise<{ doctorName: string }>;
}
