
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isCalculatorMode: boolean;
  theme: 'default' | 'dark';
}

export function ChatInput({ onSendMessage, isCalculatorMode, theme }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCalculatorMode]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const themeClasses = theme === 'default'
    ? 'bg-background border-input'
    : 'bg-slate-700 border-slate-600';

  const placeholderText = isCalculatorMode
    ? 'Enter a calculation (e.g., 125 * 5.4)...'
    : 'Type a message...';

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`flex-1 rounded-md border px-3 py-2 text-sm ${themeClasses}`}
        placeholder={placeholderText}
      />
      <button
        type="submit"
        className="flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-2"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
