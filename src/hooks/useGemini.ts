import { useState } from 'react';
import { geminiService, CodeAnalysisResult, ProblemSolution } from '../lib/gemini';
import { db } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useUserStats } from './useUserStats';
import toast from 'react-hot-toast';

export const useCodeAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CodeAnalysisResult | null>(null);
  const { user } = useAuth();
  const { incrementAnalyses } = useUserStats();

  const analyzeCode = async (code: string, language: string, title?: string) => {
    if (!user) {
      toast.error('Please sign in to analyze code');
      return;
    }

    if (!code || !code.trim()) {
      toast.error('Please provide code to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      // Check if Gemini is available
      if (!geminiService.isAvailable()) {
        toast.error('Gemini API not configured. Please check your environment variables.');
      }

      // Get AI analysis
      const analysis = await geminiService.analyzeCode(code, language);
      setResult(analysis);

      // Save to database
      try {
        await db.createCodeAnalysis({
          user_id: user.id,
          title: title || 'Code Analysis',
          code_content: code,
          language,
          analysis_result: analysis,
          score: analysis.score
        });

        // Update user stats
        await incrementAnalyses();
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't throw here - analysis was successful, just DB save failed
        toast.error('Analysis complete, but failed to save to database');
      }

      if (geminiService.isAvailable()) {
        toast.success('Code analysis complete!');
      } else {
        toast.success('Basic analysis complete! Configure Gemini API for advanced features.');
      }
      
      return analysis;
    } catch (error: any) {
      console.error('Code analysis error:', error);
      
      // Provide specific error messages with better user guidance
      if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
        toast.error('Invalid Gemini API key. Please check your configuration in environment variables.');
      } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        toast.error('Gemini API quota exceeded. Try switching to CopilotKit AI or wait for quota reset.');
        // Don't throw here - let the UI handle quota exceeded state
        return null;
      } else if (error.message?.includes('safety') || error.message?.includes('SAFETY')) {
        toast.error('Content blocked by safety filters. Please try different code.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Failed to analyze code. Please try again.');
      }
      
      throw error;
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzing,
    result,
    analyzeCode,
    setResult
  };
};

export const useProblemSolver = () => {
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const { user } = useAuth();
  const { incrementProblemsSolved } = useUserStats();

  const solveProblem = async (problemStatement: string, language: string) => {
    if (!user) {
      toast.error('Please sign in to solve problems');
      return;
    }

    if (!problemStatement || !problemStatement.trim()) {
      toast.error('Please provide a problem statement');
      return;
    }

    setSolving(true);
    try {
      // Check if Gemini is available
      if (!geminiService.isAvailable()) {
        toast.error('Gemini API not configured. Please check your environment variables.');
      }

      // Get AI solution
      const result = await geminiService.solveProblem(problemStatement, language);
      setSolution(result);

      // Save to database
      try {
        await db.createProblemSolution({
          user_id: user.id,
          problem_statement: problemStatement,
          language,
          solution_code: result.solution_code,
          explanation: result.explanation,
          execution_result: result.execution_result,
          optimization_suggestions: result.optimization_suggestions
        });

        // Update user stats
        await incrementProblemsSolved();
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't throw here - solution was generated, just DB save failed
        toast.error('Solution generated, but failed to save to database');
      }

      if (geminiService.isAvailable()) {
        toast.success('Solution generated successfully!');
      } else {
        toast.success('Basic solution template created! Configure Gemini API for AI-generated solutions.');
      }
      
      return result;
    } catch (error: any) {
      console.error('Problem solving error:', error);
      
      // Provide specific error messages with better user guidance
      if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
        toast.error('Invalid Gemini API key. Please check your configuration.');
      } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        toast.error('Gemini API quota exceeded. Try switching to CopilotKit AI or wait for quota reset.');
      } else if (error.message?.includes('safety') || error.message?.includes('SAFETY')) {
        toast.error('Content blocked by safety filters. Please try a different problem.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Failed to generate solution. Please try again.');
      }
      
      throw error;
    } finally {
      setSolving(false);
    }
  };

  return {
    solving,
    solution,
    solveProblem,
    setSolution
  };
};

export const useAIChat = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = async (message: string, conversationId?: string, context?: string) => {
    if (!user) {
      toast.error('Please sign in to use AI assistant');
      return;
    }

    if (!message || !message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      // Create conversation if needed
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        try {
          const { data: conversation } = await db.createConversation(user.id);
          currentConversationId = conversation?.id;
        } catch (dbError) {
          console.error('Failed to create conversation:', dbError);
          // Continue without saving to DB
        }
      }

      // Get AI response
      const aiResponse = await geminiService.chatWithAssistant(message, context);

      // Add messages to database if conversation exists
      if (currentConversationId) {
        try {
          await db.addMessage(currentConversationId, 'user', message);
          await db.addMessage(currentConversationId, 'assistant', aiResponse);
        } catch (dbError) {
          console.error('Failed to save messages:', dbError);
          // Continue - the AI response was successful
        }
      }

      return {
        conversationId: currentConversationId,
        response: aiResponse
      };
    } catch (error: any) {
      console.error('AI chat error:', error);
      
      // Provide specific error messages with better user guidance
      if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your configuration.');
      } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        throw new Error('Gemini API quota exceeded. Try switching to CopilotKit AI or wait for quota reset.');
      } else if (error.message?.includes('safety') || error.message?.includes('SAFETY')) {
        throw new Error('Content blocked by safety filters. Please rephrase your question.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error(error.message || 'Failed to get AI response. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendMessage
  };
};

export const useCodeOptimization = () => {
  const [optimizing, setOptimizing] = useState(false);

  const optimizeCode = async (code: string, language: string) => {
    if (!code || !code.trim()) {
      toast.error('Please provide code to optimize');
      return;
    }

    setOptimizing(true);
    try {
      const result = await geminiService.optimizeCode(code, language);
      
      if (geminiService.isAvailable()) {
        toast.success('Code optimization complete!');
      } else {
        toast.success('Basic optimization analysis complete! Configure Gemini API for advanced optimization.');
      }
      
      return result;
    } catch (error: any) {
      console.error('Code optimization error:', error);
      
      // Provide specific error messages with better user guidance
      if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
        toast.error('Invalid Gemini API key. Please check your configuration.');
      } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        toast.error('Gemini API quota exceeded. Try switching to CopilotKit AI or wait for quota reset.');
      } else if (error.message?.includes('safety') || error.message?.includes('SAFETY')) {
        toast.error('Content blocked by safety filters. Please try different code.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Failed to optimize code. Please try again.');
      }
      
      throw error;
    } finally {
      setOptimizing(false);
    }
  };

  return {
    optimizing,
    optimizeCode
  };
};