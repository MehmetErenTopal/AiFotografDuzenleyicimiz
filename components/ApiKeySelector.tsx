import React, { useEffect, useState } from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [checking, setChecking] = useState(true);

  const checkKey = async () => {
    try {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
          onKeySelected();
        }
      } else {
        // Ortam aistudio API'sini desteklemiyorsa, anahtarın global olarak ayarlandığını varsayıyoruz.
        onKeySelected(); 
      }
    } catch (e) {
      console.error("API anahtarı kontrol hatası", e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Seçimden sonra, yarış durumunu önlemek için doğrudan devam et
        onKeySelected();
      } catch (e) {
        console.error("Anahtar seçilemedi", e);
      }
    }
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <p className="animate-pulse">Erişim doğrulanıyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6 text-center">
      <div className="max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <div className="mb-6 bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Google Cloud'a Bağlan</h1>
        <p className="text-slate-400 mb-8">
          AI Fotoğraf Stüdyosu özelliklerini kullanmak için faturalandırması etkinleştirilmiş bir Google Cloud projesine bağlanmanız gerekir.
        </p>
        
        <button
          onClick={handleConnect}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
        >
          API Anahtarı Seç
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
        </button>
        
        <div className="mt-6 text-xs text-slate-500">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">
            Faturalandırma hakkında daha fazla bilgi
          </a>
        </div>
      </div>
    </div>
  );
};
