export const dateRestriction = () => {
	const dateInput = document.querySelector('#date'),
		dateDesc = document.querySelector('.content__input-tooltipDate_desc'),
		date = new Date(),
		min = date.toLocaleDateString().split('.').reverse().join('-'),
		max = new Date(date.setDate(date.getDate() + 13))
			.toLocaleDateString()
			.split('.')
			.reverse()
			.join('-');

	dateInput.min = min;
	dateInput.max = max;

	const maxTooltip = max.split('-').reverse().join('-');

	dateDesc.innerHTML = `можно выбрать максимум до <span>${maxTooltip}</span> числа включительно`;
};
