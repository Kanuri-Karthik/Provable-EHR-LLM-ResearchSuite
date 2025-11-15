import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useChatbot } from '../../contexts/ChatbotContext';
import type { ChatMessage } from '../../types';

const ChatWindow: React.FC = () => {
  const { toggleChat, messages, sendMessage, isLoading } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed bottom-6 right-6 z-[100] w-full max-w-sm h-[70vh] max-h-[600px] flex flex-col bg-bkg border border-content/20 rounded-xl shadow-2xl overflow-hidden"
    >
      <header className="flex items-center justify-between p-4 border-b border-content/10 bg-bkg/80 backdrop-blur-sm">
        <h3 className="font-bold text-lg">AI Assistant</h3>
        <button
          onClick={toggleChat}
          className="p-1 rounded-full text-content/70 hover:bg-content/10"
          aria-label="Close chat"
          title="Close chat"
        >
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((msg: ChatMessage) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-content/10 text-content rounded-bl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-[80%] p-3 rounded-2xl bg-content/10 text-content rounded-bl-none">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-content/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-content/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-content/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-content/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full pl-3 pr-12 py-2 bg-bkg border border-content/20 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-focus"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-sky-600 rounded-full text-white hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatWindow;