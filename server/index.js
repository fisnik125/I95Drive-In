import express from 'express';
import bodyParser from 'body-parser';

import { findOrCreateDB, query } from '../db';
import Users from '../db/users';
import Movies from '../db/movies';
import Showtimes from '../db/showtimes';

require('dotenv').config(); // Load .env files into process.env

const { PORT, PGDATABASE } = process.env
const app = express();
const port = PORT || 8080;

// Priority serve any static files.
app.use(express.static('client/build'));
app.use(bodyParser.json());

// Login
app.post('/api/session', async (req, res) => {
  const { email, password } = req.body;

  const result = await query(Users.login, [email, password]);

  if (result.length === 0) {
    res.status(400).send({ message: 'No user matched that email or password.' });
  } else {
    res.status(200).send({ message: 'User Authenticated.' });
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
        movie_id: undefined, start_date: undefined, end_date: undefined,
      });

      const showtimes = rows.map(row => ({
        movie_id: row.movieId, start_date: row.start_date, end_date: row.end_date })
      );

      return { movie, showtimes };
    };

    try {
      const { movie, showtimes } = await query(Movies.findWithShowtimes, [id], formatResult);
      res.status(200).send({ movie, showtimes });
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
  const { start, end, movieId } = req.body;

  try {
    const showtimes = await query(Showtimes.insert, [movieId, start, end]);
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

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile('client/build/index.html', { root: '.' });
});

findOrCreateDB(PGDATABASE)
  .then(() => { app.listen(port, () => console.log(`Listening on port ${port}`)); })
  .catch(err => { console.error(`There was an error connecting to the DB: ${err}`); });
