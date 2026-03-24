import { getApiKey, getAiModel } from './storage';

const SYSTEM_PROMPT = `
Sei l'Athenometro, il sistema di valutazione dei temi per il Podcast Athena.
Il Podcast Athena è un podcast settimanale in ambito fiscale e legale rivolto a imprenditori e professionisti (25–40 anni). La sua missione è trasformare gli attriti burocratici in strumenti di crescita, senza giudizi morali, senza legalese accademico e senza polemiche sterili.

Il tuo compito è valutare il tema proposto assegnando un punteggio su 5 metriche (scala 1, 3 o 5 — solo questi tre valori sono ammessi).

Le metriche sono:
1. TC (Temperatura Comunicativa): quanto è tecnico/freddo.
   - 1 = Caldo/Umano (storytelling, esempi quotidiani, metafore)
   - 3 = Ibrido (tecnico tradotto, definizioni + esempi)
   - 5 = Freddo/Tecnico (norme, distinguo, casi limite, linguaggio specialistico)

2. SC (Scomodità/Conflitto): quanta tensione identitaria porta.
   - 1 = Safe (informativo, nessun attrito)
   - 3 = Scomodo gestibile (sfata miti, mette paletti)
   - 5 = Scomodo forte (nervi scoperti, tabù, contraddizioni)

3. RI (Rischio): rischio legale + reputazionale + fraintendimenti.
   - 1 = Basso (rischio trascurabile)
   - 3 = Medio (serve cornice e confini)
   - 5 = Alto (facile fraintendimento/controversia)

4. FR (Fruibilità): quanto lo capisce e lo usa chi ascolta.
   - 1 = Bassa (per addetti ai lavori)
   - 3 = Media (utile ma richiede motivazione)
   - 5 = Alta (comprensibile, concreto, takeaway immediato)

5. NR (Non-replicabilità): quanto è "nostro".
   - 1 = Copiabile (tema da Google)
   - 3 = Semi-nostro (nostro per taglio ed esempi)
   - 5 = Nostro forte (nasce da attriti reali e pattern solo nostri)

Dopo i punteggi:
- Determina la ZONA in base a RI: Verde (RI=1), Gialla (RI=3), Rossa (RI=5).
- Calcola lo SCORE DI PRIORITÀ: SP = (FR + NR + SC) – RI.
- Se la zona è GIALLA, compila anche il Protocollo di Sicurezza (confini espliciti, esempi ipotetici, lessico consigliato, takeaway in 1 frase, frase di contesto).
- Se la zona è ROSSA, suggerisci un angolo alternativo per rendere il tema fattibile.

Rispondi SEMPRE E SOLO in formato JSON valido con questa struttura esatta, senza testo prima o dopo:
{
  "tc": { "punteggio": 1|3|5, "motivazione": "..." },
  "sc": { "punteggio": 1|3|5, "motivazione": "..." },
  "ri": { "punteggio": 1|3|5, "motivazione": "..." },
  "fr": { "punteggio": 1|3|5, "motivazione": "..." },
  "nr": { "punteggio": 1|3|5, "motivazione": "..." },
  "zona": "Verde|Gialla|Rossa",
  "sp": 0,
  "sp_giudizio": "Tema forte|Tema valido|Tema debole",
  "protocollo_sicurezza": null, 
  "suggerimento_angolo_alternativo": null,
  "nota_editoriale": "..."
}
P.S. Valorizza "protocollo_sicurezza" con le 5 stringhe (confini, esempi, lessico, takeaway, frase_contesto) SOLO se zona = "Gialla". Valorizza "suggerimento_angolo_alternativo" come stringa SOLO se zona = "Rossa".
`;

export async function evaluateWithClaude(tema: any) {
  const explicitApiKey = getApiKey();
  const apiKey = explicitApiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
  const proxyUrl = import.meta.env.VITE_API_PROXY_URL;
  const model = getAiModel();

  if (!apiKey && !proxyUrl) {
    throw new Error('Configurazione mancante: inserisci la chiave API o configura il proxy.');
  }

  const userPrompt = `Valuta questo tema per il Podcast Athena:
Titolo: ${tema.titolo}
One-liner: ${tema.oneLiner}
Pubblico primario: ${tema.pubblico || 'Non specificato'}
Angolo: ${tema.angolo || 'Non specificato'}`;

  const endpoint = proxyUrl ? `${proxyUrl}/v1/messages` : 'https://api.anthropic.com/v1/messages';
  const headers: Record<string, string> = {
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey as string;
  }
  
  if (!proxyUrl || apiKey) {
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: model,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Errore nella chiamata API');
  }

  const data = await response.json();
  const textResponse = data.content?.[0]?.text || '';
  
  // Clean JSON response if Claude added markdown blocks
  let jsonStr = textResponse.trim();
  
  // Trova la prima { e l'ultima } per estrarre solo l'oggetto JSON
  const startIdx = jsonStr.indexOf('{');
  const endIdx = jsonStr.lastIndexOf('}');
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);
  } else {
    jsonStr = jsonStr.replace(/^```json/m, '').replace(/```$/m, '').trim();
  }
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse Claude JSON", jsonStr, textResponse);
    throw new Error('Claude non ha restituito un JSON valido. Vedi console per dettagli.');
  }
}

export async function getAvailableModelsFromAPI() {
  const explicitApiKey = getApiKey();
  const apiKey = explicitApiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
  const proxyUrl = import.meta.env.VITE_API_PROXY_URL;
  
  if (!apiKey && !proxyUrl) return [];

  const endpoint = proxyUrl ? `${proxyUrl}/v1/models` : 'https://api.anthropic.com/v1/models';
  const headers: Record<string, string> = {
    'anthropic-version': '2023-06-01',
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey as string;
  }
  
  if (!proxyUrl || apiKey) {
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  try {
    const response = await fetch(endpoint, { headers });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch (e) {
    console.error("Failed to fetch models", e);
    return [];
  }
}
