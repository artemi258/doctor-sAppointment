import { ObjectId } from 'mongoose';
import { BySelectedDateDto } from './dto/task-bySelectedDate';
import { NearestTicketDto } from './dto/task-nearestTicket.dto';
import { Page } from 'puppeteer';

export interface ITasksService {
	createTaskNearestTicketServise: ({ email, url }: NearestTicketDto) => Promise<string>;
	createTaskBySelectedDateServise: ({ email, url, byDate }: BySelectedDateDto) => Promise<string>;
	createTaskNearestTicket: (
		{ email, url }: NearestTicketDto,
		doctorName: string,
		taskId: ObjectId
	) => Promise<boolean>;

	createTaskBySelectedDate: (
		{ email, url, byDate }: BySelectedDateDto,
		doctorName: string,
		taskId: ObjectId
	) => Promise<boolean>;

	getDoctorName: (page: Page) => Promise<string>;

	initBrowser: () => Promise<void>;
}
