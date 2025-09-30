/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('likes', function (table) {
    table.increments('id').primary();

    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
      
    table.integer('tweet_id').unsigned().notNullable()
      .references('id').inTable('tweets')
      .onDelete('CASCADE');
    table.timestamps(true, true);

    table.unique(['user_id', 'tweet_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable('likes');
};
