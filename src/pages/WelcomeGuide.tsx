import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Code, 
  HelpCircle, 
  Settings,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Zap,
  Trophy,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const WelcomeGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'there';

  const steps = [
    {
      id: 'welcome',
      title: `Welcome to Codable, ${displayName}! 🎉`,
      description: 'Your AI-powered coding companion is ready to help you master programming like never before.',
      icon: Brain,
      color: 'from-blue-500 to-purple-500',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">You're all set! 🚀</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Codable uses advanced AI to help you analyze code, solve problems, and learn programming concepts faster than ever.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">AI-Powered</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Personalized</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Lightning Fast</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analyzer',
      title: 'Code Analyzer',
      description: 'Get instant insights, bug detection, and optimization suggestions for your code.',
      icon: Code,
      color: 'from-green-500 to-blue-500',
      content: (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Analyze Any Code</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Paste your code and get comprehensive analysis including:
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">Bug detection and fixes</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Performance optimization</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Visual flowcharts</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Code quality scoring</span>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/app/analyzer')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Play className="w-4 h-4" />
              Try Code Analyzer
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'solver',
      title: 'Problem Solver',
      description: 'Describe any programming problem and get complete solutions with explanations.',
      icon: HelpCircle,
      color: 'from-purple-500 to-pink-500',
      content: (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Solve Any Problem</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Just describe what you want to build and get:
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Complete working code</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-pink-500" />
              <span className="font-medium">Step-by-step explanations</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Multiple language support</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">Optimization suggestions</span>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/app/solver')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Play className="w-4 h-4" />
              Try Problem Solver
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'assistant',
      title: 'AI Assistant',
      description: 'Your personal coding companion powered by Gemini 2.0 Flash.',
      icon: Brain,
      color: 'from-cyan-500 to-blue-500',
      content: (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Meet Your AI Assistant</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click the floating AI button to get instant help with:
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-cyan-500" />
              <span className="font-medium">Code explanations</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Programming concepts</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
              <span className="font-medium">Best practices</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Quick debugging tips</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-500" />
              <span className="font-medium text-cyan-700 dark:text-cyan-300">Pro Tip</span>
            </div>
            <p className="text-sm text-cyan-800 dark:text-cyan-200">
              The AI assistant is always available - just look for the floating brain icon on any page!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      title: 'You\'re Ready to Code!',
      description: 'Start your coding journey with AI-powered assistance.',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Ready to Start Coding! 🎯</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              You now have access to the most powerful AI coding tools. Let's build something amazing!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/app/analyzer')}
              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Code className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Analyze Code</p>
            </button>
            <button
              onClick={() => navigate('/app/solver')}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <HelpCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium">Solve Problems</p>
            </button>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-yellow-700 dark:text-yellow-300">Quick Start</span>
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Visit your dashboard to track progress, or jump straight into analyzing code!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/app/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-gray-50 to-background-light dark:from-background-dark dark:via-gray-900 dark:to-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip tour
            </button>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-dark to-secondary-dark h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-gray-700/20 p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary-dark'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-dark to-secondary-dark text-white rounded-lg hover:shadow-lg transition-all"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;