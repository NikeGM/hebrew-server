exports.up = async (knex) => {
  await knex.schema.createTable('words', (table) => {
    table.increments('wordId');
    table.string('word');
    table.string('translation'); // Перевод
    table.string('pronunciation'); // Транскрипция
    table.string('class'); // Часть речи
    table.integer('formIndex'); // Поле для сортировка по формам
    table.string('number'); // Число
    table.string('gender'); // Род
    table.string('face'); // Лицо
    table.string('root'); // Корень слова
    table.string('tense'); // Время
    table.string('comment'); // Коментарий
    table.boolean('isPairing').defaultTo(false); // Сопряжение
    table.boolean('isInfinitive').defaultTo(false); // Инфинитив

    table.index('wordId');
  });
  await knex.schema.createTable('stats', (table) => {
    table.increments('id');
    table.integer('wordId')
      .references('wordId')
      .inTable('words');
    table.string('personId');

    table.integer('plusesFront').defaultTo(0);
    table.integer('plusesBack').defaultTo(0);
    table.integer('minusesFront').defaultTo(0);
    table.integer('minusesBack').defaultTo(0);
    table.string('status'); // статус при изучении

    table.unique(['personId', 'wordId']);
    table.index(['personId', 'wordId']);
  });

};

exports.down = async (knex) => {
  await knex.schema.dropTable('stats');
  await knex.schema.dropTable('words');
};
