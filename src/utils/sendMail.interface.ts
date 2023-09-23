export interface IData {
	text: string;
	doctorName: string;
}

export interface ISendMail {
	sendEmail: (email: string, data: IData) => void;
}
