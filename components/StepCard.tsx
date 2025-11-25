import React, { useState, useRef } from 'react';
import { TaiChiStep } from '../types';
import { generateStepVideo } from '../services/geminiService';

interface StepCardProps {
  step: TaiChiStep;
  index: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  
  // We can keep track if the video is playing to toggle UI controls if needed
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleGenerateVideo = async () => {
    if (isGeneratingVideo || videoUrl) return;

    setIsGeneratingVideo(true);
    setError(null);

    try {
      const url = await generateStepVideo(step.visualPrompt);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
      setError("The master could not demonstrate this move at the moment. Please try again.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleShare = async () => {
    const shareText = `ZenFlow Tai Chi - Step ${index + 1}: ${step.name}\n\n${step.instruction}\n\nBreathing: ${step.breathing}`;
    const shareData = {
      title: `ZenFlow: ${step.name}`,
      text: shareText,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 mb-8 last:mb-0 transition-shadow hover:shadow-md">
      <div className="md:flex">
        {/* Content Section */}
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-500 font-serif font-bold flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-800 leading-tight">
                {step.name}
              </h3>
            </div>
            
            <div className="relative">
              <button 
                onClick={handleShare}
                className="text-stone-400 hover:text-emerald-600 p-2 rounded-full hover:bg-stone-50 transition-all"
                aria-label="Share step"
                title="Share this step"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </button>
              {showCopied && (
                 <div className="absolute right-0 top-full mt-1 bg-stone-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 animate-fade-in">
                   Copied!
                 </div>
              )}
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Instruction</h4>
              <p className="text-stone-600 leading-relaxed">{step.instruction}</p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Breathing</h4>
              <p className="text-emerald-700 bg-emerald-50/50 p-3 rounded-lg text-sm italic border-l-2 border-emerald-300">
                "{step.breathing}"
              </p>
            </div>

             <div className="flex items-center gap-2 text-stone-400 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {step.duration}
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="md:w-1/2 bg-stone-900 relative min-h-[300px] md:min-h-auto flex items-center justify-center group">
          {videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <a 
                href={videoUrl}
                download={`zenflow-step-${index+1}.mp4`}
                className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Download Video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5M8.25 12.75L12 16.5l3.75-3.75" />
                </svg>
              </a>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {/* Background Placeholder Pattern/Image */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              {isGeneratingVideo ? (
                <div className="relative z-10">
                   <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4 mx-auto"></div>
                   <p className="text-stone-300 text-sm animate-pulse-slow">Visualizing movement...</p>
                   <p className="text-stone-500 text-xs mt-2">This may take 1-2 minutes</p>
                </div>
              ) : (
                <div className="relative z-10">
                  {error ? (
                    <div className="text-red-400 mb-4 text-sm">{error}</div>
                  ) : null}
                   <button 
                    onClick={handleGenerateVideo}
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 group-hover:scale-105"
                   >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate AI Demo
                   </button>
                   <p className="text-stone-500 text-xs mt-4 max-w-xs mx-auto">
                     Uses Veo model to create a unique visualization of this step.
                   </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};