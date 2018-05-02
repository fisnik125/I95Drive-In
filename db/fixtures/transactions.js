const pg = require('pg');
const mongodb = require('mongodb');

const Users = require('../Users');
const Transactions = require('../Transactions');
const Showtimes = require('../Showtimes');

const dbName = 'i95drivein';

(async () => {
  const postgres = new pg.Pool({ database: dbName });
  const db = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
  const mongo = db.db(dbName);

  await postgres.query(Transactions.deleteAll);
  await mongo.collection('transactions').remove({});

  const users = await postgres.query(Users.all);
  const showtimes = await postgres.query(Showtimes.all)

  const records = await users.rows.map(async user => {
    const transactions = numTransactions();

    return Array(transactions).fill().map(async transaction => {
      const userEmail = user.email;
      const { id: transactionableId, start_date: startDate, end_date: endDate } = randomShowtime(showtimes.rows);
      const quantity = randomQuantity();
      const transactionableType = 'showtimes';

      console.log(`Inserting Transaction for ${userEmail}. Quantity: ${quantity}`);
      await postgres.query(Transactions.insert, [userEmail, transactionableId, transactionableType, quantity]);
      const mongoShowtime = await mongo.collection('showtimes').findOne({ startDate, endDate });

      try {
        await mongo.collection('transactions').insertOne({
          userEmail, transactionableId: mongoShowtime._id, transactionableType, quantity
        });
      } catch (error) {
        console.error('!!! Error inserting mongo transaction !!!:');
      }
    });
  });

  console.log(`Inserted: ${records.length} transactions`);
  console.log('Some time zone weirdness may have caused a few mongo transactions to fail  ¯\_(ツ)_/¯')
  if (!records.length) console.log('No records? Make sure you have showtimes and users first!\nyarn fixtures:load:showtimes\nyarn fixtures:load:users');

  console.log("\n\n*** COMPLETE *** Press CTRL+C to Quit");
})();

const numTransactions = () => Math.floor(Math.random() * Math.floor(3)) // 0..3
const randomQuantity = () => Math.floor(Math.random() * Math.floor(5) + 1) // 1..5
const randomShowtime = (showtimes) => {
  const randomIndex = Math.floor(Math.random() * Math.floor(showtimes.length));
  return showtimes[randomIndex];
}
