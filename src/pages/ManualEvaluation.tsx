import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { runCalculator } from '../utils/calculator';
import { emptyScores } from '../types';
import type { Scores, ScoreValue } from '../types';

const METRICS = [
  {
    id: 'tc',
    title: 'TC — Temperatura Comunicativa',
    desc: 'Quanto è tecnico/freddo il tema. Serve a scegliere come raccontarlo.',
    options: [
      { val: 1, label: 'Caldo / Umano (storytelling)' },
      { val: 3, label: 'Ibrido (tecnico + esempi)' },
      { val: 5, label: 'Freddo / Tecnico (norme)' }
    ]
  },
  {
    id: 'sc',
    title: 'SC — Scomodità / Conflitto',
    desc: 'Quanta tensione identitaria porta il tema.',
    options: [
      { val: 1, label: 'Safe (informativo)' },
      { val: 3, label: 'Scomodo gestibile' },
      { val: 5, label: 'Scomodo forte (nervi scoperti)' }
    ]
  },
  {
    id: 'ri',
    title: 'RI — Rischio',
    desc: 'Rischio legale, reputazionale e di fraintendimento.',
    options: [
      { val: 1, label: 'Basso (trascurabile)' },
      { val: 3, label: 'Medio (serve cornice)' },
      { val: 5, label: 'Alto (controversia facile)' }
    ]
  },
  {
    id: 'fr',
    title: 'FR — Fruibilità',
    desc: 'Quanto il tema è comprensibile e utile per chi ascolta.',
    options: [
      { val: 1, label: 'Bassa (addetti ai lavori)' },
      { val: 3, label: 'Media (utile ma impegna)' },
      { val: 5, label: 'Alta (concreto, takeaway)' }
    ]
  },
  {
    id: 'nr',
    title: 'NR — Non-replicabilità',
    desc: 'Quanto il tema è distintivo e "nostro".',
    options: [
      { val: 1, label: 'Copiabile (Google)' },
      { val: 3, label: 'Semi-nostro (taglio/esempi)' },
      { val: 5, label: 'Nostro forte (pattern reali)' }
    ]
  }
];

export default function ManualEvaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  
  const [scores, setScores] = useState<Scores>({ ...emptyScores });

  if (!formData) {
    return <Navigate to="/" replace />;
  }

  const handleScoreChange = (metric: keyof Scores, val: ScoreValue) => {
    setScores((prev) => ({ ...prev, [metric]: val }));
  };

  const handleCalculate = () => {
    const { zona, sp } = runCalculator(scores);
    
    // Preparo i dati per il salvataggio / risultati
    const evaluationData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...formData,
      scores,
      zona,
      sp
    };

    navigate('/risultati', { state: { evaluationData } });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary">Valutazione Manuale</h1>
        <p className="text-gray-900 font-bold">{formData.titolo}</p>
      </div>

      <div className="space-y-6">
        {METRICS.map((metric) => (
          <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-300 p-5">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{metric.title}</h3>
            <p className="text-sm text-gray-700 mb-4">{metric.desc}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {metric.options.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleScoreChange(metric.id as keyof Scores, opt.val as ScoreValue)}
                  className={`border-2 rounded-lg p-3 text-left transition-all flex flex-col items-start gap-1 
                    ${scores[metric.id as keyof Scores] === opt.val 
                      ? 'border-primary bg-blue-50/50 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-400 bg-gray-50/50'}`}
                >
                  <span className={`text-xl font-black ${scores[metric.id as keyof Scores] === opt.val ? 'text-primary' : 'text-gray-700'}`}>
                    {opt.val}
                  </span>
                  <span className={`text-sm tracking-tight ${scores[metric.id as keyof Scores] === opt.val ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 pt-4 pb-4">
        <button
          onClick={handleCalculate}
          className="w-full shadow-lg py-4 px-6 bg-primary text-white text-lg font-bold rounded-xl hover:bg-[#12273f] transition-colors"
        >
          Calcola Risultati
        </button>
      </div>
    </div>
  );
}
