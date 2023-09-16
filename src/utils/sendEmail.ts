import nodemailer from 'nodemailer';

interface IData {
	text: string;
	doctorName: string;
}

export const sendMail = async (email: string, data: IData) => {
	let transporter = nodemailer.createTransport({
		host: 'smtp.yandex.ru',
		port: 465,
		secure: true,
		auth: {
			user: 'notificationOfCoupons@yandex.ru',
			pass: 'rmskelznyzwotwgr',
		},
	});

	await transporter.sendMail({
		from: '"Coupons" <notificationOfCoupons@yandex.ru>',
		to: `${email}`,
		subject: 'Сообщение о появлении талонов',
		html: `<strong>Доктор</strong>: ${data.doctorName}<br/>
		       <strong>Талоны</strong>: ${data.text}`,
	});
};
