exports.up = function createUsers(knex) {
  return knex.schema.createTable('users', (t) => {
    t.uuid('id').primary();
    t.string('name').unique();
    t.string('token').unique();
    t.string('currency');
  });
};

exports.down = function dropUsers(knex) {
  return knex.schema.dropTable('users');
};
