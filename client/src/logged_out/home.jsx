import React from 'react';
import './home.css';
import { Switch, Route } from  'react-router-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import Showtimes from '../components/Showtimes';
import Movies from '../components/Movies';
import Login from  '../components/Login';
import TopNavBar from '../components/nav/TopNavBar';
import HomeComponent from '../components/HomeComponent';
import Admin from '../components/Admin';
import NotFound from '../components/NotFound';
import Registration from '../components/Registration';

const Home = () => (
        <div>
          <TopNavBar />
          <Switch>
            <Route exact path ="/" component={HomeComponent}/>
            <Route exact path="/showtimes" component={Showtimes}/> 
            <Route exact path="/login" component={Login}/>
            <Route exact path ="/registration" component={Registration}/> 
            <Route exact path="/movies" component={Movies}/> 
            <Route exact path="/admin" component={Admin}/>
            <Route component={NotFound} />
          </Switch>
        </div>
     
)


export default Home;