import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateContent = async (prompt: string, systemInstruction: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Please check your environment configuration.');
  }
  try {
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
