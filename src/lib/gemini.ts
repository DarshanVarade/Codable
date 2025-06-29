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
    maxOutputTokens: 2048,
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

  // Generate solution for programming problems - Enhanced for proper code formatting
  solveProblem: async (problemStatement: string, language: string): Promise<ProblemSolution> => {
    const prompt = `
You are an expert programmer powered by Gemini 2.0 Flash. Solve the following programming problem in ${language}.

Problem Statement:
${problemStatement}

IMPORTANT: Generate clean, properly formatted ${language} code with correct syntax and indentation.

Please provide a complete solution in the following JSON format:
{
  "solution_code": "<complete, working ${language} code solution with proper formatting and syntax>",
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

Requirements for ${language} code:
- Write clean, well-commented code with proper indentation
- Use correct ${language} syntax and conventions
- Include proper error handling where appropriate
- Follow best practices for ${language}
- Provide efficient algorithms
- Include input validation where appropriate
- Make the code production-ready
- Ensure proper formatting and readability

Focus on correctness, efficiency, and readability. The code should be ready to run in a ${language} environment.
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

  // AI Assistant chat functionality - Enhanced for better responses
  chatWithAssistant: async (message: string, context?: string): Promise<string> => {
    // Analyze the user's request to determine the type of response needed
    const isCodeRequest = /write|create|generate|build|make.*code|function|class|method|algorithm/i.test(message);
    const isExplanationRequest = /explain|what.*does|how.*work|understand|clarify|describe/i.test(message);
    const isCodeReview = /review|check|analyze|debug|fix|error|bug|problem/i.test(message);
    const hasCodeInMessage = /```[\s\S]*```|`[^`]+`/.test(message);

    let prompt = '';

    if (isCodeRequest && !hasCodeInMessage) {
      // User wants code generation
      prompt = `
You are Codable AI, an expert coding assistant. The user is asking for code generation.

User request: ${message}
${context ? `Context: ${context}` : ''}

Provide ONLY the requested code with minimal explanation. Format your response as:

\`\`\`[language]
[clean, working code here]
\`\`\`

Brief explanation: [1-2 sentences about what the code does]

Keep it concise and focused on the code they requested.
`;
    } else if (isExplanationRequest || hasCodeInMessage) {
      // User wants explanation or has code to explain
      prompt = `
You are Codable AI, an expert coding assistant. The user wants an explanation.

User request: ${message}
${context ? `Context: ${context}` : ''}

Provide a clear, detailed explanation. If there's code involved, break it down step by step. 
Use markdown formatting for better readability.

Focus on:
- Clear explanations
- Step-by-step breakdown if applicable
- Key concepts and logic
- Best practices mentioned

Be thorough but concise.
`;
    } else if (isCodeReview) {
      // User wants code review/debugging
      prompt = `
You are Codable AI, an expert coding assistant. The user needs code review or debugging help.

User request: ${message}
${context ? `Context: ${context}` : ''}

Provide:
1. **Issues Found**: List any bugs, errors, or problems
2. **Fixes**: Show corrected code if needed
3. **Improvements**: Suggest optimizations or best practices
4. **Explanation**: Explain what was wrong and why

Use code blocks for any code examples. Be specific and actionable.
`;
    } else {
      // General programming question
      prompt = `
You are Codable AI, an expert coding assistant powered by Gemini 2.0 Flash.

User question: ${message}
${context ? `Context: ${context}` : ''}

Provide a helpful, accurate response. If the question involves code, include relevant code examples.
If it's a concept question, explain clearly with examples.

Keep responses focused and practical. Use markdown formatting for better readability.
`;
    }

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

  // Generate optimization suggestions - Enhanced for better code formatting
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
  "optimized_code": "<improved version of the ${language} code with proper formatting and syntax>",
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
- Code readability improvements
- Best practices for ${language}
- Security improvements
- Memory efficiency
- Proper ${language} syntax and formatting
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