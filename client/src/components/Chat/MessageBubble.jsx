import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ role, text, suggestions, onSelectSuggestion }) => {
  const isUser = role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}
    >
      <div className="bubble-content">
        {text}
      </div>
      
      {!isUser && suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((time) => (
            <button
              key={time}
              onClick={() => onSelectSuggestion(time)}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors"
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
