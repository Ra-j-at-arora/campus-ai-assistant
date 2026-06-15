import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { ChatMessage } from '@/stores/chatStore';

export const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';

  return (
    <div className={clsx("flex w-full mb-8", isUser ? "justify-end" : "justify-start")}>
      <div className={clsx("flex max-w-[85%] md:max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div className={clsx(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 border shadow-sm transition-colors",
          isUser 
            ? "bg-white dark:bg-slate-800 text-[#6B7280] dark:text-slate-400 border-[#E5E7EB] dark:border-slate-700 ml-3" 
            : "bg-indigo-50 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400 border-transparent mr-3"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>

        {/* Message Bubble */}
        <div className={clsx(
          "px-5 py-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none border transition-colors",
          isUser 
            ? "bg-[#4F46E5] text-white rounded-tr-sm border-transparent" 
            : "bg-[#FFFFFF] dark:bg-slate-800 border-[#E5E7EB] dark:border-slate-700 text-[#111827] dark:text-slate-50 rounded-tl-sm"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none leading-relaxed prose-p:text-[#111827] dark:prose-p:text-slate-50 prose-li:text-[#111827] dark:prose-li:text-slate-50 prose-strong:text-[#111827] dark:prose-strong:text-slate-50 prose-strong:font-bold">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          <div className={clsx(
            "text-[10px] mt-3 font-medium select-none",
            isUser ? "text-indigo-200 text-right" : "text-[#6B7280] dark:text-slate-400 text-left"
          )}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
      </div>
    </div>
  );
};
