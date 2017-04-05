exports.up = function createOps(knex) {
  return knex.schema.createTable('operations', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('id').inTable('users').notNullable();
    t.decimal('amount').notNullable();
    t.string('currency').notNullable();
    t.string('description');
    t.timestamps();
    t.index(['user_id', 'tag']);
  });
};

exports.down = function dropOps(knex) {
  return knex.schema.dropTable('operations');
};
