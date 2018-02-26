import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from  'react-router-dom';

export default class TopNavBar extends Component {
  render() {
    return (
        // tslint:disable-next-line:jsx-boolean-value
        <Navbar default collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">I95 Drive-In</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      
      </Navbar>
    );
  }
}
