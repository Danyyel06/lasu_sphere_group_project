
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { BOT_CONFIGS } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBotResponse = async (
  botKey: keyof typeof BOT_CONFIGS, 
  message: string, 
  history: { role: string; parts: { text: string }[] }[] = [],
  attachments: Part[] = []
) => {
  const config = BOT_CONFIGS[botKey];
  
  // Use Pro model for counseling tasks as per guidelines (Complex Text Tasks)
  const modelName = (botKey === 'academic' || botKey === 'career') 
    ? 'gemini-3-pro-preview' 
    : 'gemini-3-flash-preview';

  try {
    const userParts: Part[] = [{ text: message }];
    if (attachments.length > 0) {
      userParts.push(...attachments);
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...history,
        { role: 'user', parts: userParts }
      ],
      config: {
        systemInstruction: config.instruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("AI Response Error:", error);
    return "An error occurred while communicating with the AI. Please check your connectivity.";
  }
};
