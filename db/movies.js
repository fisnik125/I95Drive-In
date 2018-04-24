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
  }

const mongoCommands = {
  setup: (db) => {
    return db.createCollection('movies');
  },
  all: (db) => {
    return db.collection('movies').find().toArray();
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
