import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages, 
      { ...msg, id: Math.random().toString(36).substring(7), timestamp: new Date() }
    ]
  })),

  setMessages: (messages) => set({ messages }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  clearChat: () => set({ messages: [] }),
}));
