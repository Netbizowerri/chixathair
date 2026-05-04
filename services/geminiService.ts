
import { GoogleGenAI } from "@google/genai";

// Safe access to API Key to prevent bundle crashes
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Gets hair advice from the Gemini AI model.
 * @param userInput The prompt/question from the user.
 * @returns The AI-generated advice text or a fallback message on error.
 */
export const getHairAdvice = async (userInput: string) => {
  if (!ai) {
    return "The House Stylist is currently unavailable. Please try again later, Queen!";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: "You are the head virtual stylist for 'Chixat Hair by Edna'. You represent a world-class luxury brand. Edna is the creative director known for her perfectionist approach to hair. Provide expert, elite advice on raw virgin extensions, wig maintenance, and styling. Your tone should be sophisticated, encouraging, and brief. Use terms like 'your crown', 'bespoke pieces', and 'the elite'.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently adjusting my mirror to better assist you. Please try again shortly, Queen!";
  }
};
