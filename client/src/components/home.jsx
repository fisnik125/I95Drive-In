import React from 'react';
import './home.css';
import { Switch, Route } from  'react-router-dom';

import Showtimes from './Showtimes';
import Login from  './Login';
import MainNav from './MainNav';
import Admin from './Admin';
import NotFound from './NotFound';
import Registration from './Registration';
import AdminShowtimes from './admin/AdminShowtimes';

const Home = () => (
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
);


export default Home;
