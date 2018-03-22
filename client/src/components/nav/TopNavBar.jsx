import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
// import { Link } from  'react-router-dom';
import '../nav/TopNavBar.css';
import { Link } from 'react-router-dom';
import SideNav from './SideNav';

export default class TopNavBar extends Component {
  render() {
    return (
      <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">
            <i className="fas fa-film fa-2x"></i>
            <a id="logo">I95 Drive-In</a>
          </Link>
        </Navbar.Brand>
       <SideNav />
      </Navbar.Header>
      <Nav className="pull-right">
        <div id="desktop">
          <NavItem eventKey={1}>
            <Link to="/">
              Home
            </Link>
          </NavItem>
          <NavItem eventKey={2}>
            <Link to="/showtimes">
              ShowTimes
            </Link>
          </NavItem>
          <NavItem eventKey={3}>
            <Link to="/movies">
              Movies
            </Link>
          </NavItem>
          <NavItem eventKey={4}>
            <Link to="/login">
              Login
            </Link>
          </NavItem>
        </div>
      </Nav> 
    </Navbar>
  
    );
  }
}