import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';

import '../components/Login.css';

class Login extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange = ({ target: { value, id } }) => {
    this.setState({ [id]: value });
  }

  handleSubmit = (ev) => {
    const { email, password } = this.state;
    const { onLogin, history, location } = this.props;

    ev.preventDefault();

    this.callApi(email, password)
      .then(res => { onLogin(res.user) })
      .then(() => {
        let redirect = location.search.match(/redirect=([^&]*)/);
        redirect = _.get(redirect, '1', undefined);

        redirect ? history.push(redirect) : history.push('/');
      })
      .catch(err => console.error(err));
  }

  callApi = async (email, password) => {
    const response = await fetch('/api/session', {
      body: JSON.stringify({ email, password }),
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  render() {
    return (
      <div className="LoginForm">
        <form >
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              className="autoFocus"
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            onClick={this.handleSubmit}
            className="block"
            bsStyle="primary"
            bsSize="large"
            type="submit"
            href="/Admin">
            Login
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (user) => { dispatch({ type: 'LOGIN', user }); }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Login)
);
