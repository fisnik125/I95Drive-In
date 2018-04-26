const mongo = require('mongodb');

const postgresCommands = {
  setup: `
    CREATE TABLE showtimes(
      movie_id SERIAL references movies(id) NOT NULL,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      PRIMARY KEY(movie_id, start_date)
    );`,
  forMovie: `
    SELECT * FROM showtimes WHERE movie_id = $1`,
  deleteAll: `
    TRUNCATE showtimes`,
  delete: `
    DELETE FROM showtimes WHERE movie_id = $1 AND start_date = $2`,
  insert: `
    INSERT INTO showtimes VALUES ($1, $2, $3)`,
  all: `
    SELECT * FROM showtimes`
  }

const mongoCommands = {
  setup: (db) => {
    return db.createCollection('showtimes');
  },
  forMovie: (db, params) => {
    return db.collection('showtimes').find({ movieId: mongo.ObjectId(params[0]) }).toArray();
  },
  all: (db) => {
    return db.collection('showtimes').find().toArray();
  },
  insert: (db, params) => {
    return db.collection('showtimes').insert({ movieId: params[0], startDate: params[1], endDate: params[2] });
  },
  delete: (db, params) => {
    const startDate = new Date(params[1]);
    const movieId = mongo.ObjectId(params[0]);

    return db.collection('showtimes').deleteOne({ movieId, startDate });
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
