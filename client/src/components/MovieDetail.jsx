import React, { Component } from 'react';
import moment from 'moment';

import './MovieDetail.css';

export default class MovieDetail extends Component {
  state = {
    movie: {},
    showtimes: [],
  }

  componentWillMount() {
    const { id } = this.props.match.params;

    this.fetchMovieWithShowtimes(id)
      .then(({ movie, showtimes }) => { this.setState({ movie, showtimes }); })
      .catch(err => {
        console.error(`Error fetching Movie with Showtimes: ${err}`);
      });
  }

  fetchMovieWithShowtimes = async (movieId) => {
    const response = await fetch(`/api/movies/${movieId}?withShowtimes=true`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  render() {
    const { movie, showtimes } = this.state;

    return (
      <div className='MovieDetail'>
        <h1 className='MovieDetail__title'>{movie.title}</h1>
        <span className='MovieDetail__director'>Directed by {movie.director}</span>
        <span className='MovieDetail__genres'>{movie.genre}</span>

        <div className='MovieDetail__poster-plot'>
          <img className='MovieDetail__poster' src={movie.poster} alt='Movie Poster'/>
          <div className='MovieDetail__plot-actors'>
            <p className='MovieDetail__plot'>{movie.plot}</p>
            <p className='MovieDetail__actors'>Starring: {movie.actors}</p>
          </div>
        </div>

        <div className='MovieDetail__meta-info'>
          <span className='MovieDetail__meta-info-rated'>Rated: {movie.rated}</span>
          <span className='MovieDetail__meta-info-runtime'>{movie.runtime} minutes</span>
          <span className='MovieDetail__meta-info-released'>Released: {movie.released}</span>
          <span className='MovieDetail__meta-info-production'>{movie.production}</span>
        </div>

        <div className='MovieDetail__showtimes'>
          {showtimes.map((showtime, i) => {
            const { start_date, end_date, price } = showtime;
            const formattedStartDate = moment(start_date).format("dddd, MMMM DD, h:mm:ss a");
            const formattedEndDate = moment(end_date).format("MMMM DD, h:mm:ss a");

            return (
              <div className='MovieDetail__showtime' key={i}>
                <div className='MovieDetail__showtime--left'>
                  <span className='MovieDetail__showtime-start-date'>{formattedStartDate}</span>
                  <span className='MovieDetail__showtime-end-date'> - {formattedEndDate}</span>
                </div>

                <div className='MovieDetail__showtime--right'>
                  <span className='MovieDetail__showtime-price'>${price} / person</span>
                </div>
              </div>
            );
          })
          }
        </div>
      </div>
    );
  }
}
