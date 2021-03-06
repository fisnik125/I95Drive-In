const pg = require('pg');
const mongodb = require('mongodb');

const Showtimes = require('../showtimes');
const Movies = require('../movies');

const dbName = 'i95drivein';

(async () => {
  const postgres = new pg.Pool({ database: dbName });
  const db = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
  const mongo = db.db(dbName);

  await postgres.query(Showtimes.deleteAll);
  await mongo.collection('showtimes').remove({});

  const movies = await postgres.query(Movies.all);

  const records = await movies.rows.map(async movie => {
    const showtimes = numShowtimes();

    return Array(showtimes).fill().map(async showtime => {
      const startDate = randomDate();
      startDate.setMilliseconds(0);
      const endDate = new Date(startDate.getTime() + (parseInt(movie.runtime) * 60 * 1000));
      const price = Math.floor(Math.random() * (10 * 100 - 1 * 100) + 1 * 100) / (1 * 100);

      console.log(`Inserting Showtime for ${movie.title}: ${startDate} - ${endDate}. Price: ${price}`);

      await postgres.query(Showtimes.insert, [movie.id, startDate, endDate, price]);
      const mongoMovie = await mongo.collection('movies').findOne({ title: movie.title });
      return await mongo.collection('showtimes').insertOne({ movieId: mongoMovie._id, startDate, endDate, price });
    });
  });

  console.log(`Inserted: ${records.length} showtimes`);
  if (!records.length) console.log('No records? Make sure you have movies first! yarn fixtures:load:movies');

  console.log("\n\n*** COMPLETE *** Press CTRL+C to Quit");
})();

const numShowtimes = () => Math.floor(Math.random() * Math.floor(3))

const randomDate = () => {
  const startDate = new Date();
  const endDate = new Date(2019, 0, 1);

  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}
