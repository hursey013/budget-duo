import { combineReducers } from 'redux';
import split from './split';
import incomes from './incomes';
import expenses from './expenses';
import session from './session';

export default combineReducers({ incomes, expenses, split, session });
