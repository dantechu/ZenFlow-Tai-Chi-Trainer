import React, { useState } from 'react';
import { ApiKeySelector } from './components/ApiKeySelector';
import { RoutineForm } from './components/RoutineForm';
import { StepCard } from './components/StepCard';
import { TaiChiRoutine, LoadingState } from './types';
import { generateRoutinePlan } from './services/geminiService';

const App: React.FC = () => {
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [routine, setRoutine] = useState<TaiChiRoutine | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoutine = async (focus: string, duration: string, level: string) => {
    setLoadingState(LoadingState.GENERATING_PLAN);
    setError(null);
    setRoutine(null);

    try {
      const newRoutine = await generateRoutinePlan(focus, duration, level);
      setRoutine(newRoutine);
      setLoadingState(LoadingState.SUCCESS);
    } catch (e) {
      console.error(e);
      setError("Failed to generate routine. Please try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">Z</div>
             <h1 className="text-xl font-serif font-bold text-stone-800 tracking-tight">ZenFlow</h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-stone-100 rounded-full text-stone-500">
            Powered by Gemini Veo
          </div>
        </div>
      </header>

      {/* Key Selector Overlay */}
      {!apiKeySelected && (
        <ApiKeySelector onKeySelected={() => setApiKeySelected(true)} />
      )}

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Intro / Form */}
          <div className="mb-12 text-center">
            {!routine && (
              <>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
                  Master the Art of Flow
                </h2>
                <p className="text-stone-600 max-w-2xl mx-auto mb-8">
                  Create a personalized Tai Chi practice tailored to your needs. Our AI Master will design a routine and demonstrate movements with video.
                </p>
              </>
            )}
            
            <div className={`${routine ? 'hidden md:block' : ''} transition-all`}>
                {/* If routine exists, we hide the form on mobile to save space, or maybe show a "New Routine" button. 
                    For simplicity, we keep it visible but maybe collapsible in a real app. 
                    Here we just show it.
                */}
                 {!routine && <RoutineForm onGenerate={handleGenerateRoutine} loadingState={loadingState} />}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100 text-center">
              {error}
            </div>
          )}

          {/* Routine Display */}
          {routine && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-800">{routine.title}</h2>
                    <p className="text-stone-600 mt-1">{routine.description}</p>
                </div>
                <button 
                  onClick={() => setRoutine(null)}
                  className="text-sm text-stone-500 hover:text-emerald-600 font-medium underline decoration-stone-300 hover:decoration-emerald-600 underline-offset-4 transition-all"
                >
                  Create New Routine
                </button>
              </div>

              <div className="space-y-6">
                {routine.steps.map((step, idx) => (
                  <StepCard key={step.id || idx} step={step} index={idx} />
                ))}
              </div>

               <div className="text-center p-8 text-stone-400 text-sm italic">
                "The journey of a thousand miles begins with a single step."
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-stone-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ZenFlow. Generated with Google Gemini Veo.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;