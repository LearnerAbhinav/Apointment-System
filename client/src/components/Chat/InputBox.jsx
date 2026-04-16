import React from 'react';
import { Send, Loader2 } from 'lucide-react';

const InputBox = ({ value, onChange, onSubmit, isLoading, placeholder }) => {
  return (
    <div className="input-section">
      <form 
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="input-container"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Type a message..."}
          disabled={isLoading}
          className="input-field"
        />
        
        <button 
          type="submit" 
          disabled={!value.trim() || isLoading}
          className="send-btn"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
      
      {isLoading && (
        <div className="flex justify-center mt-2">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputBox;
