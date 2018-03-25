const movieFixtures = require('./movies.json');
const pg = require('pg');
const Movies = require('../movies');

(async () => {
  const pool = new pg.Pool({
    database: 'i95drivein'
  });

  movieFixtures.forEach(movie => {
    const { Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Poster, Production } = movie;
    
    console.log('Inserting ' + Title);
    pool.query(Movies.insert, [Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Poster, Production]);
  });
})();
