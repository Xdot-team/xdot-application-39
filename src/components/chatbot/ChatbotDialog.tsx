
import React, { useState, useRef, useEffect } from 'react';
import { X, Calculator, Settings } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { evaluateExpression } from '@/utils/mathParser';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  isCalculation?: boolean;
  result?: string;
}

interface ChatbotDialogProps {
  onClose: () => void;
  position: 'bottom-right' | 'bottom-left';
  theme: 'default' | 'dark';
  onTogglePosition: () => void;
  onToggleShape: () => void;
  onToggleTheme: () => void;
}

export function ChatbotDialog({ 
  onClose, 
  position,
  theme,
  onTogglePosition,
  onToggleShape,
  onToggleTheme
}: ChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your assistant. Ask me anything or use me as a calculator.",
      sender: 'bot'
    }
  ]);
  const [isCalculatorMode, setIsCalculatorMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Check if it's a calculation
    if (evaluateExpression.isCalculation(message)) {
      try {
        const result = evaluateExpression.calculate(message);
        const calculationResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: message,
          sender: 'bot',
          isCalculation: true,
          result: result
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, calculationResponse]);
        }, 500);
      } catch (error) {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I couldn't calculate that. Please check your expression.",
          sender: 'bot'
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, errorResponse]);
        }, 500);
      }
    } else {
      // Normal chat response
      const chatResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(message),
        sender: 'bot'
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, chatResponse]);
      }, 800);
    }
  };

  const getBotResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hello! How can I assist you today?";
    } else if (lowerMsg.includes('help')) {
      return "I can help you navigate the application, answer questions, or perform calculations. What do you need?";
    } else if (lowerMsg.includes('thank')) {
      return "You're welcome! Is there anything else I can help with?";
    } else {
      return "I'm not sure how to respond to that yet. You can use me as a calculator by typing any mathematical expression.";
    }
  };

  const toggleCalculatorMode = () => {
    setIsCalculatorMode(!isCalculatorMode);
    
    if (!isCalculatorMode) {
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          content: "Calculator mode activated. Type your calculations below.",
          sender: 'bot'
        }
      ]);
    }
  };

  const themeClasses = theme === 'default' 
    ? 'bg-background text-foreground border-border'
    : 'bg-slate-800 text-slate-100 border-slate-700';

  return (
    <Card className={`w-80 sm:w-96 h-96 shadow-lg ${themeClasses} border transition-all`}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center">
          <span className="font-medium">xDOT Assistant</span>
          {isCalculatorMode && <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">Calculator Mode</span>}
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCalculatorMode}>
            <Calculator className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {isSettingsOpen && (
        <div className="p-3 border-b">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Position:</span>
              <Button variant="outline" size="sm" onClick={onTogglePosition}>
                {position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Shape:</span>
              <Button variant="outline" size="sm" onClick={onToggleShape}>
                {position === 'bottom-right' ? 'Circle' : 'Square'}
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Theme:</span>
              <Button variant="outline" size="sm" onClick={onToggleTheme}>
                {theme === 'default' ? 'Light' : 'Dark'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <CardContent className="p-3 overflow-y-auto h-[calc(24rem-106px)]">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              theme={theme}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 border-t">
        <ChatInput onSendMessage={handleSendMessage} isCalculatorMode={isCalculatorMode} theme={theme} />
      </CardFooter>
    </Card>
  );
}
