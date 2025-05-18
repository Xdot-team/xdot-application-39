
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatbotButtonProps {
  onClick: () => void;
  shape: 'circle' | 'square';
  theme: 'default' | 'dark';
}

export function ChatbotButton({ onClick, shape, theme }: ChatbotButtonProps) {
  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-md';
  const themeClasses = theme === 'default' 
    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
    : 'bg-slate-800 text-slate-100 hover:bg-slate-700';
  
  return (
    <button
      className={`${shapeClasses} ${themeClasses} p-3 shadow-lg transition-all`}
      onClick={onClick}
      aria-label="Open chat assistant"
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  );
}
