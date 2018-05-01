import React, { Component } from 'react';

class MovieCollection extends Component {
	state = {
		movies: [
			// {id: 1, title:'12 Angry Men', poster:'https://ia.media-imdb.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg'},
			// {id: 2, title:'A Beautiful Mind', poster:'https://images-na.ssl-images-amazon.com/images/M/MV5BMzcwYWFkYzktZjAzNC00OGY1LWI4YTgtNzc5MzVjMDVmNjY0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'},
			// {id: 3, title: 'Alien Alien', poster:'https://images-na.ssl-images-amazon.com/images/M/MV5BNDNhN2IxZWItNGEwYS00ZDNhLThiM2UtODU3NWJlZjBkYjQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'}
		],
		filteredMovies: [
			// {id: 1, title:'12 Angry Men', poster:'https://ia.media-imdb.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg'},
			// {id: 2, title:'A Beautiful Mind', poster:'https://images-na.ssl-images-amazon.com/images/M/MV5BMzcwYWFkYzktZjAzNC00OGY1LWI4YTgtNzc5MzVjMDVmNjY0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'},
			// {id: 3, title: 'Alien Alien', poster:'https://images-na.ssl-images-amazon.com/images/M/MV5BNDNhN2IxZWItNGEwYS00ZDNhLThiM2UtODU3NWJlZjBkYjQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'}
		],
		movie: {},
		text: []
	}

	componentWillMount() {
		this.fetchMovies()
    .then(res => { this.setState({ movies: res.movies }); })
    .catch(err => console.error(err));
		// this.searchMovies();
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

	// const filterItems = (query) => {
  // return movies.filter((movie) =>
  //   movie.toLowerCase().indexOf(query.toLowerCase()) > -1
	//   );
	// }
	//


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
        <input onChange={this.filterMovies}></input>
        <div className="row">
        {this.state.filteredMovies.map(movie => (
    				<div className="col-md-4 col-sm-4 col-lg-4" key={movie.id || movie._id} value={movie.id || movie._id}>
    					{movie.title}
    					<img src={movie.poster} alt="poster" />
    				</div>
        			))
        		}
        </div>
      </div>
    );
  }
}


export default MovieCollection;
