
import React, { useState, useEffect } from 'react';
import { ChatbotButton } from './ChatbotButton';
import { ChatbotDialog } from './ChatbotDialog';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [shape, setShape] = useState<'circle' | 'square'>('circle');
  const [theme, setTheme] = useState<'default' | 'dark'>('default');

  // Load preferences from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('chatbot-position');
    const savedShape = localStorage.getItem('chatbot-shape');
    const savedTheme = localStorage.getItem('chatbot-theme');
    
    if (savedPosition) setPosition(savedPosition as 'bottom-right' | 'bottom-left');
    if (savedShape) setShape(savedShape as 'circle' | 'square');
    if (savedTheme) setTheme(savedTheme as 'default' | 'dark');
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('chatbot-position', position);
    localStorage.setItem('chatbot-shape', shape);
    localStorage.setItem('chatbot-theme', theme);
  }, [position, shape, theme]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const togglePosition = () => {
    const newPosition = position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    setPosition(newPosition);
  };

  const toggleShape = () => {
    const newShape = shape === 'circle' ? 'square' : 'circle';
    setShape(newShape);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'dark' : 'default';
    setTheme(newTheme);
  };

  return (
    <div className={`fixed z-50 ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4`}>
      {isOpen ? (
        <ChatbotDialog 
          onClose={toggleChat} 
          position={position}
          theme={theme}
          onTogglePosition={togglePosition}
          onToggleShape={toggleShape}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <ChatbotButton 
          onClick={toggleChat} 
          shape={shape}
          theme={theme}
        />
      )}
    </div>
  );
}
