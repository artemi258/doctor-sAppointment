exports.routes = () => {
	app.post('/addTask', async ({ body }, res) => {
		const { email, url } = body;
		try {
			getPage(url, email);
			res.status(200).send('Задача создана');
		} catch (error) {
			res.status(404).send('ошибка');
		}
	});
};
