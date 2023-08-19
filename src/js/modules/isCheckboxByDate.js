export const isCheckboxByDate = () => {
	const checkbox = document.querySelector('#byDate'),
		labelDate = document.querySelector('[data-date]'),
		inputDate = document.querySelector('#date');

	checkbox.addEventListener('change', () => {
		if (checkbox.checked) {
			labelDate.disabled = '';
			inputDate.disabled = '';
		} else {
			inputDate.disabled = 'disabled';
			labelDate.disabled = 'disabled';
		}
	});
};
