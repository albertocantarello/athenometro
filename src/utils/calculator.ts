import type { Scores, ZoneType } from '../types';

export function runCalculator(scores: Scores): { zona: ZoneType; sp: number } {
  const { sc, ri, fr, nr } = scores;

  // Zona basata su RI (Rischio)
  let zona: ZoneType = 'Gialla';
  if (ri === 1) zona = 'Verde';
  if (ri === 3) zona = 'Gialla';
  if (ri === 5) zona = 'Rossa';

  // Score di Priorità
  const sp = (fr + nr + sc) - ri;

  return { zona, sp };
}

export function getZoneColorClass(zona: ZoneType): string {
  switch (zona) {
    case 'Verde': return 'bg-decisionGreen text-white';
    case 'Gialla': return 'bg-decisionYellow text-gray-900';
    case 'Rossa': return 'bg-decisionRed text-white';
    default: return 'bg-gray-200 text-gray-800';
  }
}

export function getSpMessage(sp: number): string {
  if (sp >= 7) return 'Tema forte, da pianificare';
  if (sp >= 4) return 'Tema valido, da rifinire';
  return 'Tema debole, da ripensare';
}
