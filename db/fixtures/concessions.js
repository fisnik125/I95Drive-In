const pg = require('pg');
const mongodb = require('mongodb');

const Concessions = require('../concessions');
const dbName = 'i95drivein';

(async () => {
  const postgres = new pg.Pool({ database: dbName });
  const db = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
  const mongo = db.db(dbName);

  await postgres.query(Concessions.deleteAll);
  await mongo.collection('concessions').remove({});

  await postgres.query(Concessions.insert, ['popcorn', 6.00]);
  await mongo.collection('concessions').insertOne({ type: 'popcorn', price: 6.00 });

  await postgres.query(Concessions.insert, ['candy', 3.50]);
  await mongo.collection('concessions').insertOne({ type: 'candy', price: 3.50 });

  await postgres.query(Concessions.insert, ['beverage', 2.00]);
  await mongo.collection('concessions').insertOne({ type: 'beverage', price: 2.00 });

  console.log("\n\n*** COMPLETE *** Press CTRL+C to Quit");
})();
