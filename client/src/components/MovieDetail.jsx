import React, { Component } from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Api from '../Api';

import './MovieDetail.css';

class Showtime extends Component {
  state = {
    modalIsOpen: false,
    showtimes: 0,
    popcorn: 0,
    candy: 0,
    beverage: 0,
    concessions: [],
  }

  componentWillMount() {
    Api.get('/api/concessions')
      .then(res => { this.setState({ concessions: res.concessions }); })
      .catch(err => { console.error(err); });
  }

  toggleModal = () => {
    const { user, login } = this.props;

    if (!user) login();
    else this.setState(({ modalIsOpen }) => ({ modalIsOpen: !modalIsOpen }));
  }

  updateTotal = (ev) => {
    const { value, name } = ev.target;

    this.setState({ [name]: value });
  }

  puchase = () => {
    let { id: transactionableId } = this.props; // Showtime ID

    ['showtimes', 'popcorn', 'candy', 'beverage'].forEach(item => {
      const quantity = this.state[item];
      const transactionableType = item === 'showtimes' ? 'showtimes' : 'concessions';

      if (!quantity) return;

      if (transactionableType === 'concessions') {
        const concession = this.state.concessions.find(c => c.type === item);
        transactionableId = concession.id || concession._id;
      }

      Api.post('/api/transactions', { transactionableId, transactionableType, quantity })
        .catch(err => { console.error('Error creating transaction: ', err); });
    });

    Alert.success('Item(s) Purchased.');
    this.toggleModal();
  }

  render() {
    const { startDate, endDate, price } = this.props;
    const { modalIsOpen, showtimes } = this.state;

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
          <div className='MovieDetail__modal-showtimes'>
            <span>${price} x </span>
            <input name='showtimes' value={showtimes} onChange={this.updateTotal} type='number' min='1'/>
            <span> = ${price * showtimes}</span>
          </div>
        </div>
        <h2>Purchase Concesions</h2>
        <div className='MovieDetail__modal-container'>
          <div className='MovieDetail__modal-concessions'>
            { this.state.concessions.map((concession, i) => (
              <div key={i} className='MovieDetail__modal-concession'>
                <label>{concession.type}:</label>
                <span>${concession.price} x </span>
                <input name={concession.type} value={this.state[concession.type]} onChange={this.updateTotal} type='number' min='1'/>
                <span> = ${concession.price * this.state[concession.type]}</span>
              </div>
            ))}
          </div>
        </div>
        <button className='MovieDetail__modal-container-button' onClick={this.puchase}>Purchase</button>
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

    Api.get(`/api/movies/${id}?withShowtimes=true`)
      .then(({ movie, showtimes }) => { this.setState({ movie, showtimes }); })
      .catch(err => {
        console.error(`Error fetching Movie with Showtimes: ${err}`);
      });
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

            if (!price) return <strong key={i}>No Showings Available</strong>;

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
