import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import Api from '../Api';

import './MainNav.css';

class MainNav extends Component {
  componentWillMount() {
    const { login } = this.props;

    Api.get('/api/session')
      .then(res => { login(res.user) })
      .catch(err => { /* Do nothing */ });
  }

  logout = () => {
    const { onLogout } = this.props;

    Api.delete('/api/session')
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

            { _.get(user, 'admin') ?
            [<NavItem key={5} eventKey={5} componentClass={Link} to='/admin/showtimes' href='/admin/showtimes'>
              Edit Showtimes
            </NavItem>,
            <NavItem key={6} eventKey={6} componentClass={Link} to='/admin/reports' href='admin/reports'>
              Reports
            </NavItem>] : null }

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
  login: (user) => { dispatch({ type: 'LOGIN', user }); },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainNav);
