const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const { server } = require('./app');

const getPage = async (url, email) => {
	let numberCoupons = 0;
	let doctorName = '';
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(url);
	console.log(url);
	await page.evaluate(() => {
		// const arr = document.querySelectorAll('.text-primary.loader-link');
		// const name = arr[arr.length - 1].textContent;
		// console.log('name', arr);
		console.log('name');
		doctorName = name;
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

	console.log({ numberCoupons, doctorName });
	if (numberCoupons) {
		// mailer(email, { numberCoupons, doctorName });
	} else {
		// setTimeout(() => getPage(url, email), 1000 * 60);
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

const app = server();

app.post('/addTask', async ({ body }, res) => {
	const { email, url } = body;
	try {
		getPage(url, email);
		res.status(200).send('Задача создана');
	} catch (error) {
		res.status(404).send('ошибка');
	}
});
