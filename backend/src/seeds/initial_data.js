/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Clean tables
  await knex('likes').del();
  await knex('tweets').del();
  await knex('users').del();

 // Insert user
const insertedUser = await knex('users')
  .insert({
    username: 'leo',
    email: 'leo@email.com',
    password_hash: '1234' // change
  })
  .returning('id');

const userId = insertedUser[0].id;

// Insert tweet
const insertedTweet = await knex('tweets')
  .insert({
    user_id: userId,
    content: 'Meu primeiro tweet!'
  })
  .returning('id');

const tweetId = insertedTweet[0].id;

// Insert like
await knex('likes').insert({
  user_id: userId,
  tweet_id: tweetId
});

};
