/* @flow */

import count from './count';

import { combineReducers } from 'redux';

const root = combineReducers({
  count,
});

export default root;
