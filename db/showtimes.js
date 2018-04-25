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
    return db.collection('showtimes').find({ movie_id: params[0] }).toArray();
  },
  all: (db) => {
    return db.collection('showtimes').find();
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
