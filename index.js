const puppeteer = require('puppeteer');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const getPage = async (url, email) => {
	let numberCoupons = 0;
	let doctorName = '';
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(url);

	await page
		.evaluate(() => {
			const arr = Array.from(document.querySelectorAll('.text-primary.loader-link')).map(
				(el) => el.textContent
			);
			return arr;
		})
		.then((res) => {
			doctorName = res[res.length - 1];
		});

	const html = await page.content();
	const regexp = new RegExp(/(Талонов:.{2})/, 'g');
	const arrCoupons = html.match(regexp).map((item) => item.slice(-1));

	for (let item of arrCoupons) {
		if (item > 0) {
			numberCoupons += +item;
		}
	}
	await browser.close();

	if (numberCoupons) {
		console.log({ numberCoupons, doctorName });
		mailer(email, { numberCoupons, doctorName });
	} else {
		setTimeout(() => getPage(url), 1000 * 60);
	}
};

const mailer = async (email, data) => {
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
		       <strong>Талоны</strong>: доступен(но) ${data.numberCoupons} талон(ов)`,
	});
};

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.post('/addTask', async ({ body }, res) => {
	const { email, url } = body;
	try {
		getPage(url, email);
		res.status(200).send('Задача создана');
	} catch (error) {
		res.status(404).send('ошибка');
	}
});

app.listen(port, () => {
	console.log('Сервер запущен!');
});
