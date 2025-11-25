import React, { useState, useEffect } from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [isChecking, setIsChecking] = useState(true);

  const checkKey = async () => {
    try {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        onKeySelected();
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    try {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Optimistically assume success or re-check immediately
            await checkKey();
        }
    } catch (e) {
        console.error("Error selecting key:", e);
    }
  };

  if (isChecking) return null; // Or a loading spinner

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">Unlock Video Generation</h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            To generate custom Tai Chi videos with the Veo model, you need to select a paid API key from a Google Cloud Project.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg text-left mb-6 text-sm text-blue-800 border border-blue-100">
            <p className="font-semibold mb-1">Note:</p>
            <p>This uses the <strong>veo-3.1-fast-generate-preview</strong> model which requires billing enabled.</p>
            <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block hover:text-blue-800"
            >
                Read billing documentation
            </a>
          </div>

          <button
            onClick={handleSelectKey}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Select API Key
          </button>
        </div>
      </div>
    </div>
  );
};