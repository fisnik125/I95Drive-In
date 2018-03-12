import { Pool, Client } from 'pg';

import Users from './users'

const pool = new Pool();

export const query = (text, params) => pool.query(text, params);

export const findOrCreateDB = async (dbName) => {
  const client = new Client({ database: 'postgres' });

  await client.connect();
  const result = await client.query("SELECT count(*) FROM pg_catalog.pg_database WHERE datname = $1", [dbName]);
  const count = result.rows[0].count;

  if (count !== '0') {
    console.log('Found database. No action taken.');
    return true;
  }

  console.log(`Database not found. Creating: ${dbName}`);
  await client.query(`CREATE DATABASE ${dbName}`);
  await client.end(); // close connection and start using 'i95drivein' implicitly

  await query(Users.createTable);
};
