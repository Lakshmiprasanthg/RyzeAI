import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error('GROQ_API_KEY environment variable is not set');
}

const groq = new Groq({ apiKey });

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  parts: string;
}

export interface GroqResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Call Groq API with a prompt
 */
export async function callGroq(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.7
): Promise<GroqResponse> {
  try {
    const messages: any[] = [];
    
    if (systemInstruction) {
      messages.push({
        role: 'system',
        content: systemInstruction,
      });
    }
    
    messages.push({
      role: 'user',
      content: prompt,
    });

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages,
      temperature,
      max_tokens: 8192,
    });

    const text = completion.choices[0]?.message?.content || '';

    return {
      text,
      success: true,
    };
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return {
      text: '',
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Call Groq with conversation history (for iterative modifications)
 */
export async function callGroqWithHistory(
  messages: GroqMessage[],
  systemInstruction?: string,
  temperature: number = 0.7
): Promise<GroqResponse> {
  try {
    const groqMessages: any[] = [];
    
    if (systemInstruction) {
      groqMessages.push({
        role: 'system',
        content: systemInstruction,
      });
    }
    
    // Add messages to Groq format
    messages.forEach(msg => {
      groqMessages.push({
        role: msg.role,
        content: msg.parts,
      });
    });

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: groqMessages,
      temperature,
      max_tokens: 8192,
    });

    const text = completion.choices[0]?.message?.content || '';

    return {
      text,
      success: true,
    };
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return {
      text: '',
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}
