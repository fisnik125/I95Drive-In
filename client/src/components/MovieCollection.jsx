import React, { Component } from 'react';

class MovieCollection extends Component {
	state = {
		movies: [],
		filteredMovies: [],
		movie: {},
		text: []
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

	filterMovies = (e) => {
		const value = e.target.value.toLowerCase();
		console.log(value);
		const filteredMovies = this.state.movies.filter(movie => movie.title.toLowerCase().includes(value));
		this.setState({filteredMovies});
	}


  render() {
    return (
      <div className="header">
        <h1> Choose your Movie </h1>
        <input className="movieSelector" onChange={this.filterMovies}></input>
        <div className="row">
        {this.state.filteredMovies.map(movie => (
    				<div className="col-md-4 col-sm-12 col-lg-3" key={movie.id || movie._id} value={movie.id || movie._id}>
							<a href={'/movies/' + (movie.id || movie._id)}>
								<img className="poster" src={movie.poster} alt="poster"/>
							</a>
    				</div>
        			))
        		}
        </div>
      </div>
    );
  }
}


export default MovieCollection;
