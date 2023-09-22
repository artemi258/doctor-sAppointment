import { ObjectId } from 'mongoose';
import { BySelectedDateDto } from './dto/task-bySelectedDate';
import { NearestTicketDto } from './dto/task-nearestTicket.dto';

export interface ITasksService {
	createTaskNearestTicketServise: ({ email, url }: NearestTicketDto) => Promise<{
		doctorName: string;
	}>;
	createTaskBySelectedDateServise: ({ email, url, byDate }: BySelectedDateDto) => Promise<{
		doctorName: string;
	}>;
	createTaskNearestTicket: (
		{ email, url }: NearestTicketDto,
		taskId: ObjectId
	) => Promise<{ doctorName: string }>;
	createTaskBySelectedDate: (
		{ email, url, byDate }: BySelectedDateDto,
		taskId: ObjectId
	) => Promise<{ doctorName: string }>;
}
