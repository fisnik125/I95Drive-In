const pg = require('pg');
const mongodb = require('mongodb');

const Users = require('../Users');
const Transactions = require('../Transactions');
const Showtimes = require('../Showtimes');
const Concessions = require('../Concessions');

const dbName = 'i95drivein';

(async () => {
  const postgres = new pg.Pool({ database: dbName });
  const db = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
  const mongo = db.db(dbName);

  await postgres.query(Transactions.deleteAll);
  await mongo.collection('transactions').remove({});

  const users = await postgres.query(Users.all);
  const showtimes = await postgres.query(Showtimes.all);
  const concessions = await postgres.query(Concessions.all);

  const records = await users.rows.map(async user => {
    const transactions = numTransactions();

    return Array(transactions).fill().map(async transaction => {
      const userEmail = user.email;
      const transactionableType = showtimeOrConcession();
      const quantity = randomQuantity();

      if (transactionableType === 'showtimes') {
        const { id: transactionableId, start_date: startDate, end_date: endDate } = randomShowtime(showtimes.rows);
        console.log(`Inserting Showtime Transaction for ${userEmail}. Quantity: ${quantity}`);

        await postgres.query(Transactions.insert, [userEmail, transactionableId, transactionableType, quantity]);
        const mongoShowtime = await mongo.collection('showtimes').findOne({ startDate, endDate });

        try {
          await mongo.collection('transactions').insertOne({
            userEmail, transactionableId: mongoShowtime._id, transactionableType, quantity
          });
        } catch (error) {
          console.error('!!! Error inserting mongo transaction !!!:');
        }
      } else {
        const { id: transactionableId, type } = randomConcession(concessions.rows);
        console.log(`Inserting Concession Transaction for ${userEmail}. Quantity: ${quantity}`);

        await postgres.query(Transactions.insert, [userEmail, transactionableId, transactionableType, quantity]);

        const mongoConcession = await mongo.collection('concessions').findOne({ type });
        await mongo.collection('transactions').insertOne({
          userEmail, transactionableId: mongoConcession._id, transactionableType, quantity
        });
      }
    });
  });

  console.log(`Inserted: ${records.length} transactions`);
  console.log('Some time zone weirdness may have caused a few mongo transactions to fail  ¯\_(ツ)_/¯')
  if (!records.length) console.log('No records? Make sure you have showtimes and users first!\nyarn fixtures:load:showtimes\nyarn fixtures:load:users');

  console.log("\n\n*** COMPLETE *** Press CTRL+C to Quit");
})();

const numTransactions = () => Math.floor(Math.random() * Math.floor(8)) // 0..8
const randomQuantity = () => Math.floor(Math.random() * Math.floor(5) + 1) // 1..5
const showtimeOrConcession = () => Math.random() < .5 ? 'concessions' : 'showtimes';
const randomShowtime = (showtimes) => {
  const randomIndex = Math.floor(Math.random() * Math.floor(showtimes.length));
  return showtimes[randomIndex];
}
const randomConcession = (concessions) => {
  const randomIndex = Math.floor(Math.random() * Math.floor(concessions.length));
  return concessions[randomIndex];
}
