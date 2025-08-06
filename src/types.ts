// types.ts
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  model: string;
}

export interface ChatResponse {
  message: Message;
  quota: number;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  maxQuota: number;
}

