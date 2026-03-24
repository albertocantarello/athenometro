import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ManualEvaluation from './pages/ManualEvaluation';
import Results from './pages/Results';
import History from './pages/History';
import HowItWorks from './pages/HowItWorks';
import Settings from './pages/Settings';
import { Home as HomeIcon, History as HistoryIcon, HelpCircle, Settings as SettingsIcon } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <nav className="fixed top-0 left-0 right-0 bg-primary text-white shadow-md z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <span>⚖️</span> Athenometro
          </Link>
          <div className="flex items-center gap-4 hidden sm:flex">
            <Link to="/" className="hover:text-blue-200 flex items-center gap-1"><HomeIcon size={18}/> Home</Link>
            <Link to="/cronologia" className="hover:text-blue-200 flex items-center gap-1"><HistoryIcon size={18}/> Cronologia</Link>
            <Link to="/come-funziona" className="hover:text-blue-200 flex items-center gap-1"><HelpCircle size={18}/> Regole</Link>
            <Link to="/impostazioni" className="hover:text-blue-200 flex items-center gap-1"><SettingsIcon size={18}/> Impostazioni</Link>
          </div>
          <div className="flex sm:hidden gap-3">
             <Link to="/"><HomeIcon size={20}/></Link>
             <Link to="/cronologia"><HistoryIcon size={20}/></Link>
             <Link to="/impostazioni"><SettingsIcon size={20}/></Link>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="bg-white py-4 text-center text-sm text-gray-500 border-t mt-auto">
        Athenometro - Podcast Athena
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/valuta" element={<ManualEvaluation />} />
          <Route path="/risultati" element={<Results />} />
          <Route path="/cronologia" element={<History />} />
          <Route path="/come-funziona" element={<HowItWorks />} />
          <Route path="/impostazioni" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
