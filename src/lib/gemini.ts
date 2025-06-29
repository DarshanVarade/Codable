import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key is required. Please set VITE_GEMINI_API_KEY in your environment variables.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Get the Gemini 2.0 Flash model
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048, // Reduced for shorter responses
  }
});

export interface CodeAnalysisResult {
  score: number;
  summary: string;
  explanation: string;
  suggestions: Array<{
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
  }>;
  complexity: {
    time: string;
    space: string;
  };
  flowchart?: {
    nodes: Array<{
      id: string;
      type: 'start' | 'process' | 'decision' | 'end';
      label: string;
      description?: string;
    }>;
    edges: Array<{
      from: string;
      to: string;
      label?: string;
    }>;
  };
}

export interface ProblemSolution {
  solution_code: string;
  explanation: string;
  execution_result: {
    success: boolean;
    output?: string;
    error?: string;
    execution_time?: string;
    memory_usage?: string;
  };
  optimization_suggestions: Array<{
    type: 'performance' | 'readability' | 'best_practice';
    title: string;
    description: string;
    code_example?: string;
  }>;
}

export const geminiService = {
  // Analyze code with comprehensive insights
  analyzeCode: async (code: string, language: string): Promise<CodeAnalysisResult> => {
    const prompt = `
You are an expert code analyzer powered by Gemini 2.0 Flash. Analyze the following ${language} code and provide a comprehensive analysis.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Please provide a detailed analysis in the following JSON format:
{
  "score": <number between 0-100>,
  "summary": "<brief summary of what the code does>",
  "explanation": "<detailed step-by-step explanation>",
  "suggestions": [
    {
      "type": "success|warning|error|info",
      "title": "<suggestion title>",
      "message": "<detailed suggestion message>"
    }
  ],
  "complexity": {
    "time": "<time complexity in Big O notation>",
    "space": "<space complexity in Big O notation>"
  },
  "flowchart": {
    "nodes": [
      {
        "id": "<unique_id>",
        "type": "start|process|decision|end",
        "label": "<node label>",
        "description": "<optional description>"
      }
    ],
    "edges": [
      {
        "from": "<node_id>",
        "to": "<node_id>",
        "label": "<optional edge label>"
      }
    ]
  }
}

Focus on:
- Code quality and best practices
- Performance optimization opportunities
- Security considerations
- Readability and maintainability
- Potential bugs or issues
- Algorithm efficiency
- Generate a logical flowchart representation

Provide actionable insights and be constructive in your feedback.
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw new Error('Failed to analyze code. Please try again.');
    }
  },

  // Generate solution for programming problems
  solveProblem: async (problemStatement: string, language: string): Promise<ProblemSolution> => {
    const prompt = `
You are an expert programmer powered by Gemini 2.0 Flash. Solve the following programming problem in ${language}.

Problem Statement:
${problemStatement}

Please provide a complete solution in the following JSON format:
{
  "solution_code": "<complete, working code solution>",
  "explanation": "<detailed explanation of the solution approach>",
  "execution_result": {
    "success": true,
    "output": "<expected output>",
    "execution_time": "<estimated execution time>",
    "memory_usage": "<estimated memory usage>"
  },
  "optimization_suggestions": [
    {
      "type": "performance|readability|best_practice",
      "title": "<optimization title>",
      "description": "<detailed description>",
      "code_example": "<optional improved code example>"
    }
  ]
}

Requirements:
- Write clean, well-commented code
- Include proper error handling
- Follow best practices for ${language}
- Provide efficient algorithms
- Include input validation where appropriate
- Make the code production-ready

Focus on correctness, efficiency, and readability.
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const solution = JSON.parse(jsonMatch[0]);
      return solution;
    } catch (error) {
      console.error('Error solving problem:', error);
      throw new Error('Failed to generate solution. Please try again.');
    }
  },

  // AI Assistant chat functionality - optimized for short responses
  chatWithAssistant: async (message: string, context?: string): Promise<string> => {
    const prompt = `
You are CodeOrbit AI, an intelligent coding assistant powered by Gemini 2.0 Flash. You help developers with coding questions.

IMPORTANT: Keep responses SHORT and CONCISE. Maximum 3-4 sentences. Be direct and helpful.

${context ? `Context: ${context}` : ''}

User message: ${message}

Provide a brief, helpful response. Use bullet points for lists. Be encouraging but concise.
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  },

  // Generate code explanations
  explainCode: async (code: string, language: string): Promise<string> => {
    const prompt = `
Explain the following ${language} code in a clear, educational manner. Keep it concise but informative.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a brief explanation that covers:
- What the code does overall
- Key concepts used
- Any important notes

Keep response under 200 words. Use markdown formatting.
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error explaining code:', error);
      throw new Error('Failed to explain code. Please try again.');
    }
  },

  // Generate optimization suggestions
  optimizeCode: async (code: string, language: string): Promise<{
    optimized_code: string;
    improvements: Array<{
      type: string;
      description: string;
      impact: string;
    }>;
  }> => {
    const prompt = `
Analyze and optimize the following ${language} code. Provide an improved version with explanations.

Original Code:
\`\`\`${language}
${code}
\`\`\`

Please provide the response in JSON format:
{
  "optimized_code": "<improved version of the code>",
  "improvements": [
    {
      "type": "<type of improvement>",
      "description": "<what was improved>",
      "impact": "<performance/readability impact>"
    }
  ]
}

Focus on:
- Performance optimizations
- Code readability
- Best practices
- Security improvements
- Memory efficiency
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error optimizing code:', error);
      throw new Error('Failed to optimize code. Please try again.');
    }
  }
};

export default geminiService;