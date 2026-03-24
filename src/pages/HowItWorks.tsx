import { BookOpen } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BookOpen />
          Come Funziona L'Athenometro
        </h1>
        <p className="text-gray-800 font-medium text-lg">Guida rapida al protocollo di valutazione dei temi.</p>
      </div>

      <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">Cos'è il Protocollo Athenometro?</h2>
        <p className="text-gray-700 leading-relaxed">
          Il sistema quantitativo in 5 metriche per decidere obiettivamente se registrare, modificare o scartare un'idea per il Podcast Athena. 
          Ogni tema viene valutato assegnando <strong className="text-primary">soltanto i punteggi 1, 3 o 5</strong> a ciascuna metrica.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">I 5 Pilastri (Metriche)</h2>
          <ul className="space-y-3 text-sm">
             <li><strong>TC (Temperatura Comunicativa):</strong> 1=Umano/Caldo, 3=Ibrido, 5=Freddo/Tecnico.</li>
             <li><strong>SC (Scomodità/Conflitto):</strong> 1=Safe, 3=Gestibile, 5=Nervi scoperti/Forte.</li>
             <li><strong>RI (Rischio Legale/Reputazionale):</strong> 1=Trascurabile, 3=Medio (serve protocollo), 5=Alto. *Questa metrica determina il colore finale.*</li>
             <li><strong>FR (Fruibilità):</strong> 1=Addetti ai lavori, 3=Media, 5=Comprensibile/Takeaway.</li>
             <li><strong>NR (Non-Replicabilità):</strong> 1=Tematica da Google, 3=Semi-nostro, 5=Pattern nostro esclusivo.</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4 border-t-4 border-t-primary">
          <h2 className="text-xl font-bold border-b pb-2">Regole Anti-Discussione</h2>
          <div className="space-y-2 text-sm text-gray-700">
             <p><strong>⏱️ Timer:</strong> 90 sec per assegnare i punteggi. Se scade, si passa al Tie-Break.</p>
             <p><strong>⚖️ Tie-break:</strong> In indecisione, RI va sul + alto, FR sul + basso, SC sul + basso e TC sul - cognitivo. NR sul + basso.</p>
             <p><strong>🚫 Parole Assolute:</strong> Se si usano "sempre, mai, tutti, ovvio" -&gt; Default in Zona Gialla.</p>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
        <h2 className="text-xl font-bold border-b pb-2">Le Zone Decisionali</h2>
        
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-decisionGreen flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-decisionGreen text-lg">ZONA VERDE (Si Fa)</h3>
            <p className="text-sm font-medium text-gray-800">Rischio=1. Nessuna precauzione speciale richiesta. Si registra.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-decisionYellow flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-decisionYellow text-lg">ZONA GIALLA (Si fa con guardrail)</h3>
            <p className="text-sm font-medium text-gray-800">Rischio=3. Si applica il <strong>Protocollo di Sicurezza</strong>: definizione chiara dei confini, scelta degli esempi ipotetici, parole da evitare, sintesi in 1 frase.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-decisionRed flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-decisionRed text-lg">ZONA ROSSA (Non si fa / Trasforma)</h3>
            <p className="text-sm font-medium text-gray-800">Rischio=5. L'angolo attuale è troppo pericoloso o facile ai fraintendimenti. Cambiare inquadramento radicamente (Angle Shift) oppure cestinare per salvaguardare il podcast.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
