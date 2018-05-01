import React, { Component } from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import './MovieDetail.css';

class Showtime extends Component {
  state = {
    modalIsOpen: false,
    quantity: 0,
  }

  toggleModal = () => {
    const { user, login } = this.props;

    if (!user) login();
    else this.setState(({ modalIsOpen }) => ({ modalIsOpen: !modalIsOpen }));
  }

  updateTotal = (ev) => {
    const { value } = ev.target;

    this.setState({ quantity: value });
  }

  createTransaction = async ({ id, quantity }) => {
    const response = await fetch('/api/transactions', {
      body: JSON.stringify({ transactionableId: id, quantity, transactionableType: 'showtimes' }),
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body
  }

  purchaseShowtimes = () => {
    const { quantity } = this.state;
    const { id } = this.props;

    this.createTransaction({ id, quantity })
      .then(() => { Alert.success('Movie Ticket(s) Purchased.'); })
      .then(this.toggleModal)
      .catch(err => { console.error('Error creating transaction: ', err); });
  }

  render() {
    const { startDate, endDate, price } = this.props;
    const { modalIsOpen, quantity } = this.state;

    return [
      <div key={1} className='MovieDetail__showtime' onClick={this.toggleModal}>
        <div className='MovieDetail__showtime--left'>
          <span className='MovieDetail__showtime-start-date'>{startDate}</span>
          <span className='MovieDetail__showtime-end-date'> - {endDate}</span>
        </div>

        <div className='MovieDetail__showtime--right'>
          <span className='MovieDetail__showtime-price'>${price} / person</span>
        </div>
      </div>,

      <Modal key={2} ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={this.toggleModal}>
        <h2>Purchase Tickets</h2>
        <div className='MovieDetail__modal-container'>
          <span>${price} x </span>
          <input value={quantity} onChange={this.updateTotal} type='number' min='1'/>
          <span> = ${price * quantity}</span>
        </div>
        <button className='MovieDetail__modal-container-button' onClick={this.purchaseShowtimes}>Purchase</button>
      </Modal>
    ];
  }
}

class MovieDetail extends Component {
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
    const { user, history, location } = this.props;

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
          { showtimes.map((showtime, i) => {
            const { showtime_id, _id, start_date, end_date, startDate, endDate, price } = showtime;
            const formattedStartDate = moment(start_date || startDate).format("dddd, MMMM DD, h:mm:ss a");
            const formattedEndDate = moment(end_date || endDate).format("MMMM DD, h:mm:ss a");
            const login = () => history.push(`/login?redirect=${location.pathname}`);

            return (
              <Showtime key={i}
                        user={user}
                        login={login}
                        id={showtime_id || _id}
                        startDate={formattedStartDate}
                        endDate={formattedEndDate}
                        price={price} />
            );
          })
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MovieDetail)
);
