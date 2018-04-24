const postgresCommands = {
  setup: `
    CREATE TABLE showtimes(
      movie_id SERIAL references movies(id) NOT NULL,
      showing tsrange NOT NULL,
      theatre NUMERIC NOT NULL,
      PRIMARY KEY(movie_id, showing)
    );`,
  forMovie: `
    SELECT * FROM showtimes WHERE movie_id = $1`,
  deleteAll: `
    TRUNCATE showtimes`,
  }

const mongoCommands = {
  setup: (db) => {
    return db.createCollection('showtimes');
  },
  forMovie: (db, params) => {
    return db.collection('showtimes').find({ movie_id: params[0] }).toArray();
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
