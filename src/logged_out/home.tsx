import * as React from 'react';
import './home.css';
import {  Route } from  'react-router-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import Showtimes from '../components/Showtimes';
import Movies from '../components/Movies';
import Login from  '../components/Login';
import TopNavBar from '../components/nav/TopNavBar';

export default class Home extends React.Component {
  render() {
    return (
    
        <div>
          <TopNavBar />
          <Route path="/showtimes" component={Showtimes}/> 
        <Route path="/Login" component={Login}/> 
        <Route path="/Movies" component={Movies}/> 
  
        </div>
     
    );
  }
}
