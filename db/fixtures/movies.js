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
    const { title, year, rated, released, runtime, genre, director, writer, actors, plot, language, country, poster, production } = movie;

    console.log('Inserting ' + title);

    await postgres.query(Movies.insert, [title, year, rated, released, runtime, genre, director, writer, actors, plot, language, country, poster, production]);
    await mongo.collection('movies').insertOne(movie);
  });

  console.log("\n\n*** COMPLETE *** Press CTRL+C to Quit");
})();
