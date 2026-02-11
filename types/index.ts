export interface Version {
  id: string;
  timestamp: number;
  userIntent: string;
  code: string;
  explanation?: any;
  isModification: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GenerationResponse {
  success: boolean;
  version?: {
    id: string;
    code: string;
    explanation?: any;
    plan?: any;
  };
  warnings?: string[];
  error?: string;
  details?: string[];
}
