
import React from 'react';
import ReactDOM from 'react-dom';

window.onload = function() {
  ReactDOM.render(
    <div>
      <h1>Starter Kit</h1>
      <p>Hello From Starter Kit</p>
      <LoremIpsum />
    </div>,
    document.getElementById('root')
  );
}

class LoremIpsum extends React.Component {

  render() {
    const elems = [];
    for (let i = 0; i < 20; ++i) {
      elems.push(this._renderLoremIpsum(i));
    }
    return <div>{ elems }</div>
  }

  _renderLoremIpsum(i) {
    return (
      <p className="pt-running-text" key={i}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
        est laborum
      </p>
    );
  }

}
