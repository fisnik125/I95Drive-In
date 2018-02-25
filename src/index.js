import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './logged_out/home';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
