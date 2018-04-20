import express from 'express';
import bodyParser from 'body-parser';

import { findOrCreateDB, query } from '../db';
import Users from '../db/users';

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
    res.status(404).send({ message: `Error creating user: ${error.message}` });
  }
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile('client/build/index.html', { root: '.' });
});

findOrCreateDB(PGDATABASE)
  .then(() => { app.listen(port, () => console.log(`Listening on port ${port}`)); })
  .catch(err => { console.error(`There was an error connecting to the DB: ${err}`); });
