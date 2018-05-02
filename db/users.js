const postgresCommands = {
  setup: `CREATE TABLE users(
     email TEXT PRIMARY KEY NOT NULL,
     password TEXT NOT NULL,
     admin BOOLEAN DEFAULT FALSE
   );`,
   login: `SELECT * FROM users WHERE email = $1 AND password = $2`,
   insert: `INSERT INTO users VALUES ($1, $2, $3)`,
   deleteAll: `TRUNCATE users CASCADE`,
   all: `SELECT * FROM users`,
}

const mongoCommands = {
  setup: (db) => {
    db.createCollection('users');
  },
  insert: async (db, params) => {
    const user = await db.collection('users').findOne({ email: params[0] });
    if (user) throw new Error('User with that email already exists');
    return await db.collection('users').insert({ email: params[0], password: params[1], admin: params[2] });
  },
  login: async (db, params) => (
    await db.collection('users').findOne({ email: params[0], password: params[1] })
  ),
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
