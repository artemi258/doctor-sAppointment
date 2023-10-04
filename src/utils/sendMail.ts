import { inject, injectable } from 'inversify';
import { IData, ISendMail } from './sendMail.interface';
import nodemailer from 'nodemailer';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class SendMail implements ISendMail {
	password: string | undefined;
	login: string | undefined;
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {
		this.password = configService.get('EMAIL_PASSWORD');
		this.login = configService.get('EMAIL_LOGIN');
	}
	sendEmail = async (email: string, data: IData) => {
		let transporter = nodemailer.createTransport({
			host: 'smtp.yandex.ru',
			port: 465,
			secure: true,
			auth: {
				user: this.login,
				pass: this.password,
			},
		});

		await transporter.sendMail({
			from: `"Coupons" <${this.login}>`,
			to: `${email}`,
			subject: 'Сообщение о появлении талонов',
			html: `<strong>Доктор</strong>: ${data.doctorName}<br/>
				   <strong>URL</strong>: <a href=${data.url}>${data.url}</a><br/>
                   <strong>Талоны</strong>: ${data.text}`,
		});
	};
}
