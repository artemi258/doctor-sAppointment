export const clickOnSpace = () => {
	const radios = document.querySelectorAll('.content__check-wrap label');
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Space') {
			radios.forEach((item) => {
				if (e.target.textContent === item.textContent) e.target.click();
			});
		}
	});
};
