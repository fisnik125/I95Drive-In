import React, {Component} from 'react';

class Registration extends Component{
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value})
  }

  submit = () => {
    const { email, password } = this.state;
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
