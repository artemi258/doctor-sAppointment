import '../style/style.scss';
import { clickOnSpace } from './modules/clickOnSpace';
import { dateRestriction } from './modules/dateRestriction';
import { submittingForm } from './modules/submittingForm';
import { validate } from '../utils/validate';
import { isCheckboxByDate } from './modules/isCheckboxByDate';

window.addEventListener('DOMContentLoaded', () => {
	dateRestriction();
	clickOnSpace();
	submittingForm();
	validate();
	isCheckboxByDate();
});
