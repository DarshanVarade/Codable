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

    setAnalyzing(true);
    try {
      // Get AI analysis
      const analysis = await geminiService.analyzeCode(code, language);
      setResult(analysis);

      // Save to database
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

      toast.success('Code analysis complete!');
      return analysis;
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze code');
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

    setSolving(true);
    try {
      // Get AI solution
      const result = await geminiService.solveProblem(problemStatement, language);
      setSolution(result);

      // Save to database
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

      toast.success('Solution generated successfully!');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate solution');
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

    setLoading(true);
    try {
      // Create conversation if needed
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        const { data: conversation } = await db.createConversation(user.id);
        currentConversationId = conversation?.id;
      }

      if (!currentConversationId) {
        throw new Error('Failed to create conversation');
      }

      // Add user message
      await db.addMessage(currentConversationId, 'user', message);

      // Get AI response
      const aiResponse = await geminiService.chatWithAssistant(message, context);

      // Add AI response
      await db.addMessage(currentConversationId, 'assistant', aiResponse);

      return {
        conversationId: currentConversationId,
        response: aiResponse
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      throw error;
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
    setOptimizing(true);
    try {
      const result = await geminiService.optimizeCode(code, language);
      toast.success('Code optimization complete!');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to optimize code');
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