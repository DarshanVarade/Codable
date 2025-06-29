import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Brain, 
  Copy, 
  Sparkles,
  Code,
  MessageCircle,
  Lightbulb,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw
} from 'lucide-react';
import { useAIChat } from '../hooks/useGemini';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasCode?: boolean;
}

const CodableAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { loading, sendMessage } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  React.useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `# Welcome to Codable AI! 🚀

I'm your **intelligent coding assistant** powered by **Gemini 2.0 Flash**. I can help you with:

## 🔧 **What I Can Do:**
- **Debug Code**: Find and fix bugs in your code
- **Code Review**: Analyze code quality and suggest improvements  
- **Explain Code**: Break down complex code into simple explanations
- **Generate Code**: Create code solutions for your problems
- **Best Practices**: Share coding standards and optimization tips
- **Algorithm Help**: Explain algorithms and data structures
- **Language Support**: Help with JavaScript, Python, Java, C++, and more!

## 💡 **Quick Examples:**
- "What's wrong with this JavaScript function?"
- "Explain how this Python code works"
- "Generate a sorting algorithm in Java"
- "How can I optimize this SQL query?"
- "What are the best practices for React components?"

**Just paste your code or ask any programming question to get started!** ✨`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages are added
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasCode: /```[\s\S]*```|`[^`]+`/.test(input)
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasCode: /```[\s\S]*```|`[^`]+`/.test(result.response)
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
    // Clean content by removing HTML tags and markdown formatting for clipboard
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/```[\w]*\n/g, '')
      .replace(/```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s*/gm, '')
      .trim();
    
    navigator.clipboard.writeText(cleanContent);
    toast.success('Copied to clipboard! 📋');
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    toast.success('Chat cleared! 🧹');
  };

  const suggestionChips = [
    "Debug this JavaScript function",
    "Explain this Python code",
    "Generate a React component",
    "Optimize this algorithm",
    "Review my code quality",
    "Best practices for APIs"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  // Clean code block rendering without HTML artifacts
  const renderCodeBlock = (code: string, language?: string) => {
    // Clean the code by removing any HTML tags
    const cleanCode = code.replace(/<[^>]*>/g, '').trim();
    const lines = cleanCode.split('\n');
    
    return (
      <div className="relative my-4">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
          <span className="text-xs text-gray-400 font-medium uppercase">
            {language || 'code'}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(cleanCode);
              toast.success('Code copied to clipboard');
            }}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>
        </div>
        <div className="bg-gray-900 p-4 rounded-b-lg overflow-x-auto">
          <pre className="text-sm text-green-400 font-mono">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-gray-500 select-none w-8 text-right mr-4 text-xs">
                  {index + 1}
                </span>
                <code className="flex-1 whitespace-pre">
                  {line}
                </code>
              </div>
            ))}
          </pre>
        </div>
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    const isAI = message.role === 'assistant';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-6`}
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
          
          <div className={`rounded-xl p-4 ${
            isAI
              ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50'
              : 'bg-gradient-to-r from-primary-dark to-secondary-dark text-white'
          }`}>
            <div className="prose prose-sm max-w-none">
              {isAI ? (
                <div className="text-sm">
                  {/* Process the content to handle code blocks and formatting */}
                  {message.content.split(/```(\w+)?\n([\s\S]*?)```/).map((part, index) => {
                    if (index % 3 === 0) {
                      // Regular text content
                      return (
                        <div key={index} dangerouslySetInnerHTML={{ 
                          __html: part
                            // Headers
                            .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">$1</h1>')
                            .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">$1</h2>')
                            .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium mb-2 text-gray-700 dark:text-gray-300">$1</h3>')
                            // Bold and italic
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                            // Inline code
                            .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-purple-600 dark:text-purple-400">$1</code>')
                            // Lists
                            .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
                            // Links
                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
                        }} />
                      );
                    } else if (index % 3 === 1) {
                      // Language identifier (skip)
                      return null;
                    } else {
                      // Code block content
                      const language = message.content.split(/```(\w+)?\n([\s\S]*?)```/)[index - 1];
                      return renderCodeBlock(part, language);
                    }
                  })}
                </div>
              ) : (
                <div className="text-sm whitespace-pre-wrap">
                  {message.hasCode ? (
                    <div>
                      {message.content.split(/```(\w+)?\n([\s\S]*?)```/).map((part, index) => {
                        if (index % 3 === 0) {
                          // Regular text
                          return <span key={index}>{part}</span>;
                        } else if (index % 3 === 1) {
                          // Language (skip)
                          return null;
                        } else {
                          // Code block
                          return (
                            <div key={index} className="my-2 bg-black/20 rounded-lg p-3">
                              <pre className="text-xs font-mono text-gray-100 whitespace-pre-wrap">
                                {part.replace(/<[^>]*>/g, '').trim()}
                              </pre>
                            </div>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <span className="text-xs opacity-70">{message.timestamp}</span>
              <div className="flex items-center gap-2">
                {message.hasCode && (
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <Code className="w-3 h-3" />
                    <span>Code</span>
                  </div>
                )}
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
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            Codable AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your intelligent coding assistant powered by Gemini 2.0 Flash
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Online</span>
          </div>
          
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden flex flex-col">
        {/* Messages - Fixed height with scroll */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4"
          style={{ height: 'calc(100vh - 20rem)' }}
        >
          {messages.map(renderMessage)}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-6"
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
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
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
        <div className="border-t border-gray-200/20 dark:border-gray-700/20 bg-gray-50/50 dark:bg-gray-800/50 p-4">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSuggestionClick(chip)}
                className="px-3 py-1 text-xs bg-white dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about code... (Shift+Enter for new line)"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50 min-h-[60px] max-h-32"
                rows={2}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary-dark to-secondary-dark text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodableAI;