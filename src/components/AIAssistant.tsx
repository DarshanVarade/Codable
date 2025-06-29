import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Brain, Copy, Code } from 'lucide-react';
import { useAIChat } from '../hooks/useGemini';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { loading, sendMessage } = useAIChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm **Codable AI**, powered by **Gemini 2.0 Flash**. I'm your coding assistant.

**Quick help:**
• Code explanations
• Bug fixes  
• Optimization tips
• Programming concepts

What can I help you with?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const result = await sendMessage(currentInput, currentConversationId || undefined);
      
      if (result) {
        setCurrentConversationId(result.conversationId);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const suggestionChips = [
    "Explain this code",
    "Find bugs",
    "Optimize code",
    "Best practices"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const renderMessage = (message: Message) => {
    const isAI = message.role === 'assistant';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div className={`max-w-[85%] ${isAI ? 'order-2' : 'order-1'}`}>
          {isAI && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Codable AI
              </span>
            </div>
          )}
          
          <div className={`rounded-lg p-3 ${
            isAI
              ? 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100'
              : 'bg-gradient-to-r from-primary-dark to-secondary-dark text-white'
          }`}>
            <div className="prose prose-sm max-w-none">
              {isAI ? (
                <div 
                  className="text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$2</code></pre>')
                      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')
                  }}
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-70">{message.timestamp}</span>
              {isAI && (
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="p-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 w-80 h-full bg-card-light/95 dark:bg-card-dark/95 backdrop-blur-xl border-l border-gray-200/20 dark:border-gray-700/20 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Codable AI</h3>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Gemini 2.0 Flash
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages - Smaller container */}
      <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {messages.map(renderMessage)}
        
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="max-w-[85%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Codable AI
                </span>
              </div>
              <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary-dark rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Panel at Bottom */}
      <div className="border-t border-gray-200/20 dark:border-gray-700/20 p-3 bg-gray-50/50 dark:bg-gray-800/50">
        {/* Suggestions */}
        <div className="flex flex-wrap gap-1 mb-3">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSuggestionClick(chip)}
              className="px-2 py-1 text-xs bg-gray-100/50 dark:bg-gray-800/50 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors border border-gray-200/20 dark:border-gray-700/20"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your code..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-lg border border-gray-200/20 dark:border-gray-700/20 focus:outline-none focus:ring-2 focus:ring-primary-dark/50 resize-none"
              rows={2}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send
        </p>
      </div>
    </motion.div>
  );
};

export default AIAssistant;