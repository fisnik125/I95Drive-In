import * as React from 'react';
import './home.css';

const logo = require('../logo.svg');

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <header className="home-header">
          <img src={logo} className="home-logo" alt="logo" />
          <h1 className="home-title">Welcome to React</h1>
        </header>
        <p className="home-intro" />
      </div>
    );
  }
}
