import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Call Gemini API with a prompt
 */
export async function callGemini(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.7
): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      text,
      success: true,
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      text: '',
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Call Gemini with conversation history (for iterative modifications)
 */
export async function callGeminiWithHistory(
  messages: GeminiMessage[],
  systemInstruction?: string,
  temperature: number = 0.7
): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature,
        maxOutputTokens: 8192,
      },
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts);
    const text = result.response.text();

    return {
      text,
      success: true,
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      text: '',
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}
