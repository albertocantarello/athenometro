import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Play } from 'lucide-react';
import { evaluateWithClaude } from '../utils/ai';

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titolo: '',
    oneLiner: '',
    pubblico: '',
    angolo: ''
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titolo || !formData.oneLiner) return;
    navigate('/valuta', { state: { formData } });
  };

  const handleSubmitAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titolo || !formData.oneLiner) return;
    
    

    setIsAiLoading(true);
    setAiError(null);

    try {
      const evaluation = await evaluateWithClaude(formData);
      
      const evaluationData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...formData,
        scores: {
          tc: evaluation.tc.punteggio,
          sc: evaluation.sc.punteggio,
          ri: evaluation.ri.punteggio,
          fr: evaluation.fr.punteggio,
          nr: evaluation.nr.punteggio,
        },
        zona: evaluation.zona,
        sp: evaluation.sp,
        aiMotivations: {
          tc: evaluation.tc.motivazione,
          sc: evaluation.sc.motivazione,
          ri: evaluation.ri.motivazione,
          fr: evaluation.fr.motivazione,
          nr: evaluation.nr.motivazione,
        },
        protocolloSicurezza: evaluation.protocollo_sicurezza,
        suggerimentoAngoloAlternativo: evaluation.suggerimento_angolo_alternativo,
      };

      navigate('/risultati', { state: { evaluationData, isEditingAi: true } });
    } catch (err: any) {
      setAiError(err.message || 'Errore durante la chiamata API');
      setIsAiLoading(false);
    }
  };

  const isFormValid = formData.titolo.trim() !== '' && formData.oneLiner.trim() !== '';

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Nuovo Tema</h1>
        <p className="text-gray-800 font-medium">Inserisci i dettagli dell'idea per iniziare la valutazione.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Titolo Tema <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Es. Il nuovo concordato preventivo"
              value={formData.titolo}
              onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              One-liner <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 bg-gray-50"
              placeholder="Di cosa parla davvero, in 1-2 frasi..."
              value={formData.oneLiner}
              onChange={(e) => setFormData({ ...formData, oneLiner: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Pubblico primario
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 bg-gray-50"
              placeholder="Es. Srl, liberi professionisti..."
              value={formData.pubblico}
              onChange={(e) => setFormData({ ...formData, pubblico: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Angolo
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 bg-gray-50"
              placeholder="Es. Esperienza tipo / Mito da smontare"
              value={formData.angolo}
              onChange={(e) => setFormData({ ...formData, angolo: e.target.value })}
            />
          </div>
        </div>

        {aiError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {aiError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <button
            onClick={handleSubmitManual}
            disabled={!isFormValid || isAiLoading}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={20} />
            Valuta Manualmente
          </button>
          
          <button
            onClick={handleSubmitAi}
            disabled={!isFormValid || isAiLoading}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white hover:bg-[#12273f] font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAiLoading ? (
              <span className="animate-pulse">Valutazione in corso...</span>
            ) : (
              <>
                <Bot size={20} />
                Valuta con AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
