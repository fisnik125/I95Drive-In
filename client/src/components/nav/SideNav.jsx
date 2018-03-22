import React, { Component } from 'react';
// import { Link } from  'react-router-dom';
import '../nav/TopNavBar.css';
import { Link } from 'react-router-dom';

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
      <div id="mySidenav" className="sidenav">
        <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a>
      </div>

      <a id="burger-btn" onClick={this.openNav}>
        <i className="fas fa-bars" />
      </a>
    </div>
    );
  }
}

export default SideNav;