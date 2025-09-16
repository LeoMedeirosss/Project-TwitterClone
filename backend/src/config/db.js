const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    user: 'postgres',
    host: 'localhost',
    database: 'twitter_clone',
    password: 'dkprio00',
    port: 5432,
  },
});

module.exports = db;
