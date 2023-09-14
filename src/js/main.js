// import { clickOnSpace } from './modules/clickOnSpace';
import { dateRestriction } from './modules/dateRestriction';
import { submittingForm } from './modules/submittingForm';
import { validate } from '../utils/validate';
import { isCheckboxByDate } from './modules/isCheckboxByDate';
import { yandexMetrika } from './modules/yandexMetrika';

import '../style/style.scss';

process.env.NODE_ENV === 'production' ? yandexMetrika() : null;

window.addEventListener('DOMContentLoaded', () => {
	dateRestriction();
	// clickOnSpace();
	submittingForm();
	validate();
	isCheckboxByDate();
});
