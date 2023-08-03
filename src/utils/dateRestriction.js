export const dateRestriction = () => {
	const dateInput = document.querySelector('#date'),
		date = new Date(),
		min = date.toLocaleDateString().split('.').reverse().join('-'),
		max = new Date(date.setDate(date.getDate() + 20))
			.toLocaleDateString()
			.split('.')
			.reverse()
			.join('-');

	dateInput.min = min;
	dateInput.max = max;
};
