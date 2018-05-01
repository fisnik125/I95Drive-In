import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './MainNav.css';

class MainNav extends Component {
  componentWillMount() {
    const { login } = this.props;

    this.checkSession()
      .then(res => { login(res.user) })
      .catch(err => { /* Do nothing */ });
  }

  deleteSession = async () => {
    const response = await fetch('/api/session', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  checkSession = async () => {
    const response = await fetch('/api/session', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache',
      },
      credentials: 'include',
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  logout = () => {
    const { onLogout } = this.props;

    this.deleteSession()
      .then(res => { onLogout(); })
      .catch(err => { console.error(err); });
  }

  render() {
    const { user } = this.props;

    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <i className="fas fa-film fa-2x"></i>
              <span id="logo">I95 Drive-In</span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            { user ?
              <NavItem key={1} eventKey={1} componentClass={Link} onClick={this.logout} to='/' href='/'>
                Logout
              </NavItem>
            : [<NavItem key={1} eventKey={1} componentClass={Link} to='/login' href='/login'>
                Login
              </NavItem>,
              <NavItem key={2} eventKey={2} href='/register' componentClass={Link} to='/register'>
                Register
              </NavItem>]
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => { dispatch({ type: 'LOGOUT' }); },
  login: (email) => { dispatch({ type: 'LOGIN', email }); },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainNav);
