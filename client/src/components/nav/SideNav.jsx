import React, { Component } from 'react';
// import { Link } from  'react-router-dom';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

class SideNav extends Component {
   openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
 closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

  render() {
    return ( 
    <div id="mobile">
    {/*
      <div id="mySidenav" className="sidenav">
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a>
      </div>
    */}
        <Nav id="mySidenav" className="sidenav">
            <a className="closebtn" onClick={this.closeNav}>&times;</a>
              <Link to="/">
                Home
              </Link>
              <Link to="/showtimes">
                ShowTimes
              </Link>
              <Link to="/movies">
                Movies
              </Link>
              <Link to="/login">
                Login
              </Link>
        </Nav> 
      <a id="burger-btn" onClick={this.openNav}>
        <i className="fas fa-bars fa-2x" />
      </a>
    </div>
    );
  }
}

export default SideNav;