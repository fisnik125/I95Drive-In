import * as React from 'react';
import './home.css';
import { Link, Route } from  'react-router-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import Showtimes from '../components/Showtimes';
import TopNavBar from '../components/nav/TopNavBar';

export default class Home extends React.Component {
  render() {
    return (
    
        <div>
          <TopNavBar />
        <nav> 
          <Link to="/showtimes">Showtimesssssssssssssss </Link>

        </nav>
        <Route path="/showtimes" component={Showtimes}/> 
  
        </div>
     
    );
  }
}
