import React, { Component } from 'react';

import './MovieDetail.css';

export default class MovieDetail extends Component {
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
    return (
      <div className='MovieDetail'>
        <div className='MovieDetail__poster-plot'>
          <img className='MovieDetail__poster' alt='Movie Poster'/>
          <div className='MovieDetail__plot-actors'>
            <p className='MovieDetail__plot'></p>
            <p className='MovieDetail__actors'></p>
          </div>
        </div>

        <div className='MovieDetail__rating-duration'>

        </div>

        <div className='MovieDetail__showtimes'>
          <div className='MovieDetail__showtime'>
            <div className='MovieDetail__showtime--left'>
              <span className='MovieDetail__showtime-date'></span>
              <span className='MovieDetail__showtime-time'></span>
            </div>

            <div className='MovieDetail__showtime--right'>
              <span className='MovieDetail__showtime-price'></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
