export const isCheckboxByDate = () => {
  const checkbox = document.querySelector('#byDate'),
    calendar = document.querySelector('.calendar');

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      calendar.style.display = 'grid';
    } else {
      calendar.style.display = 'none';
    }
  });
};
