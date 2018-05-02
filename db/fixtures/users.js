const pg = require('pg');
const mongodb = require('mongodb');

const Users = require('../users');

const dbName = 'i95drivein';
const NUM_USERS = 1000;

(async () => {
  const postgres = new pg.Pool({ database: dbName });
  const db = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
  const mongo = db.db(dbName);

  await postgres.query(Users.deleteAll);
  await mongo.collection('users').remove({});

  const records = Array(NUM_USERS).fill().map(async (user, i) => {
    const email = `fixtureUser-${i}@example.com`;
    const password = 'testing123';
    const admin = false;

    await postgres.query(Users.insert, [email, password, admin]);
    return await mongo.collection('users').insertOne({ email, password, admin });
  });

  // Admin User
  const email = 'admin@example.com';
  const password = 'testing123';

  await postgres.query(Users.insert, [email, password, true]);
  await mongo.collection('users').insertOne({ email, password, admin: true });

  console.log(`Inserted: ${records.length} users`);
  console.warn(`\nINSERTED ADMIN USER: email: ${email} password: ${password}`);
  console.log("\n\n*** COMPLETE *** Press CTRL+C to Quit");
})();
