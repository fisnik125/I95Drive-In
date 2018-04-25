import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import _ from 'lodash';

import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

export default class AdminShowtimes extends Component {
  state = {
    movies: [],
    movie: {},
    showtimes: [],
    defaultDate: new Date(), // The date that is shown in the calendar
  }

	componentWillMount() {
    this.fetchAllMoviesAndShowtimes();
	}

  fetchAllMoviesAndShowtimes = () => {
    this.fetchMovies()
      .then(res => { this.setState({ movies: res.movies }); })
      .then(this.fetchShowtimes)
      .then(res => {
        const showtimes = this.state.movies.map(movie => {
          const movieShowTimes = res.showtimes.filter(st => st.movie_id === movie.id || st.movie_id === movie._id);
          return this.formatShowtimes(movie, movieShowTimes);
        });

        this.setState({ showtimes: _.flatten(showtimes), defaultDate: new Date() });
      })
      .catch(err => console.error(err));
  }

  fetchShowtimes = async () => {
    const response = await fetch('/api/showtimes', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
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

  fetchShowtimeForMovie = async (id) => {
    const response = await fetch(`/api/movies/${id}/showtimes`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  formatShowtimes = (movie, showtimes) => {
    return showtimes.map(({ start_date, end_date }, i) => ({
      id: i,
      start: new Date(start_date),
      end: new Date(end_date),
      title: movie.title,
      allDay: false
    }));
  }

  changeMovie = (e) => {
    const id = parseInt(e.target.value, 10);

    if (!id) { // Selected the blank option
      this.fetchAllMoviesAndShowtimes();
      return true;
    }

    const currentMovie = this.state.movies.find(movie => movie.id === id || movie._id === id );
    this.setState({ movie: currentMovie });

    this.fetchShowtimeForMovie(id)
      .then(res => {
        const showtimes = this.formatShowtimes(currentMovie, res.showtimes);
        const defaultDate = _.get(showtimes, '0.start', new Date());

        this.setState({ showtimes, defaultDate });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1>ShowTimes</h1>
        <form>
        	<select onChange={this.changeMovie}>
            <option></option>
        		{this.state.movies.map(movie => (
        			<option key={movie.id || movie._id} value={movie.id || movie._id}>
        				{movie.title}
        			</option>
        			))
        		}
        	</select>

          { this.state.showtimes.length ?
            <BigCalendar defaultView="week"
                         selectable
                         onNavigate={() => {}}
                         date={this.state.defaultDate}
                         views={['month', 'week']}
                         events={this.state.showtimes} />
          : <p>No Showtimes Available for the selected movie</p> }
        </form>
      </div>
    );
  }
}
