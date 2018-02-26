import { BrowserRouter } from 'react-router-dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Home from './logged_out/home';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
   <Home />
</BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
