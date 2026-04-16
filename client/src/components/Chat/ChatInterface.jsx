import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ConfirmationCard from './ConfirmationCard';
import InputBox from './InputBox';
import { chatService } from '../../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI booking assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [error, setError] = useState(null);
  
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, interpretation]);

  const handleSend = async (val = input) => {
    if (!val.trim()) return;

    // Clear previous errors
    setError(null);
    setInterpretation(null);

    const userMsg = { role: 'user', text: val };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.text }));
      const response = await chatService.sendMessage(val, history);
      const data = response.data;

      // Handle common AI validation responses to avoid "spammy" look
      // (Simplified logic for deduplication: don't repeat the exact same last bot message)
      const lastBotMsg = messages.filter(m => m.role === 'ai').pop();
      if (lastBotMsg && lastBotMsg.text === data.aiMessage) {
          // AI is repeating itself (likely missing info) - we still show it but could handle differently
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: data.aiMessage,
        suggestions: data.suggestions 
      }]);

      if (data.actionRequired) {
        setInterpretation({
          type: data.actionType,
          details: data.extractedData,
          appointmentId: data.appointmentId
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "I'm having trouble connecting to the server. Please try again.";
      // Deduplicate error: Only show if it's different from the last message
      if (messages[messages.length - 1]?.text !== errorMsg) {
          setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirm = async () => {
    if (!interpretation) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.confirmAction(
        interpretation.type,
        interpretation.details,
        interpretation.appointmentId
      );
      setMessages(prev => [...prev, { role: 'ai', text: response.data.message }]);
      setInterpretation(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to confirm. Please check details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-wrapper h-full max-w-4xl mx-auto px-4">
      <div className="message-list pt-8 pb-32" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <MessageBubble 
            key={idx} 
            {...msg} 
            onSelectSuggestion={(time) => handleSend(`Book for ${time}`)} 
          />
        ))}

        {interpretation && (
          <ConfirmationCard 
            details={interpretation.details}
            type={interpretation.type}
            onConfirm={onConfirm}
            onCancel={() => setInterpretation(null)}
          />
        )}

        {error && (
          <div className="flex justify-center my-4">
            <div className="error-msg animate-in fade-in slide-in-from-bottom-2 duration-300">{error}</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent">
        <InputBox 
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          isLoading={isLoading}
          placeholder="Ask me to book, reschedule, or cancel..."
        />
      </div>
    </div>
  );
};

export default ChatInterface;
