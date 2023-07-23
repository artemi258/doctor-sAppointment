import nodemailer from 'nodemailer';

interface IData {
	numberCoupons: number;
	doctorName: string;
}

export const sendMail = async (email: string, data: IData) => {
	let transporter = nodemailer.createTransport({
		host: 'smtp.yandex.ru',
		port: 465,
		secure: true,
		auth: {
			user: 'portfolioartem@yandex.ru',
			pass: 'rjgnlighpdfylakz',
		},
	});

	await transporter.sendMail({
		from: '"Coupons" <portfolioartem@yandex.ru>',
		to: `${email}`,
		subject: 'Сообщение о появлении талонов',
		html: `<strong>Доктор</strong>: ${data.doctorName}<br/>
		       <strong>Талоны</strong>: доступен(но) ${data.numberCoupons} талон(a/ов)`,
	});
};
