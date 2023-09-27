export const validate = () => {
  const inputEmail = document.querySelector('#email'),
    inputEmailSpan = document.querySelector('#errorEmail'),
    inputUrl = document.querySelector('#url'),
    inputUrlSpan = document.querySelector('#errorUrl');

  inputEmail.addEventListener('input', (e) => {
    const value = e.target.value;

    if (/^[\w-\.]+@[\w]+\.[A-Za-z]{2,}$/i.test(value)) {
      inputEmail.style.border = '1px green solid';
      inputEmail.style.boxShadow = '1px 1px 10px 1px green';
      inputEmailSpan.style.display = 'none';
    } else {
      inputEmail.style.border = '1px red solid';
      inputEmail.style.boxShadow = '1px 1px 10px 1px red';
      inputEmailSpan.style.display = 'block';
    }
  });

  inputUrl.addEventListener('focus', () => {
    inputUrl.style.border = '1px red solid';
    inputUrl.style.boxShadow = '1px 1px 10px 1px red';
    inputUrlSpan.style.display = 'block';
  });

  inputUrl.addEventListener('input', (e) => {
    const value = e.target.value;

    if (/^https:\/\/(rish\.)?registratura1?96\.ru.+/i.test(value)) {
      inputUrl.style.border = '1px green solid';
      inputUrl.style.boxShadow = '1px 1px 10px 1px green';
      inputUrlSpan.style.display = 'none';
    } else {
      inputUrl.style.border = '1px red solid';
      inputUrl.style.boxShadow = '1px 1px 10px 1px red';
      inputUrlSpan.style.display = 'block';
    }
  });
};
