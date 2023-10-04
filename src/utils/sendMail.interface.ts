export interface IData {
	text: string;
	doctorName: string;
	url: string;
}

export interface ISendMail {
	sendEmail: (email: string, data: IData) => void;
}
