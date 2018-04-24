import { Pool, Client } from 'pg';
import mongodb from 'mongodb';

import Users from './users'
import Movies from './movies';
import Showtimes from './showtimes';

const postgres = new Pool();
let mongo = null;

/**
 * command: {String | Function} If postgres, command is a string to be executed
 *          against the postgres pool. If mongo, command is a function that
 *          receives the mongo database instance as the first argument.
 *
 * params: {[...String] | [...Integer]} An array of values used as positional
 *         parameters for the command.
 *
 * Returns: {[Object | null]} A result set. Coerces result into an array for
 *          a standard return interface.
 */
export const query = async (command, params) => {
  if (process.env.MONGO === 'true') {
    const result = await command(mongo, params);
    if (!result) return [];
    return Array.isArray(result) ? result : [result];
  } else {
    const result = await postgres.query(command, params)
    return result.rows;
  }
}

export const findOrCreateDB = async (dbName) => {
  let newDB = false;

  if (process.env.MONGO === "true") {
    newDB = await createMongoDB(dbName);
  } else {
    newDB = await createPostgresDB(dbName);
  }

  if (newDB) {
    await query(Users.setup);
    await query(Movies.setup);
    await query(Showtimes.setup);
  }
}

const createPostgresDB = async (dbName) => {
  const client = new Client({ database: 'postgres' });

  await client.connect();
  const result = await client.query("SELECT count(*) FROM pg_catalog.pg_database WHERE datname = $1", [dbName]);
  const count = result.rows[0].count;

  if (count !== '0') {
    console.log('Found Postgres database. No action taken.');
    return false;
  }

  console.log(`Database not found. Creating: ${dbName}`);
  await client.query(`CREATE DATABASE ${dbName}`);
  await client.end(); // close connection and start using 'i95drivein' implicitly
  return true;
};

const createMongoDB = async (dbName) => {
  try {
    // NB: Attempting to connect to a database automatically creates it.
    const client = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
    // Even though we connect to a specific database in the db url, it does
    // not return a database instance... *sigh*
    mongo = client.db(dbName);
    console.log('Found or created Mongo database.');
  } catch(error) {
    console.error(`Error connecting to or creating Mongo db: ${dbName}`);
  }
}
