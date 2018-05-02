import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import { findOrCreateDB, query } from '../db';
import Users from '../db/users';
import Movies from '../db/movies';
import Showtimes from '../db/showtimes';
import Transactions from '../db/transactions';

require('dotenv').config(); // Load .env files into process.env

const { PORT, PGDATABASE } = process.env
const app = express();
const port = PORT || 8080;

app.set('trust proxy', 1); // trust first proxy

// Priority serve any static files.
app.use(express.static('client/build'));

app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  name: 'i95drivein',
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
}));

// Login
app.post('/api/session', async (req, res) => {
  const { email, password } = req.body;

  const result = await query(Users.login, [email, password]);
  const user = result[0];

  if (result.length === 0) {
    res.status(400).send({ message: 'No user matched that email or password.' });
  } else {
    req.session.user = user;
    res.status(200).send({ message: 'User Authenticated.', user });
  }
});

app.delete('/api/session', async (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.status(200).send({ message: 'User logged out.' });
  });
});

app.get('/api/session', async (req, res) => {
  const { user } = req.session;

  if (user) {
    res.status(200).send({ message: 'Already Logged In.', user });
  } else {
    res.status(404).send({ message: 'User not logged in.' });
  }
});

// Registration
app.post('/api/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    await query(Users.register, [email, password]);
    res.status(200).send({ message: 'User Created.' });
  } catch(error){
    res.status(400).send({ message: `Error creating user: ${error.message}` });
  }
});

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await query(Movies.all);
    res.status(200).send({ movies });
  } catch(error) {
    res.status(404).send({ message: `Error fetching movies: ${error.message}` });
  }
});

app.get('/api/movies/:id/showtimes', async (req, res) => {
  const { id } = req.params;

  try {
    const showtimes = await query(Showtimes.forMovie, [id]);
    res.status(200).send({ showtimes });
  } catch(error) {
    res.status(404).send({ message: `Error fetching showtimes: ${error.message}` });
  }
});

// Get a movie
// Optional withShowtimes=true query param to perform join
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { withShowtimes } = req.query;

  const onlyMovie = async () => {
    try {
      const movie = await query(Movies.find, [id]);
      res.status(200).send({ movie });
    } catch(err) {
      res.status(404).send({ message: `Error finding movie with id: ${id}. Error: ${err}` });
    }
  };

  const movieAndShowtimes = async () => {
    // Only executed for postgres to get movies / showtimes in separate keys
    const formatResult = (rows) => {
      const movie = Object.assign({}, rows[0], {
        // Grab all values from the first row except these below values
        movie_id: undefined, start_date: undefined, end_date: undefined, price: undefined,
      });

      const showtimes = rows.map(row => ({
        showtime_id: row.showtime_id, movie_id: row.movie_id, start_date: row.start_date, end_date: row.end_date, price: row.price })
      );

      return [{ movie, showtimes }];
    };

    try {
      const result = await query(Movies.findWithShowtimes, [id], formatResult);
      res.status(200).send({ movie: result[0].movie, showtimes: result[0].showtimes });
    } catch(err) {
      res.status(404).send({ message: `Error finding movie with id: ${id}. Error: ${err}` });
    }
  }

  withShowtimes ? movieAndShowtimes() : onlyMovie();
});

app.get('/api/showtimes', async (req, res) => {
  try {
    const showtimes = await query(Showtimes.all);
    res.status(200).send({ showtimes });
  } catch(error) {
    res.status(404).send({ message: `Error fetching showtimes: ${error.message}` });
  }
});

app.post('/api/showtimes', async (req, res) => {
  const { start, end, movieId, price } = req.body;

  try {
    const showtimes = await query(Showtimes.insert, [movieId, start, end, price]);
    res.status(200).send({ message: 'Showtime Created.' });
  } catch(error) {
    res.status(400).send({ message: `Error creating showtime: ${error.message}` });
  }
});

app.delete('/api/showtimes/:movieId', async (req, res) => {
  const { movieId } = req.params;
  const { start } = req.query;

  try {
    await query(Showtimes.delete, [movieId, start]);
    res.status(200).send({ message: 'Showtime Deleted.' });
  } catch(error) {
    res.status(400).send({ message: `Error deleting showtime: ${error.message}` });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { transactionableType, quantity } = req.body;
  const { email } = req.session.user;
  let { transactionableId } = req.body;

  if (!isNaN(transactionableId)) transactionableId = parseInt(transactionableId, 10);

  if (!user) {
    res.status(400).send({ message: 'User not logged in' });
  } else {
    try {
      await query(Transactions.insert, [email, transactionableId, transactionableType, quantity]);
      res.status(200).send({ message: 'Transaction Created.' });
    } catch(error) {
      res.status(400).send({ message: `Error creating transaction: ${error.message}` });
    }
  }
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile('client/build/index.html', { root: '.' });
});

findOrCreateDB(PGDATABASE)
  .then(() => { app.listen(port, () => console.log(`Listening on port ${port}`)); })
  .catch(err => { console.error(`There was an error connecting to the DB: ${err}`); });
