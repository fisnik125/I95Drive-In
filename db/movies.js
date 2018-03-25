module.exports = {
  createTable: `
    CREATE TABLE movies(
      title TEXT PRIMARY KEY NOT NULL,
      year NUMERIC(4) NOT NULL,
      rated TEXT,
      released TEXT,
      runtime TEXT,
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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`
  };
  