export const calendar = () => {
  const dates = document.querySelector('.calendar__dates'),
    weekDays = document.querySelector('.calendar__days'),
    nameMonth = document.querySelector('.calendar__month-name'),
    year = document.querySelector('.calendar__month-year'),
    arrowNext = document.querySelector('#arrowNext'),
    arrowPrev = document.querySelector('#arrowPrev'),
    desc = document.querySelector('.calendar__desc');

  const date = new Date(),
    currentDate = new Date().getDate(),
    nextMonth = new Date().setMonth(date.getMonth() + 1),
    firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
    maxGreenDate = new Date(new Date().setDate(new Date().getDate() + 13)),
    minGreenDate = new Date(date.getFullYear(), date.getMonth(), currentDate),
    totalDaysMonth = new Date(new Date(nextMonth).setDate(0)).getDate(),
    arrayWeekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    arrayMonths = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
  let strWeekDays = '';
  let strDates = '';

  for (let i = 0; i < arrayWeekDays.length; i++) {
    strWeekDays += `<span>${arrayWeekDays[i]}</span>`;
  }

  const getZero = (num) => (num < 10 ? `0${num}` : num);

  for (let i = 0; i < totalDaysMonth; i++) {
    const backgroundGreen =
      i + 1 >= currentDate && Date.now() < maxGreenDate
        ? 'calendar__dates-green'
        : 'calendar__dates-red';
    const activeClass = i + 1 === currentDate ? 'calendar__dates-today' : '';
    const fullClass = `${activeClass} ${backgroundGreen}`;
    const dateAttr =
      backgroundGreen === 'calendar__dates-green'
        ? `data-date=${getZero(date.getFullYear())}-${getZero(date.getMonth() + 1)}-${getZero(
            i + 1
          )}`
        : '';
    if (i === 0) {
      strDates += `<button type=button ${dateAttr} class="${fullClass}" style="grid-column: ${
        firstDayWeek || 7
      }"><time>${i + 1}</time></button>`;
      continue;
    }
    strDates += `<button type=button ${dateAttr} class="${fullClass}"><time>${
      i + 1
    }</time></button>`;
  }

  const updateCalendar = () => {
    const firstDayWeekUpdate = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
      nextMonthUpdate = new Date().setMonth(new Date().getMonth() + 1),
      totalDaysMonthUpdate = new Date(new Date(nextMonthUpdate).setDate(0)).getDate();

    let strDatesUpdate = '';
    dates.innerHTML = '';

    for (let i = 0; i < totalDaysMonthUpdate; i++) {
      const dates = new Date(date.getFullYear(), date.getMonth(), i + 1);

      const backgroundGreen =
        dates >= minGreenDate && dates < maxGreenDate
          ? 'calendar__dates-green'
          : 'calendar__dates-red';
      const activeClass =
        i + 1 === currentDate && new Date().getMonth() === date.getMonth()
          ? 'calendar__dates-today'
          : '';
      const fullClass = `${activeClass} ${backgroundGreen}`;
      const dateAttr =
        backgroundGreen === 'calendar__dates-green'
          ? `data-date=${getZero(date.getFullYear())}-${getZero(date.getMonth() + 1)}-${getZero(
              i + 1
            )}`
          : '';
      if (i === 0) {
        strDatesUpdate += `<button type=button ${dateAttr} class="${fullClass}" style="grid-column: ${
          firstDayWeekUpdate || 7
        }"><time>${i + 1}</time></button>`;
        continue;
      }
      strDatesUpdate += `<button type=button ${dateAttr} class="${fullClass}"><time>${
        i + 1
      }</time></button>`;
    }

    nameMonth.textContent = arrayMonths[date.getMonth()];
    year.textContent = date.getFullYear();
    dates.innerHTML = strDatesUpdate;
  };

  arrowNext.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    updateCalendar();
  });
  arrowPrev.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    updateCalendar();
  });

  dates.addEventListener('click', (e) => {
    dates
      .querySelectorAll('button')
      .forEach((item) => item.classList.remove('calendar__dates-active'));
    if (e.target.classList.contains('calendar__dates-green')) {
      e.target.classList.add('calendar__dates-active');
    } else if (e.target.parentNode.classList.contains('calendar__dates-green')) {
      e.target.parentNode.classList.add('calendar__dates-active');
    }
  });

  nameMonth.textContent = arrayMonths[date.getMonth()];
  year.textContent = date.getFullYear();
  weekDays.innerHTML = strWeekDays;
  dates.innerHTML = strDates;

  desc.innerHTML = `можно выбрать максимум до <span>${getZero(maxGreenDate.getDate())}-${getZero(
    maxGreenDate.getMonth() + 1
  )}-${getZero(maxGreenDate.getFullYear())}</span> числа включительно`;
};
