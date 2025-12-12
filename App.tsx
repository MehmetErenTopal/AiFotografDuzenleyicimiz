import React, { useState } from 'react';
import { ApiKeySelector } from './components/ApiKeySelector';
import { ImageEditor } from './components/ImageEditor';

function App() {
  const [hasApiKey, setHasApiKey] = useState(false);

  if (!hasApiKey) {
    return <ApiKeySelector onKeySelected={() => setHasApiKey(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      {/* Header / Nav */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AI Fotoğraf Stüdyosu
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4">
        <ImageEditor />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>Gemini 2.5 Flash tarafından desteklenmektedir</p>
      </footer>
    </div>
  );
}

export default App;
