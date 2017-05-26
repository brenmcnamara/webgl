/* @flow */

import Store from './Store';

export default function getCount(): number {
  return Store.getState().count;
}
