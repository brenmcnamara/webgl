/* @flow */

import React from 'react';
import Store from '../store/Store';

import demo from '../actions/demo';
import getCount from '../store/getCount';

export type Props = {

};

export type State = {
  count: number,
};

export default class AppContainer extends React.Component {

  props: Props;
  state: State;

  _onChangeStore: () => void;
  _unsubscribe: ?(() => void);

  static calculateState(): State {
    return {
      count: getCount(),
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = AppContainer.calculateState();
    this._onChangeStore = this._onChangeStore.bind(this);
    this._unsubscribe = null;
  }

  componentDidMount() {
    this._unsubscribe = Store.subscribe(this._onChangeStore);
  }

  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  render() {
    return (
      <div>
        <h1>Pushed {this.state.count} time(s)</h1>
        <button onClick={this._onClickButton}>Push Me!</button>
      </div>
    );
  }

  _onChangeStore() {
    this.setState(AppContainer.calculateState());
  }

  _onClickButton() {
    demo();
  }

}
