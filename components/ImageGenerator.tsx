import React, { useState } from 'react';
import { generateImageWithGemini } from '../services/geminiService';
import { ImageSize } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateImageWithGemini(prompt, size);
      
      if (result) {
        setResultImage(result);
      } else {
        setError("The model did not return an image. Please try a different prompt.");
      }
    } catch (err: any) {
      if (err.toString().includes("Requested entity was not found") || err.message?.includes("API key")) {
         setError("API Key issue detected. Please try refreshing or reconnecting your key.");
         // In a more complex app, we might trigger the re-auth flow here.
      } else {
         setError(err.message || "Something went wrong while generating the image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-4 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Pro Generator</h2>
        <p className="text-slate-400">Create high-quality images from text using Gemini 3 Pro.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        
        {/* Left Column: Controls */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-full">
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Image Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate in detail..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-40"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quality / Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`
                      py-3 rounded-xl border font-medium transition-all
                      ${size === s 
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Higher resolutions like 4K may take slightly longer to generate.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mt-auto
                ${!prompt.trim() || loading 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:transform active:scale-[0.98]'}
              `}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Dreaming...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden h-96 lg:h-auto relative">
           <div className="absolute top-0 left-0 right-0 p-4 border-b border-slate-700 bg-slate-800/90 backdrop-blur z-10 flex justify-between items-center">
             <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Generated Result</h3>
             {resultImage && <span className="text-xs text-purple-400 font-mono border border-purple-500/30 px-2 py-0.5 rounded">{size}</span>}
           </div>
           
           <div className="flex-1 flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
             {loading ? (
               <div className="flex flex-col items-center gap-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
                    <div className="absolute inset-2 border-2 border-purple-400 rounded-full animate-spin"></div>
                  </div>
                 <p className="text-slate-400 animate-pulse">Generating pixels...</p>
               </div>
             ) : resultImage ? (
               <div className="relative w-full h-full flex items-center justify-center group">
                 <img 
                   src={resultImage} 
                   alt="Generated result" 
                   className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                 />
                 <a 
                   href={resultImage} 
                   download={`generated-${size.toLowerCase()}.png`}
                   className="absolute bottom-6 right-6 bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100"
                   title="Download Image"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 </a>
               </div>
             ) : (
               <div className="text-center text-slate-500 p-8">
                 <p>Your creation will appear here.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
