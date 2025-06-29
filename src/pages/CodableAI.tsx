import React, { useState } from 'react';
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
    navigator.clipboard.writeText(content);
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

  // Enhanced syntax highlighting for code blocks
  const renderCodeBlock = (code: string, language?: string) => {
    const lines = code.split('\n');
    
    return (
      <div className="relative">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
          <span className="text-xs text-gray-400 font-medium">
            {language || 'code'}
          </span>
          <button
            onClick={() => copyToClipboard(code)}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>
        </div>
        <div className="bg-gray-900 p-4 rounded-b-lg overflow-x-auto">
          <pre className="text-sm">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-gray-500 select-none w-8 text-right mr-4 text-xs">
                  {index + 1}
                </span>
                <code className="flex-1" dangerouslySetInnerHTML={{ 
                  __html: highlightSyntax(line, language) 
                }} />
              </div>
            ))}
          </pre>
        </div>
      </div>
    );
  };

  // Basic syntax highlighting function
  const highlightSyntax = (line: string, language?: string) => {
    let highlighted = line;
    
    // Keywords (blue)
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'from', 'def', 'print', 'public', 'private', 'static', 'void', 'int', 'string', 'boolean'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-blue-400 font-medium">${keyword}</span>`);
    });
    
    // Strings (green)
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
    
    // Numbers (orange)
    highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="text-orange-400">$&</span>');
    
    // Comments (gray)
    highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm, '<span class="text-gray-500 italic">$1</span>');
    
    // Functions (yellow)
    highlighted = highlighted.replace(/(\w+)(\s*\()/g, '<span class="text-yellow-400">$1</span>$2');
    
    // Operators (purple)
    highlighted = highlighted.replace(/([+\-*/%=<>!&|]+)/g, '<span class="text-purple-400">$1</span>');
    
    // Brackets (cyan)
    highlighted = highlighted.replace(/([{}[\]()])/g, '<span class="text-cyan-400">$1</span>');
    
    return highlighted;
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
                <div 
                  className="text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: message.content
                      // Headers
                      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium mb-2 text-gray-700 dark:text-gray-300">$3</h3>')
                      // Bold and italic
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                      // Code blocks
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                        return `<div class="my-4">${renderCodeBlock(code.trim(), lang)}</div>`;
                      })
                      // Inline code
                      .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-purple-600 dark:text-purple-400">$1</code>')
                      // Lists
                      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
                      // Links
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
                  }}
                />
              ) : (
                <div className="text-sm whitespace-pre-wrap">
                  {message.hasCode ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                          return `<div class="my-2 bg-black/20 rounded-lg p-3"><pre class="text-xs font-mono text-gray-100">${code.trim()}</pre></div>`;
                        })
                        .replace(/`([^`]+)`/g, '<code class="bg-black/20 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
                    }} />
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
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
        </div>

        {/* Suggestions */}
        <div className="p-4 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSuggestionClick(chip)}
                className="px-3 py-1 text-xs bg-gray-100/50 dark:bg-gray-800/50 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors border border-gray-200/20 dark:border-gray-700/20"
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
                className="w-full px-4 py-3 text-sm bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50 min-h-[60px] max-h-32"
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