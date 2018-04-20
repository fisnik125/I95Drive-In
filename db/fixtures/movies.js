const pg = require('pg');
const mongodb = require('mongodb');

const movieFixtures = require('./movies.json');
const Movies = require('../movies');
const dbName = 'i95drivein';

(async () => {
  const postgres = new pg.Pool({ database: dbName });
  const db = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
  const mongo = db.db(dbName);

  await postgres.query(Movies.deleteAll);
  await mongo.collection('movies').remove({});

  movieFixtures.forEach(async movie => {
    const { Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Poster, Production } = movie;

    console.log('Inserting ' + Title);

    await postgres.query(Movies.insert, [Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Poster, Production]);
    await mongo.collection('movies').insertOne(movie);
  });

  console.log("\n\n*** COMPLETE *** Press CTRL+C to Quit");
})();
