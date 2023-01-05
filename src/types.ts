export enum WordClass {
  VERB = 'verb',
  NOUN = 'noun',
  ADJECTIVE = 'adjective',
  PRONOUN = 'pronoun',
  NUMERALS = 'numerals',
  ADVERB = 'adverb',
  PREPOSITION = 'preposition',
  CONJUNCTION = 'conjunction',
  PARTICLE = 'particle'
}

export enum WordNumber {
  PLURAL = 'plural',
  SINGLE = 'single'
}

export enum WordGender {
  FEMALE = 'female',
  MALE = 'male'
}

export enum WordFace {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third'
}

export enum WordTense {
  PRESENT = 'present',
  PAST = 'past',
  FUTURE = 'future'
}

export enum WordStatus {
  LEARNED = 'learned',
  IN_PROGRESS = 'in_progress',
  REMEMBERED = 'remembered',
  DIFFICULT = 'difficult'
}

export interface WordStats {
  plusesFront: number;
  plusesBack: number;
  minusesFront: number;
  minusesBack: number;
  status: WordStatus;
}

export interface Word {
  wordId?: number;
  word: string;
  translation: string;
  pronunciation: string;
  class: WordClass;
  comment: string;
  formIndex: number;
  root: string;
  number?: WordNumber;
  gender?: WordGender;
  face?: WordFace;
  tense?: WordTense;
  stats?: WordStats;
  isInfinitive?: boolean;
  isPairing?: boolean;
  forms? : Word[]
}

export enum Mode {
  WORD,
  TRANSLATION
}