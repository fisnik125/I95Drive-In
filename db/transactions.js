const mongo = require('mongodb');

const postgresCommands = {
  setup: `
    CREATE TABLE transactions(
      id SERIAL PRIMARY KEY NOT NULL,
      user_email TEXT references users(email) NOT NULL,
      transactionable_id NUMERIC NOT NULL,
      transactionable_type TEXT NOT NULL,
      quantity NUMERIC NOT NULL
    );`,
  insert: `
    INSERT INTO transactions (user_email, transactionable_id, transactionable_type, quantity)
    VALUES ($1, $2, $3, $4)`,
  }

const mongoCommands = {
  setup: (db) => {
    return db.createCollection('transactions');
  },
  insert: (db, params) => {
    const userEmail = params[0];
    const transactionableId = mongo.ObjectId(params[1]);
    const transactionableType = params[2];
    const quantity = params[3]

    return db.collection('transactions').insert({
      userEmail, transactionableId, transactionableType, quantity,
    });
  },
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
