
import React from 'react';

interface ChatMessageProps {
  message: {
    content: string;
    sender: 'user' | 'bot';
    isCalculation?: boolean;
    result?: string;
  };
  theme: 'default' | 'dark';
}

export function ChatMessage({ message, theme }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const isCalculation = message.isCalculation;
  
  // Apply different styles based on sender and theme
  const containerClasses = isUser
    ? `flex justify-end mb-3`
    : `flex justify-start mb-3`;
    
  const messageClasses = isUser
    ? `bg-primary text-primary-foreground rounded-lg rounded-br-none px-4 py-2 max-w-[80%]`
    : theme === 'default'
      ? `bg-secondary text-secondary-foreground rounded-lg rounded-bl-none px-4 py-2 max-w-[80%]`
      : `bg-slate-700 text-slate-100 rounded-lg rounded-bl-none px-4 py-2 max-w-[80%]`;

  if (isCalculation && message.result) {
    return (
      <div className={containerClasses}>
        <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 max-w-[85%]">
          <div className="text-sm font-mono bg-slate-200 dark:bg-slate-700 p-2 rounded">
            {message.content}
          </div>
          <div className="mt-1 font-semibold text-right">
            = {message.result}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={messageClasses}>
        <div className="text-sm">{message.content}</div>
      </div>
    </div>
  );
}
