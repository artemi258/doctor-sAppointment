export const isCheckboxByDate = () => {
  const checkbox = document.querySelector('#byDate'),
    dates = document.querySelector('.calendar');

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      dates.style.display = 'grid';
    } else {
      dates.style.display = 'none';
    }
  });
};
