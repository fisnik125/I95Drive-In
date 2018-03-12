import { Pool, Client } from 'pg';

export const query = (text, params) => Pool.query(text, params);

export const findOrCreateDB = async (dbName) => {
  const client = new Client({ database: 'postgres' });

  await client.connect();
  const result = await client.query("SELECT count(*) FROM pg_catalog.pg_database WHERE datname = $1", [dbName]);
  const count = result.rows[0].count;

  if (count === '0') {
    console.log(`Database not found. Creating: ${dbName}`);
    await client.query(`CREATE DATABASE ${dbName}`);
  } else {
    console.log('Found database. No action taken.');
  }
};
