import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
// import { Link } from  'react-router-dom';
import '../nav/TopNavBar.css';

export default class TopNavBar extends Component {
  render() {
    return (
      <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/HomeComponent">I95 Drive-In</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav className="pull-right">
        <NavItem eventKey={1} href="/Movies">
          Movies
        </NavItem>
        <NavItem eventKey={2} href="/Showtimes">
          ShowTimes
        </NavItem>
        <NavItem eventKey={3} href="/Login">
          Login
        </NavItem>
       
      </Nav> 
    </Navbar>
  
    );
  }
}
