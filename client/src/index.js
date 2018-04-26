import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from  'react-router-dom';

import Showtimes from './components/Showtimes';
import Login from  './components/Login';
import MainNav from './components/MainNav';
import Admin from './components/Admin';
import NotFound from './components/NotFound';
import Registration from './components/Registration';
import AdminShowtimes from './components/admin/AdminShowtimes';

import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <MainNav />
      <Switch>
        <Route exact path ="/" component={Showtimes}/>
        <Route exact path="/admin/showtimes" component={AdminShowtimes}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path ="/register" component={Registration}/>
        <Route exact path="/admin" component={Admin}/>
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
