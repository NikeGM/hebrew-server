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
  binyan?: WordBinyan;
  group?: WordGroup;
  stats?: WordStats;
  isInfinitive?: boolean;
  isPairing?: boolean;
  forms?: Word[];
  tags?: string[];
}

export enum WordBinyan {
  PAAL = 'paal',
  PIEL = 'piel',
  HIFIL = 'hifil',
  HITPAEL = 'hitpael',
  NIFAL = 'NIFAL'
}

export enum WordGroup {
  PAAL_SIMPLE = 'paal-simple',
  PAAL_OT = 'paal-ot',
  PAAL_2_LETTERS = 'paal-2-letters',
  PIEL_EAE = 'piel-eae',
  PIEL_EAOT = 'piel-eaot',
  PIEL_4_LETTERS = 'piel-4-letters',
  HIFIL_SIMPLE = 'hifil-simple',
  HITPAEL_SIMPLE = 'hitpael-simple',
  NIFAL_SIMPLE = 'nifal-simple',
}

export enum Mode {
  WORD,
  TRANSLATION
}