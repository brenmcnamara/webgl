/* @flow */

import DemoMiddleware from '../middleware/Demo';

import root from '../reducers/root';

import { applyMiddleware, compose, createStore } from 'redux';

import type { Action } from '../types/Action';
import type { Store as ReduxStore } from 'redux';
import type { ReduxState } from '../types/ReduxState';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Store: ReduxStore<ReduxState, Action> = createStore(
  root,
  composeEnhancers(applyMiddleware(DemoMiddleware)),
);

export default Store;
