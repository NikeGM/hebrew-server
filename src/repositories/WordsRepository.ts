import { tryCatchWrapperAsync } from '../utils/wrapper';
import { Word } from '../types';
import { EditWordsFilters, GetWordData, Language } from '../routes/WordsRoute';

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

  public async getWordsWithForms(data: GetWordData) {
    const { wordId, withForms } = data;

    const formId = await this.getFormId(wordId);

    const query = this.client.table(this.tables.WORDS)
      .select()
      .where({ formId })
      .orderBy('formIndex', 'asc');

    if (!withForms) query.where({ formIndex: 0 });
    return this.executeQuery(query, 'get words with forms');
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
