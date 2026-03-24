import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { getZoneColorClass, getSpMessage } from '../utils/calculator';
import { saveEvaluation } from '../utils/storage';
import type { EvaluationData } from '../types';
import { Download, Save, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const evaluationData = location.state?.evaluationData as EvaluationData;
  const isEditingAi = location.state?.isEditingAi || false;

  const [isSaved, setIsSaved] = useState(false);

  if (!evaluationData) {
    return <Navigate to="/" replace />;
  }

  const { titolo, oneLiner, pubblico, angolo, scores, zona, sp, aiMotivations, protocolloSicurezza, suggerimentoAngoloAlternativo } = evaluationData;

  const zoneConfig = {
    Verde: { text: 'Si fa', msg: 'Nessuna precauzione speciale richiesta.' },
    Gialla: { text: 'Si fa con protocollo', msg: 'Applicare il Protocollo di sicurezza prima della produzione.' },
    Rossa: { text: 'Non si fa così', msg: 'Cambiare angolo oppure scartare.' }
  };

  const handleSave = () => {
    saveEvaluation(evaluationData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = () => {
    // Esporta scheda in testo copiato per ora
    const textToCopy = `
Tema: ${titolo}
One-liner: ${oneLiner}

--- VALUTAZIONE ---
ZONA: ${zona.toUpperCase()} (${zoneConfig[zona].text})
Score Priorità (SP): ${sp} - ${getSpMessage(sp)}

- TC (Comunicativa): ${scores.tc}
- SC (Scomodità): ${scores.sc}
- RI (Rischio): ${scores.ri}
- FR (Fruibilità): ${scores.fr}
- NR (Non-replicabilità): ${scores.nr}

${zona === 'Gialla' && protocolloSicurezza ? `
--- PROTOCOLLO DI SICUREZZA ---
Confini: ${protocolloSicurezza.confini}
Esempi: ${protocolloSicurezza.esempi}
Lessico: ${protocolloSicurezza.lessico}
Takeaway: ${protocolloSicurezza.takeaway}
Contesto: ${protocolloSicurezza.fraseContesto}
` : ''}
${zona === 'Rossa' && suggerimentoAngoloAlternativo ? `\n--- SUGGERIMENTO AI ---\n${suggerimentoAngoloAlternativo}` : ''}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    alert('Scheda copiata negli appunti!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{titolo}</h1>
          <p className="text-gray-900 font-medium mt-2">{oneLiner}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-800">
          {pubblico && <p><strong className="text-gray-900">Pubblico:</strong> {pubblico}</p>}
          {angolo && <p><strong className="text-gray-900">Angolo:</strong> {angolo}</p>}
        </div>
      </div>

      <div className={`rounded-xl p-6 text-center shadow-lg ${getZoneColorClass(zona)}`}>
        <h2 className="text-3xl font-black uppercase mb-2">{zoneConfig[zona].text}</h2>
        <p className="font-medium opacity-90">{zoneConfig[zona].msg}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 flex flex-col justify-center items-center text-center">
          <p className="text-gray-800 font-bold mb-1">Score di Priorità (SP)</p>
          <p className="text-4xl font-black text-primary mb-2">{sp}</p>
          <p className="text-sm font-bold text-gray-900 px-3 py-1 bg-gray-200 rounded-full">
            {getSpMessage(sp)}
          </p>
          <p className="text-xs text-gray-600 mt-4 font-mono font-bold">
            {scores.fr} (FR) + {scores.nr} (NR) + {scores.sc} (SC) - {scores.ri} (RI)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 space-y-2">
           <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Dettaglio Metriche</h3>
           {Object.entries(scores).map(([key, val]) => (
             <div key={key} className="flex justify-between items-center text-sm">
               <span className="font-bold text-gray-700 uppercase">{key}</span>
               <span className="font-black bg-gray-200 text-gray-900 px-3 py-1 rounded w-8 text-center">{val}</span>
             </div>
           ))}
           {aiMotivations && (
             <div className="text-xs text-gray-600 italic font-medium pt-2 border-t border-gray-200 mt-3">
               Valutazione generata da AI
             </div>
           )}
        </div>
      </div>

      {zona === 'Gialla' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-yellow-900 flex items-center gap-2">
            ⚠️ Protocollo di Sicurezza Richiesto
          </h3>
          <div className="space-y-3">
             <div>
               <label className="text-xs font-bold text-yellow-800 uppercase">Confini espliciti</label>
               <div className="text-sm bg-white p-2 rounded border border-yellow-100 mt-1 min-h-[40px]">
                 {protocolloSicurezza?.confini || (isEditingAi ? 'Compilalo a mano nel form se l\'AI fallisce...' : 'Da compilare nella produzione')}
               </div>
             </div>
             {/* Esempi, Lessico ecc. (mocked se manuale) */}
             <div>
               <label className="text-xs font-bold text-yellow-800 uppercase">Lessico consigliato</label>
               <div className="text-sm bg-white p-2 rounded border border-yellow-100 mt-1 min-h-[40px]">
                 {protocolloSicurezza?.lessico || ''}
               </div>
             </div>
          </div>
        </div>
      )}

      {zona === 'Rossa' && suggerimentoAngoloAlternativo && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-red-900 flex items-center gap-2">
            🛑 Angolo Alternativo Suggerito (AI)
          </h3>
          <p className="text-sm text-red-800 bg-white p-3 rounded">{suggerimentoAngoloAlternativo}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-[#12273f] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaved ? 'Salvato!' : 'Salva in Cronologia'}
        </button>
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-primary text-primary font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Download size={18} />
          Esporta Testo
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 py-3 px-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-medium rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Nuovo Tema
        </button>
      </div>
    </div>
  );
}
