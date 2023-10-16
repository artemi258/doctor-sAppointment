export const submittingForm = () => {
 const form = document.querySelector('.content__form'),
  loading = document.querySelector('.content__loader'),
  loadingMessage = document.querySelector('.content__loader .content__loader-message'),
  success = document.querySelector('.content__success'),
  successMessage = document.querySelector('.content__success-message'),
  error = document.querySelector('.content__error'),
  errorMessage = document.querySelector('.content__error-message'),
  inputEmail = document.querySelector('#email'),
  inputUrl = document.querySelector('#url'),
  checkboxDate = document.querySelector('#byDate'),
  calendar = document.querySelector('.calendar'),
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

  const dates = document.querySelector('.calendar__dates');
  const dateActive = dates.querySelector('.calendar__dates-active');

  if (checkboxDate.checked && !dateActive) {
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

  if (dateActive) {
   obj = {
    email: formData.get('email'),
    url: formData.get('url'),
    byDate: dateActive.getAttribute('data-date'),
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
     calendar.style.display = 'none';
     return res.text();
    } else {
     return res.text().then((text) => {
      throw new Error(text);
     });
    }
   })
   .then((res) => {
    successMessage.textContent = `Задача с доктором ${res} создана! Как только появится талон, вам на почту придет оповещение!`;
   })
   .catch((err) => {
    loading.style.display = 'none';
    error.style.display = 'flex';
    errorMessage.textContent = err.message;
   })
   .finally(() => {
    inputEmail.style.border = '1px #4676d7 solid';
    inputEmail.style.boxShadow = 'none';
    inputUrl.style.border = '1px #4676d7 solid';
    inputUrl.style.boxShadow = 'none';
    button.disabled = '';
    dateActive && dateActive.classList.remove('calendar__dates-active');
    setTimeout(() => {
     error.style.display = 'none';
     success.style.display = 'none';
    }, 9000);
   });
 };

 form.addEventListener('submit', submit);
};
