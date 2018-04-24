import React, { Component } from 'react';

export default class AdminShowtimes extends Component {
  state = {
    movies: [],
    showtimes: [],
  }

	componentWillMount() {
    this.fetchMovies()
      .then(res => { this.setState({ movies: res.movies }); })
      .catch(err => console.error(err));
	}

  fetchMovies = async () => {
    const response = await fetch('/api/movies', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  fetchShowtimes = async (id) => {
    const response = await fetch(`/api/movies/${id}/showtimes`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  changeMovie = (e) => {
    const id = e.target.value;
    this.fetchShowtimes(id)
      .then(res => { this.setState({ showtimes: res.showtimes }); })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1>ShowTimes</h1>
        <form>
        	<select onChange={this.changeMovie}>
        		{this.state.movies.map(movie => (
        			<option key={movie.id || movie._id} value={movie.id || movie._id}>
        				{movie.title}
        			</option>
        			))
        		}
        	</select>

          { this.state.showtimes.length ?
            <select>
              {this.state.showtimes.map((showtime, i) => (
          			<option key={i} value={i}>
          				{showtime.showing}
          			</option>
          			))
          		}
            </select>
           : null }
        </form>
      </div>
    );
  }
}
