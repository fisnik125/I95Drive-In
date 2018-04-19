import { Pool, Client } from 'pg';
import mongodb from 'mongodb';

import Users from './users'
import Movies from './movies';

const postgres = new Pool();
let mongo = null;

/**
 * command: {String | Function} If postgres, command is a string to be executed
 *          against the postgres pool. If mongo, command is a function that
 *          receives the mongo database instance as the first argument.
 *
 * params: {[...String] | [...Integer]} An array of values used as positional
 *         parameters for the command.
 */
export const query = (command, params) => (
  process.env.MONGO === 'true' ?
    command(mongo, params) :
    postgres.query(command, params)
)

export const findOrCreateDB = async (dbName) => {
  if (process.env.MONGO === "true") {
    createMongoDB(dbName);
  } else {
    createPostgresDB(dbName);
  }
}

const createPostgresDB = async (dbName) => {
  const client = new Client({ database: 'postgres' });

  await client.connect();
  const result = await client.query("SELECT count(*) FROM pg_catalog.pg_database WHERE datname = $1", [dbName]);
  const count = result.rows[0].count;

  if (count !== '0') {
    console.log('Found Postgres database. No action taken.');
    return true;
  }

  console.log(`Database not found. Creating: ${dbName}`);
  await client.query(`CREATE DATABASE ${dbName}`);
  await client.end(); // close connection and start using 'i95drivein' implicitly

  await query(Users.setup);
  await query(Movies.setup);
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

  await query(Users.setup);
  await query(Movies.setup);
}
