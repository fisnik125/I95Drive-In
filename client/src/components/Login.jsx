import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import '../components/Login.css';

export default class Login extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  validateForm() {
    return ; // this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = ({ target: { value, id } }) => {
    this.setState({ [id]: value });
  }

  handleSubmit = (ev) => {
    const { email, password } = this.state;

    ev.preventDefault();

    this.callApi(email, password)
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  callApi = async (email, password) => {
    const response = await fetch('/api/user', {
      body: JSON.stringify({ email, password }),
      method: 'POST',
      headers: { 'content-type': 'application/json' },
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