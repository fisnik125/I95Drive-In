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
          const movieShowTimes = res.showtimes.filter(st =>
            (!_.isUndefined(movie.id) && st.movie_id === movie.id ) ||
            (!_.isUndefined(movie._id) && st.movieId === movie._id));

          return this.formatShowtimes(movie, movieShowTimes);
        });

        this.setState({ showtimes: _.flatten(showtimes) });
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
    return showtimes.map(showtime => ({
      id: Math.floor((Math.random() * 10000000) + 1),
      movieId: movie.id || movie._id,
      start: new Date(showtime.start_date || showtime.startDate),
      end: new Date(showtime.end_date || showtime.endDate),
      title: movie.title,
      allDay: false
    }));
  }

  changeMovie = (e) => {
    const value = e.target.value;
    const id = isNaN(value) ? value : parseInt(e.target.value, 10);

    if (!id) { // Selected the blank option
      this.fetchAllMoviesAndShowtimes();
      return true;
    }

    const currentMovie = this.state.movies.find(movie => movie.id === id || movie._id === id );
    this.setState({ movie: currentMovie });

    this.fetchShowtimeForMovie(id)
      .then(res => {
        const showtimes = this.formatShowtimes(currentMovie, res.showtimes);
        this.setState({ showtimes });
      })
      .catch(err => console.error(err));
  }

  createShowTime = async (start, end, movieId, price) => {
    const response = await fetch('/api/showtimes', {
      body: JSON.stringify({ start, end, movieId, price }),
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  deleteShowTime = async (start, movieId) => {
    const response = await fetch(`/api/showtimes/${movieId}?start=${start}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  onSelectSlot = ({ start, end }) => {
    const { movie: { title, id, _id }, showtimes } = this.state;

    const price = window.prompt("Please enter a price for this showtime", 0.00);

    this.createShowTime(this.formatDate(start), this.formatDate(end), (id || _id), price)
      .then(res => {
        const updatedShowtimes = showtimes;
        updatedShowtimes.push({ id: showtimes.length + 1, movieId: id || _id, start, end, title });
        this.setState({ showtimes: updatedShowtimes });
      })
      .catch(err => { console.error(err); });
  }

  formatDate = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');

  onSelectEvent = ({ id, start, movieId }) => {
    if (window.confirm("Do you want to delete this showtime?")) {

      this.deleteShowTime(this.formatDate(start), movieId)
        .then(res => {
          alert('Showtime deleted!');
          const remainingShowtimes = this.state.showtimes.filter(st => st.id !== id);
          this.setState({ showtimes: remainingShowtimes });
        })
        .catch(err => { console.error(`Error deleting showtime: ${err}`); });
    }
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

          { !this.state.showtimes.length && <p>No Showtimes for the selected movie</p> }

          <BigCalendar defaultView="week"
                       selectable={!_.isEmpty(this.state.movie)}
                       defaultDate={new Date()}
                       onSelectSlot={this.onSelectSlot}
                       onSelectEvent={this.onSelectEvent}
                       views={['month', 'week']}
                       events={this.state.showtimes} />
        </form>
      </div>
    );
  }
}
