const mongo = require('mongodb');

const postgresCommands = {
  setup: `
    CREATE TABLE concessions(
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      price NUMERIC NOT NULL,
    );`,
  insert: `
    INSERT INTO concessions (type, price, rated, released, runtime, genre, director, writer, actors, plot, language, country, poster, production)
    VALUES ($1, $2);`,
  all: `
    SELECT * FROM concessions`,
  deleteAll: `
    TRUNCATE concessions CASCADE;
  `,
  find: `
    SELECT * FROM concessions WHERE id = $1
  `,
  }

const mongoCommands = {
  setup: (db) => {
    return db.createCollection('concessions');
  },
  all: (db) => {
    return db.collection('concessions').find().toArray();
  },
  find: (db, params) => {
    const concessionId = mongo.ObjectId(params[0]);
    return db.collection('concessions').find({ _id: concessionId }).toArray();
  },
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
