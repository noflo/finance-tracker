exports.up = function createOpsTags(knex) {
  return knex.schema.createTable('operations_tags', (t) => {
    t.increments('id').primary();
    t.integer('op_id').references('id').inTable('operations').notNullable();
    t.integer('tag_id').references('id').inTable('tags').notNullable();
    t.index(['op_id', 'tag_id']);
  });
};

exports.down = function dropOpsTags(knex) {
  return knex.schema.dropTable('operations_tags');
};
