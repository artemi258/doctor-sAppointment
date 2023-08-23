export const submittingForm = () => {
	const form = document.querySelector('.content__form'),
		loading = document.querySelector('.content__loader'),
		loadingMessage = document.querySelector('.content__loader .content__loader-message'),
		success = document.querySelector('.content__success'),
		error = document.querySelector('.content__error'),
		inputEmail = document.querySelector('#email'),
		inputUrl = document.querySelector('#url'),
		button = document.querySelector('.content__button');

	const submit = async (e) => {
		e.preventDefault();

		loading.style.display = 'flex';
		loadingMessage.textContent = 'бегу создавать задачу...';

		const formData = new FormData(form);
		let obj;
		let url;
		console.log(formData.get('date'));

		console.log(formData.get('date'));
		if (formData.get('date')) {
			obj = {
				email: formData.get('email'),
				url: formData.get('url'),
				byDate: formData.get('date'),
			};
			url = 'https://doctor-sappointment.onrender.com/api/tasks/bySelectedDate';
		} else {
			obj = {
				email: formData.get('email'),
				url: formData.get('url'),
			};
			url = 'https://doctor-sappointment.onrender.com/api/tasks/nearestTicket';
		}

		new Promise((res, rej) => {
			button.disabled = 'disabled';
			setTimeout(() => {
				loadingMessage.textContent = 'почти добежал...';
			}, 6000);
			fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(obj),
			}).then((result) => res(result));
		})
			.then(() => {
				loading.style.display = 'none';
				success.style.display = 'flex';
				form.reset();
			})
			.catch((err) => {
				loading.style.display = 'none';
				error.style.display = 'flex';
				console.log(err);
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
				}, 8000);
			});
	};

	form.addEventListener('submit', submit);
};
