import React, { useState } from 'react';
import { LoadingState } from '../types';

interface RoutineFormProps {
  onGenerate: (focus: string, duration: string, level: string) => void;
  loadingState: LoadingState;
}

export const RoutineForm: React.FC<RoutineFormProps> = ({ onGenerate, loadingState }) => {
  const [focus, setFocus] = useState('Relaxation and Stress Relief');
  const [duration, setDuration] = useState('10 minutes');
  const [level, setLevel] = useState('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(focus, duration, level);
  };

  const isGenerating = loadingState === LoadingState.GENERATING_PLAN;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="bg-stone-50 px-6 py-4 border-b border-stone-100">
        <h2 className="text-lg font-serif font-semibold text-stone-800">Create Your Practice</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-2">Focus</label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option>Relaxation and Stress Relief</option>
              <option>Balance and Stability</option>
              <option>Energy and Vitality (Qi)</option>
              <option>Flexibility and Flow</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-2">Experience Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-stone-500 mb-2">Duration</label>
             <div className="flex items-center gap-4">
               {['5 minutes', '10 minutes', '20 minutes'].map((d) => (
                 <label key={d} className={`flex-1 cursor-pointer border rounded-lg px-4 py-3 text-center text-sm transition-all ${duration === d ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' : 'border-stone-200 hover:border-stone-300'}`}>
                   <input 
                     type="radio" 
                     name="duration" 
                     value={d} 
                     checked={duration === d} 
                     onChange={(e) => setDuration(e.target.value)} 
                     className="hidden"
                   />
                   {d}
                 </label>
               ))}
             </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-semibold text-white shadow-md transition-all transform active:scale-[0.99]
            ${isGenerating 
              ? 'bg-stone-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Consulting the Master...
            </span>
          ) : (
            'Generate Routine'
          )}
        </button>
      </form>
    </div>
  );
};