

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Trash2, X, Sparkles, ChevronDown, Clock, Flame, Utensils, Dumbbell, Droplet, Zap, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { AI_KNOWLEDGE_BASE, FALLBACK_RESPONSES } from '../constants';
import Button from '../components/Button';

interface AiAssistantProps {
  onClose: () => void;
}

const AiAssistantScreen: React.FC<AiAssistantProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  
  // Initialize messages from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('fitcal_chat_history');
        if (saved) {
          return JSON.parse(saved).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
    return [];
  });

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Greeting based on time (only if no history)
  useEffect(() => {
    if (messages.length === 0) {
      const hour = new Date().getHours();
      let greeting = "Salam!";
      if (hour < 12) greeting = "Good Morning!";
      else if (hour < 18) greeting = "Good Afternoon!";
      else greeting = "Good Evening!";

      setMessages([
        {
          id: '1',
          text: `${greeting} 👋 Main apka FitCal Coach hoon. Weight loss, diet ya gym ke baray mein kuch bhi poochein!`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('fitcal_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const responseText = getAiResponse(textToSend.trim());
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const detectLanguage = (text: string): 'en' | 'hinglish' => {
    const hinglishIndicators = [
      'hai', 'ho', 'ka', 'ki', 'ke', 'ko', 'mein', 'aur', 'bhi', 'kya', 'nahi', 
      'kuch', 'kaise', 'salam', 'shukriya', 'theek', 'karo', 'karna', 'wale', 'wala',
      'haan', 'jee', 'bhai', 'yaar', 'chacha', 'khana', 'peena'
    ];
    const words = text.toLowerCase().split(/\s+/);
    
    // If any common Hinglish word is present, assume Hinglish intent
    const hasHinglish = words.some(w => hinglishIndicators.includes(w));
    
    // Default to English if strictly no Hinglish indicators found
    return hasHinglish ? 'hinglish' : 'en';
  };

  const getAiResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    const detectedLang = detectLanguage(query);
    
    // Scoring System: Find the knowledge base item with the MOST matching keywords
    let bestMatch = null;
    let maxScore = 0;

    AI_KNOWLEDGE_BASE.forEach(item => {
      let score = 0;
      item.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword)) {
          score += 1;
          // Bonus points for exact word match vs substring
          if (lowerQuery.split(' ').includes(keyword)) score += 0.5;
        }
      });

      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && maxScore > 0) {
      // Return response in detected language
      // @ts-ignore - Assuming constants is updated with new structure
      return bestMatch.responses[detectedLang];
    }

    // Fallback
    // @ts-ignore
    const fallbackList = FALLBACK_RESPONSES[detectedLang];
    return fallbackList[Math.floor(Math.random() * fallbackList.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Clear conversation history?")) {
       const resetMsg: ChatMessage[] = [{
         id: Date.now().toString(),
         text: "Chat cleared. Ask me anything! / Poochieye? 😊",
         sender: 'bot',
         timestamp: new Date()
       }];
       setMessages(resetMsg);
    }
  };

  const quickChips = [
    { label: "Weight Loss", icon: Flame, text: "Weight loss tips batayein" },
    { label: "Biryani Cals", icon: Utensils, text: "Biryani mein kitni calories hain?" },
    { label: "Abs Workout", icon: Dumbbell, text: "Abs workout for home" },
    { label: "High Protein", icon: Zap, text: "Best protein sources?" },
    { label: "Water Intake", icon: Droplet, text: "Rozana kitna pani peena chahiye?" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl h-full">
      {/* Header - Fixed at Top */}
      <div className="flex-none flex items-center justify-between p-4 border-b border-card-border bg-card/80 backdrop-blur-md shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)] border border-white/20">
              <Bot className="text-white" size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-card animate-pulse"></span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground flex items-center gap-1">
              FitCal Coach
            </h2>
            <p className="text-[10px] uppercase tracking-wider text-muted flex items-center gap-1">
              AI Assistant • Online
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={handleClearChat}
            className="p-2.5 rounded-full bg-input hover:bg-red-500/20 hover:text-red-500 transition-colors text-muted"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full bg-input hover:bg-card-border transition-colors text-foreground"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Chat Area - Scrollable Middle */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-neon-blue/20 bg-gradient-to-b from-transparent to-black/5">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Bot Avatar */}
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center shrink-0 mt-1">
                <Bot size={14} className="text-neon-blue" />
              </div>
            )}

            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
               <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed relative border ${
                 msg.sender === 'user' 
                   ? 'bg-neon-blue text-black font-semibold rounded-br-none border-neon-blue shadow-[0_4px_15px_rgba(0,243,255,0.2)]' 
                   : 'bg-card border-card-border text-foreground rounded-bl-none shadow-md'
               }`}>
                 {msg.text.split('\n').map((line, i) => (
                   <React.Fragment key={i}>
                     {line}
                     {i < msg.text.split('\n').length - 1 && <br />}
                   </React.Fragment>
                 ))}
               </div>
               <span className="text-[10px] text-muted mt-1 px-1 opacity-70 flex items-center gap-1">
                 {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 {msg.sender === 'user' && <span className="text-neon-blue">✓✓</span>}
               </span>
            </div>

            {/* User Avatar */}
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-input border border-card-border flex items-center justify-center shrink-0 mt-1">
                <User size={14} className="text-muted" />
              </div>
            )}
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-neon-blue" />
             </div>
             <div className="bg-card border border-card-border px-4 py-4 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce"></span>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="flex-none p-4 bg-card/90 backdrop-blur-xl border-t border-card-border pb-safe">
        
        {/* Chips */}
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto mb-3 pb-2 scrollbar-hide mask-fade-right">
            {quickChips.map((chip, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSend(chip.text)}
                className="whitespace-nowrap px-4 py-2.5 rounded-full bg-input border border-card-border text-xs font-bold text-muted hover:text-neon-blue hover:border-neon-blue hover:bg-neon-blue/10 transition-all flex items-center gap-2 shadow-sm"
              >
                <chip.icon size={14} className="text-neon-purple" />
                {chip.label}
              </motion.button>
            ))}
          </div>
        )}

        <div className="flex gap-2 relative items-end">
          <div className="flex-1 relative group">
             <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="w-full bg-input text-foreground placeholder-muted border border-card-border rounded-2xl px-5 py-3.5 focus:outline-none focus:border-neon-blue transition-all pr-10 shadow-inner"
            />
            <Sparkles size={16} className="absolute right-4 top-4 text-neon-purple opacity-50 group-focus-within:text-neon-blue group-focus-within:opacity-100 transition-all" />
          </div>
          
          <Button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="!p-3.5 !rounded-2xl shrink-0 aspect-square flex items-center justify-center bg-gradient-to-tr from-neon-blue to-neon-purple hover:shadow-[0_0_15px_rgba(188,19,254,0.5)]"
          >
            <Send size={20} className={input.trim() ? "text-white" : "text-white/70"} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantScreen;