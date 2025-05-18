
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatbotButtonProps {
  onClick: () => void;
  shape: 'circle' | 'square';
  theme: 'default' | 'dark' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  position?: 'static' | 'fixed';
}

export function ChatbotButton({ 
  onClick, 
  shape = 'circle',
  theme = 'default',
  size = 'md',
  label,
  position = 'static'
}: ChatbotButtonProps) {
  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-md';
  
  const themeClasses = 
    theme === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
    theme === 'dark' ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' :
    'bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-100';
  
  const sizeClasses = 
    size === 'sm' ? 'p-2' : 
    size === 'lg' ? 'p-4' : 
    'p-3';
  
  const iconSize = 
    size === 'sm' ? 'h-4 w-4' : 
    size === 'lg' ? 'h-7 w-7' : 
    'h-6 w-6';
  
  const positionClasses = position === 'fixed' ? 'fixed bottom-6 right-6 z-50 shadow-lg' : '';

  return (
    <button
      className={`${shapeClasses} ${themeClasses} ${sizeClasses} ${positionClasses} transition-all flex items-center justify-center`}
      onClick={onClick}
      aria-label={label || "Open chat assistant"}
    >
      <MessageSquare className={iconSize} />
      {label && <span className="ml-2">{label}</span>}
    </button>
  );
}
