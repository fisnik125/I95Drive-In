import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './logged_out/Home';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './styles.css';

ReactDOM.render(
  <BrowserRouter>
    <Home  />
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
