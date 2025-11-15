import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useChatbot } from '../../contexts/ChatbotContext';

const ChatbotIcon: React.FC = () => {
    const { toggleChat, isOpen } = useChatbot();

    if (isOpen) return null; // Hide icon when chat window is open

    return (
        <motion.button
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-[100] w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            aria-label="Open AI assistant"
            title="Open AI assistant"
        >
            <MessageSquare size={32} />
        </motion.button>
    );
};

export default ChatbotIcon;
