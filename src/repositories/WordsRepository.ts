import { tryCatchWrapperAsync } from '../utils/wrapper';
import { Mode, Word } from '../types';
import { CardsFilters, EditWordsFilters, GetWordData, Language, StatsType } from '../routes/WordsRoute';
import { shuffle } from '../utils/utils';

export class WordsRepository {
  private readonly tables = {
    WORDS: 'words',
    STATS: 'stats'
  };

  constructor(private readonly client) {
    this.updateWord = this.updateWord.bind(this);
  }

  public async saveWords(words: Word[]) {
    const query = this.client.table(this.tables.WORDS).insert(words).returning('wordId');

    const ids = await this.executeQuery<number>(query, 'save words');

    return this.client.table(this.tables.WORDS).update({
      formId: ids[0]
    }).whereIn('wordId', ids);

  }

  public async saveStats(data: StatsType, personId = 1) {
    const { wordId, isCorrect, mode } = data;
    const query = this.client.table(this.tables.STATS);

    const dbStatsRows = await this.client.table(this.tables.STATS).select().where({ wordId });
    const dbStats = dbStatsRows[0];

    if (dbStats) {
      query.update({
        personId,
        plusesFront: (mode === Mode.WORD && isCorrect) ? dbStats.plusesFront + 1 : dbStats.plusesFront,
        minusesFront: (mode === Mode.WORD && !isCorrect) ? dbStats.minusesFront + 1 : dbStats.minusesFront,
        plusesBack: (mode === Mode.TRANSLATION && isCorrect) ? dbStats.plusesBack + 1 : dbStats.plusesBack,
        minusesBack: (mode === Mode.TRANSLATION && !isCorrect) ? dbStats.minusesBack + 1 : dbStats.minusesBack
      })
        .where({ wordId });
    } else {
      query.insert({
        personId,
        wordId,
        plusesFront: +(mode === Mode.WORD && isCorrect),
        minusesFront: +(mode === Mode.WORD && !isCorrect),
        plusesBack: +(mode === Mode.TRANSLATION && isCorrect),
        minusesBack: +(mode === Mode.TRANSLATION && !isCorrect)
      });
    }
    return this.executeQuery<number>(query, 'save words');
  }


  public async getWords(filters: EditWordsFilters) {
    const { limit, language, like } = filters;

    const query = this.client
      .table(this.tables.WORDS)
      .select().limit(limit);

    if (language === Language.HEBREW) query.where('word', 'like', `%${like}%`);
    if (language === Language.RUSSIAN) query.where('translation', 'like', `%${like}%`);

    return this.executeQuery(query, 'save words');
  }

  private async getFormId(wordId: number) {
    const query = this.client.table(this.tables.WORDS).select('formId').where({ wordId });

    const result = await this.executeQuery<{ formId: number }>(query, 'get formId');

    return result && result.length ? result[0].formId : null;
  }

  public async getWordsWithForms(data: GetWordData): Promise<Word[]> {
    const { wordId, withForms } = data;

    const formId = await this.getFormId(wordId);

    const query = this.client.table(this.tables.WORDS)
      .select()
      .where({ formId })
      .orderBy('formIndex', 'asc');

    if (!withForms) query.where({ formIndex: 0 });
    return this.executeQuery<Word>(query, 'get words with forms');
  }

  public async getWordsForCards(data: CardsFilters) {
    const { count, classes, mode } = data;
    console.log(data);
    const query = this.client
      .select(
        'w.wordId',
        'word',
        'translation',
        'pronunciation',
        'class',
        'formIndex',
        'number',
        'gender',
        'face',
        'root',
        'tense',
        'comment',
        'isPairing',
        'isInfinitive',
        'formId',
        'binyan',
        'group',
        this.client.raw(`s."plusesFront" - s."minusesFront" as difFront`),
        this.client.raw(`s."plusesBack" - s."minusesBack" as difBack`)
      )
      .from(`${this.tables.WORDS} as w`)
      .leftJoin(`${this.tables.STATS} as s`, 'w.wordId', 's.wordId')
      .whereIn('class', classes)
      .andWhere({ formIndex: 0 })
      .limit(count * 2);

    if (mode === Mode.WORD) query.orderByRaw(`difFront asc`);
    if (mode === Mode.TRANSLATION) query.orderByRaw(`difBack asc`);

    const result: Word[] = await this.executeQuery(query, 'get words for cards');
    const words = shuffle<Word>(result).slice(0, count);

    const wordsWithForms: Word[] = [];

    for (let wordContainer of words) {
      const {
        wordId, word, translation, number, root, formIndex, comment, class: wordClass, pronunciation,
        face, isPairing, gender, tense, isInfinitive, binyan, group
      } = wordContainer;
      console.log(wordContainer);
      wordsWithForms.push({
        forms: (await this.getWordsWithForms({ wordId: wordContainer.wordId, withForms: true })).slice(1),
        wordId, word, translation, number, root, formIndex, comment, pronunciation, face, isPairing, gender,
        tense, isInfinitive, binyan, group,
        class: wordClass
      });
    }

    return wordsWithForms;
  }

  public async updateWords(words: Word[]) {
    return Promise.all(words.map(this.updateWord));
  }

  public async updateWord(word: Word) {
    const query = this.client.table(this.tables.WORDS).update(word).where({ wordId: word.wordId });

    return this.executeQuery(query, 'update word');
  }

  public async executeQuery<T>(query, queryName: string) {
    return tryCatchWrapperAsync<T[]>(query, `Execute query ${queryName}`, []);
  }
}
