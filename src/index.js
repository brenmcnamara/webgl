/* @flow */

import AppContainer from './components/AppContainer.react';
import React from 'react';
import ReactDOM from 'react-dom';

window.onload = function() {
  ReactDOM.render(
    <AppContainer />,
    document.getElementById('root'),
  );
};
