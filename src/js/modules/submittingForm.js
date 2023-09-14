export const submittingForm = () => {
	const form = document.querySelector('.content__form'),
		loading = document.querySelector('.content__loader'),
		loadingMessage = document.querySelector('.content__loader .content__loader-message'),
		success = document.querySelector('.content__success'),
		error = document.querySelector('.content__error'),
		errorMessage = document.querySelector('.content__error-message'),
		inputEmail = document.querySelector('#email'),
		inputUrl = document.querySelector('#url'),
		checkboxDate = document.querySelector('#byDate'),
		button = document.querySelector('.content__button');

	const submit = async (e) => {
		e.preventDefault();

		if (inputEmail.style.borderColor === 'red' || inputUrl.style.borderColor === 'red') {
			error.style.display = 'flex';
			errorMessage.textContent = 'заполните все поля!';
			setTimeout(() => {
				error.style.display = 'none';
			}, 7000);
			return;
		}

		const formData = new FormData(form);
		let obj;
		let url;

		if (checkboxDate.checked && !formData.get('date')) {
			error.style.display = 'flex';
			errorMessage.textContent =
				'выберите дату или уберите галочку с поля "проверять талон до определенной даты?"';
			setTimeout(() => {
				error.style.display = 'none';
			}, 7000);
			return;
		}

		loading.style.display = 'flex';
		loadingMessage.textContent = 'бегу создавать задачу...';

		if (formData.get('date')) {
			obj = {
				email: formData.get('email'),
				url: formData.get('url'),
				byDate: formData.get('date'),
			};
			url = 'https://server.notificationofcoupons.site/api/tasks/bySelectedDate';
		} else {
			obj = {
				email: formData.get('email'),
				url: formData.get('url'),
			};
			url = 'https://server.notificationofcoupons.site/api/tasks/nearestTicket';
		}

		new Promise((res, rej) => {
			button.disabled = 'disabled';
			setTimeout(() => {
				loadingMessage.textContent = 'почти добежал...';
			}, 6000);
			setTimeout(() => {
				rej({
					message:
						'вышло время подключения к серверу, на данный момент сервер не доступен, попробуйте в другой раз',
				});
			}, 20000);
			fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(obj),
			}).then((result) => res(result));
		})
			.then((res) => {
				if (res.ok) {
					loading.style.display = 'none';
					success.style.display = 'flex';
					form.reset();
				} else {
					return res.text().then((text) => {
						throw new Error(text);
					});
				}
			})
			.catch((err) => {
				loading.style.display = 'none';
				error.style.display = 'flex';
				errorMessage.textContent = `${err.message}!`;
			})
			.finally(() => {
				inputEmail.style.border = '1px #4676d7 solid';
				inputEmail.style.boxShadow = 'none';
				inputUrl.style.border = '1px #4676d7 solid';
				inputUrl.style.boxShadow = 'none';
				button.disabled = '';
				setTimeout(() => {
					error.style.display = 'none';
					success.style.display = 'none';
				}, 9000);
			});
	};

	form.addEventListener('submit', submit);
};
