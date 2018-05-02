import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Api from '../Api';

class MovieCollection extends Component {
	state = {
		movies: [],
		filteredMovies: [],
		movie: {},
		text: []
	}

	componentWillMount() {
		Api.get('/api/movies')
      .then(({ movies }) => { this.setState({ movies, filteredMovies: movies }); })
      .catch(err => console.error(err));
		}

	filterMovies = (e) => {
		const value = e.target.value.toLowerCase();
		const filteredMovies = this.state.movies.filter(movie =>
      movie.title.toLowerCase().includes(value)
    );
		this.setState({ filteredMovies });
	}

  render() {
    return (
      <div className="header">
        <h1> Choose your Movie </h1>
        <input className="movieSelector" onChange={this.filterMovies}></input>
        <div className="row">
        {this.state.filteredMovies.map((movie, i) => {
          const movieId = movie.id || movie._id;

          return (
            <div className="col-md-4 col-sm-12 col-lg-3" key={i} value={movieId}>
							<Link to={`/movies/${movieId}`}>
								<img className="poster" src={movie.poster} alt="poster"/>
							</Link>
    				</div>
          );
        })}
        </div>
      </div>
    );
  }
}


export default MovieCollection;
