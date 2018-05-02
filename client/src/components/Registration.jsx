import React, { Component } from 'react';

import Api from '../Api';

class Registration extends Component{
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value})
  }

  submit = () => {
    const { email, password } = this.state;
    Api.post('/api/user', { email, password })
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  render(){
    return(
      <div>
        <label htmlFor="email">Email</label>
        <input id='email' onChange={this.handleChange} name='email' type='email'></input>
        <label htmlFor="password">Password</label>
        <input id='password' onChange={this.handleChange} name='password' type='password'></input>
        <button onClick={this.submit}>
          Submit
        </button>
      </div>
    )
  }
}

export default Registration;
