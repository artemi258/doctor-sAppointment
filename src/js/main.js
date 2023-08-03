import '../style/style.scss';
import { clickOnSpace } from '../utils/clickOnSpace';
import { dateRestriction } from '../utils/dateRestriction';
import { submittingForm } from './submittingForm';
import { validate } from './validate';

window.addEventListener('DOMContentLoaded', () => {
	dateRestriction();
	clickOnSpace();
	submittingForm();
	validate();
});
