const mongo = require('mongodb');

const postgresCommands = {
  setup: `
    CREATE TABLE movies(
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      year NUMERIC(4) NOT NULL,
      rated TEXT,
      released TEXT,
      runtime NUMERIC NOT NULL,
      genre TEXT,
      director TEXT,
      writer TEXT,
      actors TEXT,
      plot TEXT,
      language TEXT,
      country TEXT,
      poster TEXT,
      production TEXT
    );`,
  insert: `
    INSERT INTO movies (title, year, rated, released, runtime, genre, director, writer, actors, plot, language, country, poster, production)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
  all: `
    SELECT * FROM movies`,
  deleteAll: `
    TRUNCATE movies CASCADE;
  `,
  find: `
    SELECT * FROM movies WHERE id = $1
  `,
  findWithShowtimes: `
    SELECT *, showtimes.id as showtime_id FROM movies
    LEFT OUTER JOIN showtimes ON movies.id = showtimes.movie_id
    WHERE movies.id = $1
  `,
  }

const mongoCommands = {
  setup: (db) => {
    return db.createCollection('movies');
  },
  all: (db) => {
    return db.collection('movies').find().toArray();
  },
  find: (db, params) => {
    const movieId = mongo.ObjectId(params[0]);
    return db.collection('movies').find({ _id: movieId }).toArray();
  },
  findWithShowtimes: async (db, params) => {
    const movieId = mongo.ObjectId(params[0]);
    const result = await db.collection('movies').aggregate([{
      $match: { _id: movieId },
    }, {
      $lookup: {
        from: 'showtimes',
        localField: '_id',
        foreignField: 'movieId',
        as: 'showtimes'
      }
    }]).toArray();

    return {
      movie: Object.assign({}, result[0], { showtimes: undefined }),
      showtimes: result[0].showtimes,
    };
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
