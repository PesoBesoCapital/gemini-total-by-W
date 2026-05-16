
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using a helper to ensure it's always fresh
const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  // Named parameter initialization as per guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSalesCoaching = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Use gemini-3-flash-preview for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        systemInstruction: `You are an expert TOTAL WIRELESS by Verizon sales coach. Provide concise, actionable advice for TOTAL WIRELESS sales representatives. 
        Focus on product knowledge, sales techniques, and customer service. Use markdown for formatting, like lists or bold text, to make the information easy to digest.`,
      },
    });
    // .text is a property getter, not a method
    return response.text || "No coaching advice available at the moment.";
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while getting coaching advice: ${error.message}. Please check your API key and network connection.`;
    }
    return "An unknown error occurred while getting coaching advice.";
  }
};

export const getRolePlayFeedback = async (prompt: string, systemInstruction: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Use gemini-3-flash-preview for training simulations
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
      },
    });
    // Use .text property to extract content
    return response.text || "No feedback generated for this session.";
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred during the role-play session: ${error.message}. Please check your API key and network connection.`;
    }
    return "An unknown error occurred during the role-play session.";
  }
};
