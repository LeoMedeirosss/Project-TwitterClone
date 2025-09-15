/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('likes', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE'); // se usuário for deletado, deleta likes
    table.integer('tweet_id').unsigned().notNullable()
      .references('id').inTable('tweets')
      .onDelete('CASCADE'); // se tweet for deletado, deleta likes
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
