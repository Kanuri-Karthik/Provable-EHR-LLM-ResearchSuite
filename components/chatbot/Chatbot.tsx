import React from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import ChatbotIcon from './ChatbotIcon';
import ChatWindow from './ChatWindow';
import { AnimatePresence } from 'framer-motion';

const Chatbot: React.FC = () => {
  const { isOpen } = useChatbot();

  return (
    <>
      <ChatbotIcon />
      <AnimatePresence>
        {isOpen && <ChatWindow />}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
