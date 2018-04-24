import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

export default class AdminShowtimes extends Component {
  state = {
    movies: [],
    movie: {},
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

  formatShowtimes = (showtimes) => {
    return showtimes.map(({ start_date, end_date }, i) => ({
      id: i,
      start: new Date(start_date),
      end: new Date(end_date),
      title: this.state.movie.title,
      allDay: false
    }));
  }

  changeMovie = (e) => {
    const id = parseInt(e.target.value, 10);

    this.setState({ movie: this.state.movies.find(movie => movie.id === id || movie._id === id ) })

    this.fetchShowtimes(id)
      .then(res => {
        const showtimes = this.formatShowtimes(res.showtimes);
        this.setState({ showtimes });
      })
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
            <BigCalendar defaultView="week" defaultDate={this.state.showtimes[0].start} events={this.state.showtimes} />
           : null }
        </form>
      </div>
    );
  }
}
