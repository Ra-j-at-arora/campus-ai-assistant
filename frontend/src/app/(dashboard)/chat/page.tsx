"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/services/apiClient';
import { ChatBubble } from '@/components/chat/ChatBubble';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, isLoading, addMessage, setMessages, setLoading } = useChatStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setInput('');
    addMessage({ role: 'user', content: text });
    setLoading(true);

    try {
      const response = await apiClient.post('/chat', {
        message: text,
        userId: user?.id || 'guest',
      });
      
      const aiContent = response.data.data.response;
      addMessage({ role: 'model', content: aiContent });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ 
        role: 'model', 
        content: 'Sorry, I am having trouble connecting to the campus network right now.' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) {
        window.history.replaceState({}, '', '/chat');
        sendMessage(q);
      } else if (messages.length === 0 && user?.id) {
        // Fetch history if empty and no query param to auto-send
        apiClient.get(`/chat/history?userId=${user.id}`).then((res) => {
          const loadedMessages = res.data.data.map((m: any) => ({
            id: m._id || Math.random().toString(36),
            role: m.role === 'assistant' ? 'model' : m.role,
            content: m.content,
            timestamp: new Date(m.timestamp || Date.now())
          }));
          setMessages(loadedMessages);
        }).catch(console.error);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-t-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none z-10 shrink-0 transition-colors duration-200">
        <h2 className="text-lg font-semibold text-[#111827] dark:text-slate-50 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400 flex items-center justify-center mr-3">
            <Sparkles className="w-4 h-4" />
          </div>
          Campus Assistant
        </h2>
        <p className="text-sm text-[#6B7280] dark:text-slate-400 mt-1 ml-11">
          Ask me about events, cafeteria menus, or library books.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] dark:bg-slate-900 border-x border-[#E5E7EB] dark:border-slate-700 transition-colors duration-200">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-[#4F46E5] dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium text-[#111827] dark:text-slate-50">Start a conversation</h3>
            <p className="mt-2 text-sm text-[#6B7280] dark:text-slate-400 max-w-sm">
              I can help you search the library, check today's menu, or find out when the next hackathon is happening.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center text-[#6B7280] dark:text-slate-400 space-x-3 p-4 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-2xl w-fit shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#4F46E5] dark:text-indigo-400" />
                <span className="text-sm font-medium">Assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-b-xl p-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none z-10 shrink-0 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="flex space-x-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about campus..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 px-6 py-3.5 text-sm focus:border-[#4F46E5] dark:focus:border-indigo-500 focus:bg-[#FFFFFF] dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] dark:focus:ring-indigo-500 text-[#111827] dark:text-slate-50 disabled:opacity-50 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-[#4F46E5] text-white hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
