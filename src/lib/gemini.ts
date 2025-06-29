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
    if (!code || !code.trim()) {
      throw new Error('Code content is required for analysis');
    }

    if (!language) {
      throw new Error('Programming language is required for analysis');
    }

    const prompt = `
You are an expert code analyzer powered by Gemini 2.0 Flash. Analyze the following ${language} code and provide a comprehensive analysis.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

IMPORTANT: You must respond with valid JSON only. Do not include any text before or after the JSON.

Provide your analysis in this exact JSON format:
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
        "id": "start",
        "type": "start",
        "label": "Start",
        "description": "Program entry point"
      },
      {
        "id": "process1",
        "type": "process",
        "label": "Main Logic",
        "description": "Core functionality"
      },
      {
        "id": "end",
        "type": "end",
        "label": "End",
        "description": "Program exit"
      }
    ],
    "edges": [
      {
        "from": "start",
        "to": "process1",
        "label": ""
      },
      {
        "from": "process1",
        "to": "end",
        "label": ""
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
      
      console.log('Gemini raw response:', text);
      
      // Clean the response text
      let cleanedText = text.trim();
      
      // Remove any markdown code block markers
      cleanedText = cleanedText.replace(/```json\s*/g, '');
      cleanedText = cleanedText.replace(/```\s*/g, '');
      
      // Find the JSON object in the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', cleanedText);
        throw new Error('Invalid response format from Gemini - no JSON found');
      }
      
      let jsonString = jsonMatch[0];
      
      // Try to parse the JSON
      let analysis;
      try {
        analysis = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('JSON string:', jsonString);
        
        // Fallback: create a basic analysis
        analysis = {
          score: 75,
          summary: `This ${language} code appears to be functional but needs detailed analysis.`,
          explanation: `The code has been submitted for analysis. Due to parsing issues with the AI response, a basic analysis is provided. The code structure appears to be valid ${language} syntax.`,
          suggestions: [
            {
              type: "info",
              title: "Analysis Incomplete",
              message: "The detailed analysis could not be completed. Please try again or check your code syntax."
            }
          ],
          complexity: {
            time: "O(n)",
            space: "O(1)"
          },
          flowchart: {
            nodes: [
              {
                id: "start",
                type: "start",
                label: "Start",
                description: "Program begins"
              },
              {
                id: "main",
                type: "process",
                label: "Main Logic",
                description: "Core functionality"
              },
              {
                id: "end",
                type: "end",
                label: "End",
                description: "Program ends"
              }
            ],
            edges: [
              {
                from: "start",
                to: "main",
                label: ""
              },
              {
                from: "main",
                to: "end",
                label: ""
              }
            ]
          }
        };
      }
      
      // Validate the analysis object
      if (!analysis.score) analysis.score = 75;
      if (!analysis.summary) analysis.summary = `${language} code analysis completed.`;
      if (!analysis.explanation) analysis.explanation = "Code structure appears to be valid.";
      if (!analysis.suggestions) analysis.suggestions = [];
      if (!analysis.complexity) analysis.complexity = { time: "O(n)", space: "O(1)" };
      if (!analysis.flowchart) {
        analysis.flowchart = {
          nodes: [
            { id: "start", type: "start", label: "Start", description: "Program begins" },
            { id: "main", type: "process", label: "Main Logic", description: "Core functionality" },
            { id: "end", type: "end", label: "End", description: "Program ends" }
          ],
          edges: [
            { from: "start", to: "main", label: "" },
            { from: "main", to: "end", label: "" }
          ]
        };
      }
      
      return analysis;
    } catch (error: any) {
      console.error('Error analyzing code:', error);
      
      // Check if it's an API key issue
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY environment variable.');
      }
      
      // Check if it's a quota issue
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        throw new Error('Gemini API quota exceeded. Please try again later or check your API limits.');
      }
      
      // Generic error with helpful message
      throw new Error(`Failed to analyze code: ${error.message || 'Unknown error'}. Please check your API key and try again.`);
    }
  },

  // Generate solution for programming problems - Enhanced for proper code formatting
  solveProblem: async (problemStatement: string, language: string): Promise<ProblemSolution> => {
    if (!problemStatement || !problemStatement.trim()) {
      throw new Error('Problem statement is required');
    }

    if (!language) {
      throw new Error('Programming language is required');
    }

    const prompt = `
You are an expert programmer powered by Gemini 2.0 Flash. Solve the following programming problem in ${language}.

Problem Statement:
${problemStatement}

IMPORTANT: You must respond with valid JSON only. Do not include any text before or after the JSON.

Generate clean, properly formatted ${language} code with correct syntax and indentation.

Provide your solution in this exact JSON format:
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
      
      console.log('Gemini problem solver response:', text);
      
      // Clean the response text
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\s*/g, '');
      cleanedText = cleanedText.replace(/```\s*/g, '');
      
      // Extract JSON from the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in problem solver response:', cleanedText);
        throw new Error('Invalid response format from Gemini');
      }
      
      let solution;
      try {
        solution = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parse error in problem solver:', parseError);
        
        // Fallback solution
        solution = {
          solution_code: `// Solution for: ${problemStatement}\n// Language: ${language}\n\nfunction solution() {\n    // Implementation needed\n    console.log("Problem: ${problemStatement}");\n    return "Solution placeholder";\n}`,
          explanation: "A basic solution structure has been provided. The detailed implementation could not be generated due to parsing issues.",
          execution_result: {
            success: true,
            output: "Solution placeholder",
            execution_time: "< 1ms",
            memory_usage: "< 1MB"
          },
          optimization_suggestions: [
            {
              type: "readability",
              title: "Code Structure",
              description: "Implement the actual solution logic based on the problem requirements."
            }
          ]
        };
      }
      
      // Validate solution object
      if (!solution.solution_code) {
        solution.solution_code = `// Solution for: ${problemStatement}\nfunction solution() {\n    // Implementation needed\n    return "result";\n}`;
      }
      if (!solution.explanation) {
        solution.explanation = "Solution generated for the given problem statement.";
      }
      if (!solution.execution_result) {
        solution.execution_result = {
          success: true,
          output: "Expected output",
          execution_time: "< 1ms",
          memory_usage: "< 1MB"
        };
      }
      if (!solution.optimization_suggestions) {
        solution.optimization_suggestions = [];
      }
      
      return solution;
    } catch (error: any) {
      console.error('Error solving problem:', error);
      
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY environment variable.');
      }
      
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        throw new Error('Gemini API quota exceeded. Please try again later.');
      }
      
      throw new Error(`Failed to generate solution: ${error.message || 'Unknown error'}. Please try again.`);
    }
  },

  // AI Assistant chat functionality - Enhanced for better responses
  chatWithAssistant: async (message: string, context?: string): Promise<string> => {
    if (!message || !message.trim()) {
      throw new Error('Message is required for chat');
    }

    // Analyze the user's request to determine the type of response needed
    const isCodeRequest = /write|create|generate|build|make.*code|function|class|method|algorithm/i.test(message);
    const isExplanationRequest = /explain|what.*does|how.*work|understand|clarify|describe/i.test(message);
    const isCodeReview = /review|check|analyze|debug|fix|error|bug|problem/i.test(message);
    const hasCodeInMessage = /```[\s\S]*```|`[^`]+`/.test(message);

    let prompt = '';

    if (isCodeRequest && !hasCodeInMessage) {
      // User wants code generation
      prompt = `
You are Codable AI, an expert coding assistant powered by Gemini 2.0 Flash. The user is asking for code generation.

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
You are Codable AI, an expert coding assistant powered by Gemini 2.0 Flash. The user wants an explanation.

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
You are Codable AI, an expert coding assistant powered by Gemini 2.0 Flash. The user needs code review or debugging help.

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
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini AI');
      }
      
      return text.trim();
    } catch (error: any) {
      console.error('Error in AI chat:', error);
      
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your configuration.');
      }
      
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        throw new Error('Gemini API quota exceeded. Please try again later.');
      }
      
      throw new Error(`AI chat error: ${error.message || 'Failed to get response'}. Please try again.`);
    }
  },

  // Generate code explanations
  explainCode: async (code: string, language: string): Promise<string> => {
    if (!code || !code.trim()) {
      throw new Error('Code is required for explanation');
    }

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
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini AI');
      }
      
      return text.trim();
    } catch (error: any) {
      console.error('Error explaining code:', error);
      throw new Error(`Failed to explain code: ${error.message || 'Unknown error'}. Please try again.`);
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
    if (!code || !code.trim()) {
      throw new Error('Code is required for optimization');
    }

    const prompt = `
Analyze and optimize the following ${language} code. Provide an improved version with explanations.

Original Code:
\`\`\`${language}
${code}
\`\`\`

IMPORTANT: Respond with valid JSON only.

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
      
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\s*/g, '');
      cleanedText = cleanedText.replace(/```\s*/g, '');
      
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      let optimization;
      try {
        optimization = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        // Fallback optimization
        optimization = {
          optimized_code: code, // Return original code if parsing fails
          improvements: [
            {
              type: "analysis",
              description: "Code optimization analysis could not be completed",
              impact: "Please try again for detailed optimization suggestions"
            }
          ]
        };
      }
      
      // Validate optimization object
      if (!optimization.optimized_code) {
        optimization.optimized_code = code;
      }
      if (!optimization.improvements) {
        optimization.improvements = [];
      }
      
      return optimization;
    } catch (error: any) {
      console.error('Error optimizing code:', error);
      throw new Error(`Failed to optimize code: ${error.message || 'Unknown error'}. Please try again.`);
    }
  }
};

export default geminiService;