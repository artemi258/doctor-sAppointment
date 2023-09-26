import { submittingForm } from './modules/submittingForm';
import { validate } from '../utils/validate';
import { isCheckboxByDate } from './modules/isCheckboxByDate';
import { yandexMetrika } from './modules/yandexMetrika';

import '../style/style.scss';
import { calendar } from './modules/calendar';

process.env.NODE_ENV === 'production' ? yandexMetrika() : null;

window.addEventListener('DOMContentLoaded', () => {
  submittingForm();
  validate();
  isCheckboxByDate();
  calendar();
});
