import type { EvaluationData } from '../types';

const STORAGE_KEY = 'athenometro_history';
const SETTINGS_KEY = 'athenometro_settings';
const MODEL_KEY = 'athenometro_model';

export function getHistory(): EvaluationData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading from localStorage', e);
  }
  return [];
}

export function saveEvaluation(evaluation: EvaluationData) {
  const history = getHistory();
  // se esiste già un id identico (es. risalvato), eliminalo prima
  const newHistory = [evaluation, ...history.filter(h => h.id !== evaluation.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function deleteEvaluation(id: string) {
  const history = getHistory();
  const newHistory = history.filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function getApiKey(): string {
  return localStorage.getItem(SETTINGS_KEY) || '';
}

export function saveApiKey(key: string) {
  localStorage.setItem(SETTINGS_KEY, key);
}

export function getAiModel(): string {
  return localStorage.getItem(MODEL_KEY) || 'claude-sonnet-4-6';
}

export function saveAiModel(model: string) {
  localStorage.setItem(MODEL_KEY, model);
}
