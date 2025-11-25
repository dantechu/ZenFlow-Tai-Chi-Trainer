export interface TaiChiStep {
  id: number;
  name: string;
  instruction: string;
  breathing: string;
  duration: string;
  visualPrompt: string; // Optimized prompt for the video generator
}

export interface TaiChiRoutine {
  title: string;
  description: string;
  steps: TaiChiStep[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  GENERATING_PLAN = 'GENERATING_PLAN',
  GENERATING_VIDEO = 'GENERATING_VIDEO',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

// Augment window for AI Studio specific methods
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}