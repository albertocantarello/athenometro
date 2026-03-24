import { useState, useEffect } from 'react';
import { getApiKey, saveApiKey, getAiModel, saveAiModel } from '../utils/storage';
import { getAvailableModelsFromAPI } from '../utils/ai';
import { KeyRound, CheckCircle, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [apiKey, setKey] = useState('');
  const [aiModel, setModel] = useState('');
  const [saved, setSaved] = useState(false);
  const [dynamicModels, setDynamicModels] = useState<any[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    const storedKey = getApiKey();
    setKey(storedKey);
    setModel(getAiModel());
    
    if (storedKey) {
       loadModels();
    }
  }, []);

  const loadModels = async () => {
     setIsLoadingModels(true);
     const models = await getAvailableModelsFromAPI();
     if (models && models.length > 0) {
       // Filter out old legacy models to keep list clean, or just show all
       setDynamicModels(models.filter((m: any) => m.type === 'model' && m.id.includes('claude')));
     }
     setIsLoadingModels(false);
  };

  const handleSave = () => {
    saveApiKey(apiKey);
    saveAiModel(aiModel);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary">Impostazioni AI</h1>
        <p className="text-gray-800 font-medium">Configura Claude per la valutazione automatica.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4 p-4 bg-blue-50 text-blue-900 rounded-lg">
          <ShieldAlert className="flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <strong>Privacy & Sicurezza:</strong> La chiave API viene memorizzata esclusivamente nel tuo browser (`localStorage`). Non viene trasmessa a nessun database esterno, ma solo direttamente ai server di Anthropic in occasione di ogni valutazione AI.
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-900 flex items-center gap-2">
            <KeyRound size={18} />
            Anthropic API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono"
            placeholder="sk-ant-api03-..."
          />
          <p className="text-xs text-gray-700 font-medium mt-2">
            Puoi ottenere una chiave dalla <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-primary underline font-bold hover:text-blue-700">Console di Anthropic</a>.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-900 flex items-center gap-2">
              <Cpu size={18} />
              Modello Claude
            </label>
            <button 
              onClick={loadModels}
              disabled={isLoadingModels || !apiKey}
              className="text-xs flex items-center gap-1 text-primary hover:text-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={12} className={isLoadingModels ? "animate-spin" : ""} />
              Aggiorna Lista Da API
            </button>
          </div>
          <input
            type="text"
            list="claude-models"
            value={aiModel}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono"
            placeholder="Seleziona o scrivi il nome del modello..."
          />
          <datalist id="claude-models">
             {dynamicModels.length > 0 ? (
               dynamicModels.map(m => (
                 <option key={m.id} value={m.id}>
                   {m.display_name || m.id} ({new Date(m.created_at).toLocaleDateString()})
                 </option>
               ))
             ) : (
               <>
                 <option value="claude-sonnet-4-6" label="Claude Sonnet 4.6 (Richiesto)" />
                 <option value="claude-3-7-sonnet-20250219" label="Claude 3.7 Sonnet (Nuovo)" />
                 <option value="claude-3-5-sonnet-latest" label="Claude 3.5 Sonnet (Latest/Consigliato)" />
                 <option value="claude-3-5-sonnet-20241022" label="Claude 3.5 Sonnet (2024-10-22)" />
                 <option value="claude-3-5-haiku-latest" label="Claude 3.5 Haiku (Più economico)" />
                 <option value="claude-3-opus-latest" label="Claude 3 Opus (Top di gamma)" />
               </>
             )}
          </datalist>
          <p className="text-xs text-gray-700 font-medium mt-2">
            Se il tuo modello esatto (es. claude-sonnet-4-6) non è in lista, puoi scriverlo e forzarlo.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-[#12273f] transition-colors"
        >
          {saved ? <><CheckCircle size={18}/> Salvato con successo!</> : 'Salva Chiave API'}
        </button>
      </div>
    </div>
  );
}
