const pg = require('pg');

const dbName = 'i95drivein';

(async () => {
  const client = new pg.Client({ database: 'postgres' });
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${dbName}`);

  console.log(`${dbName} database dropped. Press Cmd + C to exit`);
})();
