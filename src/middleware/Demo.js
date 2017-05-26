/* @flow */

import type { Action } from '../types/Action';
import type { MiddlewareAPI } from 'redux';
import type { ReduxState } from '../types/ReduxState';

// eslint-disable-next-line no-unused-vars
const Demo = (store: MiddlewareAPI<ReduxState, Action>) => (next: Function) => (action: Action) => {
  if (action.type === 'DEMO_ACTION') {
    // eslint-disable-next-line no-console
    console.log('demo action sent');
  }
  return next(action);
};

export default Demo;
