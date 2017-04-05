exports.up = function createTags(knex) {
  return knex.schema.createTable('tags', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('id').inTable('users').notNullable();
    t.string('tag').notNullable();
    t.index(['user_id', 'tag']);
  });
};

exports.down = function dropTags(knex) {
  return knex.schema.dropTable('tags');
};
