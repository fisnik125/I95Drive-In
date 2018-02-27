import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import '../components/Login.css';

export default class Login extends Component  {
  constructor(props: {}) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  validateForm() {
    return ; // this.state.email.length > 0 && this.state.password.length > 0;
  }

  // handleChange = event => {
  //   this.setState({
  //     [event.target.id]: event.target.value
  //   });
  // }

  // handleSubmit = event => {
  //   event.preventDefault();
  // }

  render() {
    return (
      <div className="LoginForm">
        <form >
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              className="autoFocus"
              type="email"
            //  value={this.state.email}
            //  onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
            //  value={this.state.password}
          //    onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            className="block"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}
