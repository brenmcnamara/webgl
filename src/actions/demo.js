/* @flow */

import Store from '../store/Store';

export default function demo() {
  Store.dispatch({
    type: 'DEMO_ACTION',
  });
}
