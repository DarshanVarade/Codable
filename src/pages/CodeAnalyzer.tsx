import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Download, 
  Copy, 
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Brain,
  GitBranch,
  Zap,
  Info,
  Settings,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCodeAnalysis } from '../hooks/useGemini';
import { geminiService } from '../lib/gemini';

const CodeAnalyzer: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('analysis');
  const { analyzing, result, analyzeCode } = useCodeAnalysis();

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
  ];

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please paste your code first');
      return;
    }

    try {
      await analyzeCode(code, language);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'error': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'info': return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const renderFlowchart = () => {
    if (!result?.flowchart) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Logic Flowchart</h4>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-colors">
              Export PNG
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
              Export SVG
            </button>
          </div>
        </div>

        <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-6 overflow-x-auto">
          <div className="flex flex-col items-center space-y-6 min-w-max">
            {result.flowchart.nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <div className={`relative px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  node.type === 'start' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  node.type === 'end' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  node.type === 'decision' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 transform rotate-45' :
                  'bg-gradient-to-r from-blue-500 to-blue-600'
                } text-white`}>
                  <span className={`font-semibold text-center block ${
                    node.type === 'decision' ? '-rotate-45' : ''
                  }`}>
                    {node.label}
                  </span>
                </div>
                {node.description && (
                  <div className="opacity-0 group-hover:opacity-100 mt-2 text-xs text-center text-gray-600 dark:text-gray-400 transition-opacity">
                    {node.description}
                  </div>
                )}
                
                {/* Arrow to next node */}
                {index < result.flowchart.nodes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (index + 1) * 0.2 }}
                    className="flex flex-col items-center mt-4"
                  >
                    <div className="w-px h-8 bg-gray-400" />
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Code Analyzer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste your code and get instant AI-powered insights, bug detection, and optimization suggestions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* API Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            geminiService.isAvailable() 
              ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' 
              : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              geminiService.isAvailable() ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`} />
            <span>{geminiService.isAvailable() ? 'Gemini AI Ready' : 'Basic Mode'}</span>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 bg-card-light dark:bg-card-dark border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Analyze Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200/20 dark:border-gray-700/20">
            <h3 className="font-semibold">Code Editor</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  toast.success('Code copied to clipboard');
                }}
                className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-96">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
              placeholder="Paste your code here to analyze..."
            />
          </div>
        </motion.div>

        {/* Analysis Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200/20 dark:border-gray-700/20">
            {[
              { id: 'analysis', label: 'Analysis', icon: Brain },
              { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-dark border-b-2 border-primary-dark bg-primary-dark/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 h-96 overflow-y-auto">
            {analyzing ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Analyzing your code...</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {geminiService.isAvailable() 
                    ? 'AI is examining your code for insights' 
                    : 'Performing basic code analysis'
                  }
                </p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {activeTab === 'analysis' && (
                  <>
                    {/* Score */}
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700" />
                        <div
                          className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-500 transform -rotate-90 transition-all duration-1000"
                          style={{
                            borderTopColor: result.score >= 80 ? '#10B981' : result.score >= 60 ? '#F59E0B' : '#F43F5E',
                            transform: `rotate(-90deg) rotate(${(result.score / 100) * 360}deg)`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{result.score}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(result.score / 20)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Code Quality Score
                      </p>
                    </div>

                    {/* Code Summary */}
                    <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Code Summary
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {result.summary}
                      </p>
                    </div>

                    {/* Detailed Explanation */}
                    <div>
                      <h4 className="font-semibold mb-3">Detailed Explanation</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {result.explanation}
                      </div>
                    </div>

                    {/* Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Suggestions</h4>
                        <div className="space-y-3">
                          {result.suggestions.map((suggestion, index) => {
                            const Icon = getSuggestionIcon(suggestion.type);
                            return (
                              <div
                                key={index}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${getSuggestionColor(suggestion.type)}`}
                              >
                                <Icon className="w-5 h-5 mt-0.5" />
                                <div>
                                  <p className="font-medium">{suggestion.title}</p>
                                  <p className="text-sm mt-1">{suggestion.message}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Complexity Analysis */}
                    {result.complexity && (
                      <div>
                        <h4 className="font-semibold mb-3">Complexity Analysis</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-6 h-6 text-green-500" />
                              <span className="font-medium text-lg">Time Complexity</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.complexity.time}</p>
                          </div>
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-6 h-6 text-blue-500" />
                              <span className="font-medium text-lg">Space Complexity</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.complexity.space}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* API Status Notice */}
                    {!geminiService.isAvailable() && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-yellow-900 dark:text-yellow-100">Basic Analysis Mode</span>
                        </div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          For advanced AI-powered analysis, configure your Gemini API key in the environment variables.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'flowchart' && renderFlowchart()}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Ready to Analyze</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Paste your code in the editor and click "Analyze Code" to get started
                </p>
                {!geminiService.isAvailable() && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> Running in basic mode. Configure Gemini API for advanced analysis.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeAnalyzer;