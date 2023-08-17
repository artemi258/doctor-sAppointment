export const isCheckboxByDate = () => {
	const checkbox = document.querySelector('#byDate'),
		labelDate = document.querySelector('[data-date]'),
		inputDate = document.querySelector('#date');

	inputDate.disabled = 'disabled';
	labelDate.disabled = 'disabled';

	checkbox.addEventListener('change', () => {
		if (checkbox.checked) {
			labelDate.disabled = '';
			inputDate.disabled = '';
		} else {
			console.log(checkbox.checked);
			inputDate.disabled = 'disabled';
			labelDate.disabled = 'disabled';
		}
	});
};
