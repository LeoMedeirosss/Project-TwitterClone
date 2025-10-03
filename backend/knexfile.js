/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1', //localhost
      port: 5432,              
      database: 'twitter_clone', // database name
      user: 'postgres',
      password: 'dkprio00',
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'seeds')
    }
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, 'src', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'seeds')
    }
  }
};