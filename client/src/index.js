import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from  'react-router-dom';
import Alert from 'react-s-alert';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Showtimes from './components/Showtimes';
import Login from  './components/Login';
import MainNav from './components/MainNav';
import Admin from './components/Admin';
import NotFound from './components/NotFound';
import Registration from './components/Registration';
import MovieDetail from './components/MovieDetail';
import AdminShowtimes from './components/admin/AdminShowtimes';
import Home from './components/Home';

import userReducer from './reducers/user';

import './index.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';

const store = createStore(userReducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <MainNav />
        <main className='container'>
          <Switch>
            <Route exact path="/" component={Showtimes}/>
            <Route exact path="/admin/showtimes" component={AdminShowtimes}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path ="/register" component={Registration}/>
            <Route exact path="/admin" component={Admin}/>
            <Route exact path="/movies/:id" component={MovieDetail}/>
            <Route component={NotFound} />
          </Switch>
          <Alert effect='stackslide' position='top' timeout={2000} />
        </main>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
