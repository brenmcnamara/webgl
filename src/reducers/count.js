/* @flow */

import type { Action } from '../types/Action';

export default function count(state: number = 0, action: Action): number {
  return action.type === 'DEMO_ACTION' ? state + 1 : state;
}
