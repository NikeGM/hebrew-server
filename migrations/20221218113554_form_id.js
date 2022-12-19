exports.up = async (knex) => {
  await knex.schema.alterTable('words', table => {
    table.integer('formId');
  })
}

exports.down = async (knex) => {
  await knex.schema.alterTable('words', table => {
    table.dropColumn('formId');
  })
};
