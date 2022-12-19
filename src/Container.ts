import { Api } from './Api';
import knex from 'knex';
import { RouteType } from './types/common';
import { WordsRepository } from './repositories/WordsRepository';
import { WordsRoute } from './routes/WordsRoute';

export class ApiContainer {
  private _dbClient: any;
  private _api: Api;
  private _wordsRoute: WordsRoute;
  private _wordsRepository: WordsRepository;

  private routes: RouteType[] = [
    {
      path: '/words',
      route: this.wordsRoute
    }
  ];

  get wordsRepository(): WordsRepository {
    if (!this._wordsRepository) {
      this._wordsRepository = new WordsRepository(this.dbClient);
    }
    return this._wordsRepository;
  }

  get wordsRoute(): WordsRoute {
    if (!this._wordsRoute) {
      this._wordsRoute = new WordsRoute(this.wordsRepository);
    }
    return this._wordsRoute;
  }

  get api(): Api {
    if (!this._api) {
      this._api = new Api(this.routes);
    }
    return this._api;
  }

  get dbClient(): any {
    if (!this._dbClient) {
      this._dbClient = knex({
        client: 'pg',
        connection: {
          host: process.env.DB_HOST,
          user: process.env.POSTGRES_USER,
          database: process.env.POSTGRES_DB,
          password: process.env.POSTGRES_PASSWORD,
          port: +process.env.DB_PORT
        }
      });
    }
    return this._dbClient;
  }
}