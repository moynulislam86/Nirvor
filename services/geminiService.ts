import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIResponse {
  text: string;
  groundingMetadata?: any;
}

export type AIMode = 'chat' | 'think' | 'search' | 'maps' | 'fast';

export const generateAIResponse = async (
    prompt: string, 
    language: Language, 
    options: { mode: AIMode, location?: { lat: number, lng: number } }
): Promise<AIResponse> => {
  // 1. Network Check
  if (!navigator.onLine) {
      throw new Error(language === 'bn' ? "ইন্টারনেট সংযোগ নেই। দয়া করে ইন্টারনেট চেক করুন।" : "No internet connection. Please check your network.");
  }

  try {
    const langInstruction = language === 'bn' 
      ? "Reply in Bengali (Bangla) unless requested otherwise." 
      : "Reply in English.";

    let model = 'gemini-3-pro-preview';
    let tools: any[] = [];
    let toolConfig: any = undefined;
    let config: any = {};

    const baseInstruction = `You are 'Nirvor AI', a helpful assistant for a Bangladeshi app named Nirvor. 
        Your goal is to help users with emergency, health, legal, and government service queries in Bangladesh.
        ${langInstruction}
        Keep answers concise, easy to understand for rural people, and empathetic.
        If the query is a life-threatening emergency, strictly advise them to call 999 immediately.`;

    switch (options.mode) {
        case 'think':
            model = 'gemini-3-pro-preview';
            config = {
                thinkingConfig: { thinkingBudget: 32768 }
            };
            break;
        case 'search':
            model = 'gemini-3-flash-preview';
            tools = [{ googleSearch: {} }];
            break;
        case 'maps':
            model = 'gemini-2.5-flash';
            tools = [{ googleMaps: {} }];
            if (options.location) {
                toolConfig = {
                    retrievalConfig: {
                        latLng: {
                            latitude: options.location.lat,
                            longitude: options.location.lng
                        }
                    }
                };
            }
            break;
        case 'fast':
            model = 'gemini-2.5-flash-lite';
            break;
        case 'chat':
        default:
            model = 'gemini-3-pro-preview';
            break;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: tools.length > 0 ? tools : undefined,
        toolConfig: toolConfig,
        systemInstruction: baseInstruction,
        ...config
      },
    });

    if (!response.text) {
        throw new Error("Empty response from AI");
    }

    return {
        text: response.text,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // 2. Specific API Error Handling
    if (error.message.includes("API key")) {
        throw new Error(language === 'bn' ? "সিস্টেম কনফিগারেশন এরর (API Key)।" : "System configuration error (API Key).");
    }
    
    // Pass through the offline error if it came from above
    if (error.message.includes("internet") || error.message.includes("ইন্টারনেট")) {
        throw error;
    }

    throw new Error(language === 'bn' ? "AI সেবা বর্তমানে অনুপলব্ধ। কিছুক্ষণ পর চেষ্টা করুন।" : "AI service unavailable. Try again later.");
  }
};

export const generateSpeech = async (text: string, language: Language): Promise<string> => {
    if (!navigator.onLine) {
        throw new Error(language === 'bn' ? "ইন্টারনেট সংযোগ নেই।" : "No internet connection.");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("Failed to generate speech");
        }
        return base64Audio;
    } catch (error: any) {
        console.error("TTS Error:", error);
        throw new Error(language === 'bn' ? "অডিও জেনারেট করা যায়নি।" : "Could not generate audio.");
    }
};