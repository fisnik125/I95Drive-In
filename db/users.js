export default {
  createTable: `CREATE TABLE users(
     email TEXT PRIMARY KEY NOT NULL,
     password TEXT NOT NULL,
     admin BOOLEAN DEFAULT FALSE
   );`,
   login: `SELECT * FROM users WHERE email = $1 AND password = $2`,
};
