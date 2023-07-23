import { TaskNearestTicketDto } from './dto/task-taskNearestTicket.dto';

export interface ITasksService {
	createTaskNearestTicket: ({ email, url }: TaskNearestTicketDto) => void;
}
