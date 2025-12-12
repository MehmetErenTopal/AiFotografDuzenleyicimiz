import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

export const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit check example
        setError("Dosya boyutu çok büyük. Lütfen 5MB'dan küçük bir resim seçin.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null); // Reset previous result
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // Extract base64 data and mime type
      const [mimeTypePrefix, base64Data] = selectedImage.split(';base64,');
      const mimeType = mimeTypePrefix.split(':')[1];

      const result = await editImageWithGemini(base64Data, mimeType, prompt);
      
      if (result) {
        setResultImage(result);
      } else {
        setError("Model bir resim döndürmedi. Lütfen farklı bir talimat deneyin.");
      }
    } catch (err: any) {
      setError(err.message || "Resim düzenlenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-4 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Sihirli Düzenleyici</h2>
        <p className="text-slate-400">Bir resim yükleyin ve nasıl değiştirmek istediğinizi tarif edin.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        
        {/* Left Column: Controls & Input */}
        <div className="flex flex-col gap-6">
          {/* Upload Area */}
          <div 
            onClick={triggerFileUpload}
            className={`
              relative flex flex-col items-center justify-center w-full h-64 lg:h-80 
              border-2 border-dashed rounded-2xl cursor-pointer transition-all
              ${selectedImage ? 'border-indigo-500/50 bg-slate-800/50' : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Orijinal" 
                className="absolute inset-0 w-full h-full object-contain p-4 rounded-2xl" 
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span className="font-medium">Resim yüklemek için tıklayın</span>
                <span className="text-xs mt-2 opacity-70">5MB'a kadar JPG, PNG, WebP</span>
              </div>
            )}
            
            {selectedImage && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                Orijinal
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Düzenleme Talimatları
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="örneğin, 'Retro filtresi ekle' veya 'Arkadaki kişiyi kaldır'"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
            />
            
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}

            <button
              onClick={handleEdit}
              disabled={!selectedImage || !prompt.trim() || loading}
              className={`
                mt-4 w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                ${!selectedImage || !prompt.trim() || loading 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:transform active:scale-[0.98]'}
              `}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  İşleniyor...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                  Düzenlemeyi Oluştur
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden h-96 lg:h-auto relative">
           <div className="absolute top-0 left-0 right-0 p-4 border-b border-slate-700 bg-slate-800/90 backdrop-blur z-10">
             <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Sonuç</h3>
           </div>
           
           <div className="flex-1 flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
             {loading ? (
               <div className="flex flex-col items-center gap-4">
                 <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin reverse"></div>
                 </div>
                 <p className="text-slate-400 animate-pulse">Sihir gerçekleşiyor...</p>
               </div>
             ) : resultImage ? (
               <div className="relative w-full h-full flex items-center justify-center group">
                 <img 
                   src={resultImage} 
                   alt="Düzenlenmiş sonuç" 
                   className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                 />
                 <a 
                   href={resultImage} 
                   download="duzenlenmis-resim.png"
                   className="absolute bottom-6 right-6 bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100"
                   title="Resmi İndir"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 </a>
               </div>
             ) : (
               <div className="text-center text-slate-500 p-8">
                 <p>Düzenlenen resim burada görünecek.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
