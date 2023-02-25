exports.up = async (knex) => {
  await knex.schema.alterTable('words', table => {
    table.specificType('tags', 'text[]').defaultTo('{}');

  })
}

exports.down = async (knex) => {
  await knex.schema.alterTable('words', table => {
    table.dropColumn('tags');
  })
};
