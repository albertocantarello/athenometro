export type ScoreValue = 1 | 3 | 5;

export interface Scores {
  tc: ScoreValue;
  sc: ScoreValue;
  ri: ScoreValue;
  fr: ScoreValue;
  nr: ScoreValue;
}

export type ZoneType = 'Verde' | 'Gialla' | 'Rossa';

export interface EvaluationData {
  id: string;
  date: string;
  titolo: string;
  oneLiner: string;
  pubblico: string;
  angolo: string;
  scores: Scores;
  zona: ZoneType;
  sp: number;
  aiMotivations?: {
    tc?: string;
    sc?: string;
    ri?: string;
    fr?: string;
    nr?: string;
  };
  protocolloSicurezza?: {
    confini: string;
    esempi: string;
    lessico: string;
    takeaway: string;
    fraseContesto: string;
  };
  suggerimentoAngoloAlternativo?: string;
}

export const emptyScores: Scores = {
  tc: 3,
  sc: 3,
  ri: 3,
  fr: 3,
  nr: 3
};
