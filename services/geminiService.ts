import { GoogleGenAI, Type } from "@google/genai";
import { TaiChiRoutine } from "../types";

// Helper to get a fresh instance with the latest key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoutinePlan = async (
  focus: string,
  duration: string,
  level: string
): Promise<TaiChiRoutine> => {
  const ai = getAI();
  
  const prompt = `
    Create a structured Tai Chi workout routine for a ${level} level user.
    The focus is "${focus}" and the total duration should be around ${duration}.
    
    For each step, provide:
    1. A clear Name (e.g., "Parting the Wild Horse's Mane").
    2. Step-by-step physical instructions.
    3. Specific breathing instructions (e.g., "Inhale as you raise hands").
    4. Estimated duration for the step.
    5. A highly descriptive "visualPrompt" that describes the movement visually for a video generation AI. 
       Start the visualPrompt with "A Tai Chi master performing the move..." and include details about posture, arm position, and slow, fluid motion.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                name: { type: Type.STRING },
                instruction: { type: Type.STRING },
                breathing: { type: Type.STRING },
                duration: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
              },
              required: ["id", "name", "instruction", "breathing", "duration", "visualPrompt"],
            },
          },
        },
        required: ["title", "description", "steps"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as TaiChiRoutine;
  }
  throw new Error("Failed to generate routine plan");
};

export const generateStepVideo = async (visualPrompt: string): Promise<string> => {
  const ai = getAI();

  // Enforce strict prompt engineering for Veo
  const enhancedPrompt = `Cinematic, high quality, 4k resolution. ${visualPrompt}. The subject is wearing traditional loose Tai Chi clothing in a serene, minimalist bamboo garden. The movement is slow, graceful, and fluid. Soft natural lighting.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: enhancedPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9',
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(operation.error.message || "Video generation failed");
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!downloadLink) {
    throw new Error("No video URI returned");
  }

  // Fetch the video content using the API key to create a local blob
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    throw new Error("Failed to download generated video");
  }
  
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};