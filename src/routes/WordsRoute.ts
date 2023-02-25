import { IRoute, Router } from 'express';
import { Order } from '../types/common';
import { WordsRepository } from '../repositories/WordsRepository';
import { asyncMiddleware } from '../utils/async-middleware';
import { Mode, Word, WordClass } from '../types';

const defaultSearch = {
  limit: 500,
  orderBy: 'wordId',
  order: Order.ASC,
  offset: 0
};

export enum Language {
  RUSSIAN,
  HEBREW
}

export interface EditWordsFilters {
  like: string;
  language: Language;
  limit: number;
}

export interface CardsFilters {
  count: number;
  classes: WordClass[];
  mode: Mode;
  tags: string[];
}

export interface GetWordData {
  wordId: number;
  withForms: boolean;
}

export interface StatsType {
  wordId: number;
  isCorrect: boolean;
  mode: Mode;
}

export class WordsRoute implements IRoute {
  private readonly route;

  constructor(
    private readonly wordsRepository: WordsRepository
  ) {
    this.route = Router();
    this.getEditWordsRoute();
    this.saveWordsRoute();
    this.updateWordsRoute();
    this.getWordRoute();
    this.getWordsForCardsRoute();
    this.saveStats();
    this.getFormsRoute();

    this.getWordController = this.getWordController.bind(this);
    this.getEditWordsController = this.getEditWordsController.bind(this);
    this.saveWordsController = this.saveWordsController.bind(this);
    this.updateWordsController = this.updateWordsController.bind(this);
    this.getWordsForCardsController = this.getWordsForCardsController.bind(this);
    this.saveStatsController = this.saveStatsController.bind(this);
    this.saveFormsController = this.saveFormsController.bind(this);
  }

  public saveWordsRoute() {
    this.route.post(
      '/edit/save',
      asyncMiddleware(async (req, res) => {
        try {
          console.log(req.body);
          const result = await this.saveWordsController(req.body);
          return res.status(200).json(result);
        } catch (e) {
          console.error(`Save route error ${JSON.stringify(e.stack)}`);
          res.sendStatus(500);
        }
      })
    );
  }


  public saveStats() {
    this.route.post(
      '/cards/save-stats',
      asyncMiddleware(async (req, res) => {
        try {
          const result = await this.saveStatsController(req.body);
          return res.status(200).json(result);
        } catch (e) {
          console.error(`Save route error ${JSON.stringify(e.stack)}`);
          res.sendStatus(500);
        }
      })
    );
  }

  public updateWordsRoute() {
    this.route.post(
      '/edit/update',
      asyncMiddleware(async (req, res) => {
        try {
          const result = await this.updateWordsController(req.body);
          return res.status(200).json(result);
        } catch (e) {
          console.error(`Update route error ${JSON.stringify(e.stack)}`);
          res.sendStatus(500);
        }
      })
    );
  }

  public getEditWordsRoute() {
    this.route.post(
      '/edit/search',
      asyncMiddleware(async (req, res) => {
        try {
          const result = await this.getEditWordsController({ ...defaultSearch, ...req.body });
          return res.status(200).json(result);
        } catch (e) {
          console.error(`Search route error ${JSON.stringify(e.stack)}`);
          res.sendStatus(500);
        }
      })
    );
  }

  public getWordsForCardsRoute() {
    this.route.post(
      '/cards/search',
      asyncMiddleware(async (req, res) => {
        try {
          const result = await this.getWordsForCardsController({ ...defaultSearch, ...req.body });
          return res.status(200).json(result);
        } catch (e) {
          console.error(`Search route error ${JSON.stringify(e.stack)}`);
          res.sendStatus(500);
        }
      })
    );
  }

  public getWordRoute() {
    this.route.post(
      '/edit/get-word',
      asyncMiddleware(async (req, res) => {
        try {
          const result = await this.getWordController(req.body);
          console.log(req.body, result);
          return res.status(200).json(result);
        } catch (e) {
          console.error(`get word route error ${JSON.stringify(e.stack)}`);
          res.sendStatus(500);
        }
      })
    );
  }


  public getFormsRoute() {
    this.route.post(
      '/edit/save-forms',
      asyncMiddleware(async (req, res) => {
        try {
          const result = await this.saveFormsController(req.body);
          console.log(req.body, result);
          return res.status(200).json(result);
        } catch (e) {
          console.error(`save forms route error ${JSON.stringify(e.stack)}`);
          res.sendStatus(500);
        }
      })
    );
  }

  public async getWordsForCardsController(filters: CardsFilters): Promise<any> {
    try {
      return this.wordsRepository.getWordsForCards(filters);
    } catch (e) {
      console.error(`Words controller error ${JSON.stringify(e.stack)}`);
      return null;
    }
  }

  public async getWordController(data: GetWordData): Promise<any> {
    try {
      return this.wordsRepository.getWordsWithForms(data);
    } catch (e) {
      console.error(`Words controller error ${JSON.stringify(e.stack)}`);
      return null;
    }
  }

  public async getEditWordsController(filters: EditWordsFilters): Promise<any> {
    try {
      return this.wordsRepository.getWords(filters);
    } catch (e) {
      console.error(`Words controller error ${JSON.stringify(e.stack)}`);
      return null;
    }
  }

  public async saveWordsController(words: Word[]): Promise<any> {
    try {
      return this.wordsRepository.saveWords(words);
    } catch (e) {
      console.error(`Save words controller error ${JSON.stringify(e.stack)}`);
      return null;
    }
  }

  public async saveFormsController(words: Word[]): Promise<any> {
    try {
      return this.wordsRepository.saveForms(words);
    } catch (e) {
      console.error(`Save forms controller error ${JSON.stringify(e.stack)}`);
      return null;
    }
  }

  public async saveStatsController(data: StatsType): Promise<any> {
    try {
      return this.wordsRepository.saveStats(data);
    } catch (e) {
      console.error(`Save words controller error ${JSON.stringify(e.stack)}`);
      return null;
    }
  }

  public async updateWordsController(words: Word[]): Promise<any> {
    try {
      return this.wordsRepository.updateWords(words);
    } catch (e) {
      console.error(`Update words controller error ${JSON.stringify(e.stack)}`);
      return null;
    }
  }

  public get router() {
    return this.route;
  }
}
