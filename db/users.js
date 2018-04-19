const postgresCommands = {
  setup: `CREATE TABLE users(
     email TEXT PRIMARY KEY NOT NULL,
     password TEXT NOT NULL,
     admin BOOLEAN DEFAULT FALSE
   );`,
   login: `SELECT * FROM users WHERE email = $1 AND password = $2`,
   register: `INSERT INTO users VALUES ($1,$2)`
}

const mongoCommands = {
  setup: (db) => {
    db.createCollection('users');
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

export default commands;
