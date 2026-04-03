import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please check your environment configuration.');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const generateContent = async (prompt: string, systemInstruction: string) => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No response generated from AI.');
    }

    const candidate = response.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
      throw new Error('Content blocked by safety filters.');
    }

    if (candidate.finishReason === 'RECITATION') {
      throw new Error('Content blocked due to copyright recitation.');
    }

    if (!response.text) {
      throw new Error('AI returned an empty response.');
    }

    return response.text;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
