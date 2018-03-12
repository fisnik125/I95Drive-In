import express from 'express';
import bodyParser from 'body-parser';
import { findOrCreateDB } from '../db';

require('dotenv').config(); // Load .env files into process.env

const { PORT, PGDATABASE } = process.env
const app = express();
const port = PORT || 8080;

// Priority serve any static files.
app.use(express.static('client/build'));
app.use(bodyParser.json());

app.post('/api/user', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile('client/build/index.html', { root: '.' });
});

findOrCreateDB(PGDATABASE)
  .then(() => { app.listen(port, () => console.log(`Listening on port ${port}`)); })
  .catch(err => { console.error(`There was an error connecting to the DB: ${err}`); });
