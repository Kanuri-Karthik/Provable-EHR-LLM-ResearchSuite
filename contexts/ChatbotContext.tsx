

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';
import { GEMINI_API_KEY } from '../config';

interface ChatbotContextType {
  isOpen: boolean;
  toggleChat: () => void;
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', sender: 'ai', text: "Hello! I am an AI assistant. How can I help you with the research modules today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    try {
        // Initialize the AI client here to prevent startup crashes if the API key is missing.
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful AI assistant for the Provable-EHR-LLM Research Suite. Your goal is to explain the complex research topics and AI features to users in an understandable way. Be concise and helpful.",
            },
        });
        setChat(chatInstance);
    } catch (error) {
        console.error("Failed to initialize chatbot AI:", error);
        setMessages(prev => [...prev, {
            id: 'init-error',
            sender: 'ai',
            text: "There was an error initializing the AI assistant. The chatbot may not function correctly."
        }]);
    }
  }, []);


  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !chat) {
        // Handle case where chat isn't initialized
        const errorMessage: ChatMessage = {
            id: `err_${Date.now()}`,
            sender: 'ai',
            text: "Sorry, the chatbot is not available at the moment.",
        };
        setMessages(prev => [...prev.filter(m => m.id !== 'init-error'), errorMessage]);
        return;
    }

    const newUserMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userMessage,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: userMessage });
      
      let aiResponseText = '';
      const aiMessageId = `ai_${Date.now()}`;
      
      // Add a placeholder AI message
      const newAiMessage: ChatMessage = { id: aiMessageId, sender: 'ai', text: '' };
      setMessages(prev => [...prev, newAiMessage]);

      for await (const chunk of stream) {
          aiResponseText += chunk.text;
          setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
          ));
      }
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider value={{ isOpen, toggleChat, messages, sendMessage, isLoading }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};