/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1', //localhost
      port: 5432,              
      database: 'twitter_clone', // database name
      user: 'postgres',
      password: 'dkprio00'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};