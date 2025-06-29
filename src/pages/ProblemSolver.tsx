import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Code, 
  Play, 
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Copy,
  Zap,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProblemSolver, useCodeOptimization } from '../hooks/useGemini';

const ProblemSolver: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('solution');
  const { solving, solution, solveProblem } = useProblemSolver();
  const { optimizing, optimizeCode } = useCodeOptimization();
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-500' },
    { value: 'python', label: 'Python', color: 'bg-blue-500' },
    { value: 'java', label: 'Java', color: 'bg-red-500' },
    { value: 'cpp', label: 'C++', color: 'bg-purple-500' },
    { value: 'typescript', label: 'TypeScript', color: 'bg-blue-600' },
    { value: 'go', label: 'Go', color: 'bg-cyan-500' },
    { value: 'rust', label: 'Rust', color: 'bg-orange-500' },
    { value: 'php', label: 'PHP', color: 'bg-indigo-500' },
  ];

  // Only show 2 examples as requested
  const examples = [
    "Write a function that takes an array of numbers and returns the sum of all even numbers",
    "Create a function to check if a string is a palindrome (reads the same forwards and backwards)"
  ];

  const handleGenerate = async () => {
    if (!problem.trim()) {
      toast.error('Please describe your problem first');
      return;
    }

    try {
      await solveProblem(problem, selectedLanguage);
      setOptimizedResult(null); // Reset optimization when generating new solution
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleOptimize = async () => {
    if (!solution?.solution_code) {
      toast.error('No code to optimize');
      return;
    }

    try {
      const result = await optimizeCode(solution.solution_code, selectedLanguage);
      setOptimizedResult(result);
      setActiveTab('optimize'); // Switch to optimize tab
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getOptimizationIcon = (type: string) => {
    switch (type) {
      case 'performance': return Zap;
      case 'readability': return Code;
      case 'best_practice': return CheckCircle;
      default: return Lightbulb;
    }
  };

  const getOptimizationColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'readability': return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
      case 'best_practice': return 'text-green-500 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  // Clean code rendering without HTML artifacts
  const renderCodeBlock = (code: string, language?: string) => {
    // Clean the code by removing any HTML tags that might have been added
    const cleanCode = code.replace(/<[^>]*>/g, '').trim();
    const lines = cleanCode.split('\n');
    
    return (
      <div className="relative">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Problem Solver</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Describe any programming problem and get complete solutions with code generation and execution
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problem Input - Larger as requested */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Problem Statement - Larger window with darker background */}
          <div className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Problem Statement
            </h3>
            
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your programming problem in detail. For example: 'Write a function that takes a number and checks if it's even or odd'"
              className="w-full h-40 p-4 bg-gray-700/50 border border-gray-600/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            />

            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-3">Try these examples:</p>
              <div className="grid gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setProblem(example)}
                    className="text-left text-sm p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors text-gray-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Programming Language */}
          <div className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="font-semibold mb-4 text-white">Programming Language</h3>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedLanguage === lang.value
                      ? 'border-primary-dark bg-primary-dark/20 text-primary-dark'
                      : 'border-gray-600/50 hover:border-primary-dark/50 text-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 ${lang.color} rounded-full`} />
                  <span className="text-sm font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={solving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {solving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Complete Solution
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Complete Solution
              </>
            )}
          </button>
        </motion.div>

        {/* Solution Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200/20 dark:border-gray-700/20">
            {[
              { id: 'solution', label: 'Solution' },
              { id: 'run', label: 'Run Code' },
              { id: 'optimize', label: 'Optimize' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-dark border-b-2 border-primary-dark bg-primary-dark/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 h-96 overflow-y-auto">
            {solving ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Generating solution...</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI is crafting the perfect solution for you
                </p>
              </div>
            ) : solution ? (
              <div className="space-y-6">
                {activeTab === 'solution' && (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Generated Solution</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const cleanCode = solution.solution_code.replace(/<[^>]*>/g, '').trim();
                            navigator.clipboard.writeText(cleanCode);
                            toast.success('Code copied to clipboard');
                          }}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100/50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                        <button
                          onClick={handleOptimize}
                          disabled={optimizing}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                          {optimizing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4" />
                          )}
                          Optimize
                        </button>
                      </div>
                    </div>
                    
                    {renderCodeBlock(solution.solution_code, selectedLanguage)}

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation</h5>
                      <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                        {solution.explanation}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'run' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Code Execution</h4>
                    
                    {solution.execution_result.success ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-semibold text-green-900 dark:text-green-100">Execution Successful</span>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Your code compiled and executed without any issues.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="font-semibold text-red-900 dark:text-red-100">Execution Failed</span>
                        </div>
                        <p className="text-sm text-red-800 dark:text-red-200">
                          {solution.execution_result.error || 'An error occurred during execution.'}
                        </p>
                      </div>
                    )}

                    {solution.execution_result.output && (
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-medium mb-2">Output:</h5>
                        <div className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                          {solution.execution_result.output}
                        </div>
                      </div>
                    )}

                    {(solution.execution_result.execution_time || solution.execution_result.memory_usage) && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-yellow-500" />
                          <span className="font-semibold text-yellow-900 dark:text-yellow-100">Performance Metrics</span>
                        </div>
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                          {solution.execution_result.execution_time && (
                            <p>Execution time: {solution.execution_result.execution_time}</p>
                          )}
                          {solution.execution_result.memory_usage && (
                            <p>Memory usage: {solution.execution_result.memory_usage}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'optimize' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Code Optimization</h4>
                    
                    {optimizing ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="font-medium text-yellow-900 dark:text-yellow-100">Optimizing code...</p>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Analyzing and improving your solution
                        </p>
                      </div>
                    ) : optimizedResult ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <h5 className="font-semibold text-green-900 dark:text-green-100 mb-3">Optimized Code</h5>
                          {renderCodeBlock(optimizedResult.optimized_code, selectedLanguage)}
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">What Was Optimized</h5>
                          <div className="space-y-3">
                            {optimizedResult.improvements.map((improvement: any, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                  <p className="font-medium text-sm">{improvement.type}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{improvement.description}</p>
                                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Impact: {improvement.impact}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : solution.optimization_suggestions && solution.optimization_suggestions.length > 0 ? (
                      <div className="space-y-3">
                        {solution.optimization_suggestions.map((suggestion, index) => {
                          const Icon = getOptimizationIcon(suggestion.type);
                          return (
                            <div
                              key={index}
                              className={`flex items-start gap-3 p-4 rounded-lg border ${getOptimizationColor(suggestion.type)}`}
                            >
                              <Icon className="w-5 h-5 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium mb-1">{suggestion.title}</p>
                                <p className="text-sm mb-2">{suggestion.description}</p>
                                {suggestion.code_example && (
                                  <div className="bg-gray-900 rounded p-2 font-mono text-xs text-green-400 overflow-x-auto">
                                    <pre>{suggestion.code_example.replace(/<[^>]*>/g, '')}</pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="font-medium text-green-900 dark:text-green-100">Great Code!</p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Your solution is already well-optimized.
                        </p>
                        <button
                          onClick={handleOptimize}
                          disabled={optimizing}
                          className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                          Try Advanced Optimization
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Ready to Generate</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Describe your problem and select a programming language to get started
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProblemSolver;