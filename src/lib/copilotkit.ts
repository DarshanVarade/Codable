import { CopilotKit } from '@copilotkit/react-core';

const COPILOTKIT_API_KEY = 'ck_pub_80f9f24df790f471aa3bf63b4992b409';

export const copilotKitConfig = {
  publicApiKey: COPILOTKIT_API_KEY,
  // You can add more configuration options here
  chatApiEndpoint: '/api/copilotkit/chat', // This would be your backend endpoint
};

// CopilotKit service for enhanced AI interactions
export const copilotKitService = {
  // Initialize CopilotKit with your API key
  init: () => {
    return {
      publicApiKey: COPILOTKIT_API_KEY,
    };
  },

  // Enhanced code generation with CopilotKit
  generateCode: async (prompt: string, language: string) => {
    try {
      // Use CopilotKit's API directly
      const response = await fetch('https://api.copilotkit.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${COPILOTKIT_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a helpful coding assistant. Generate clean, working ${language} code based on the user's request.`
            },
            {
              role: 'user',
              content: `Generate ${language} code for: ${prompt}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`CopilotKit API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedCode = data.choices?.[0]?.message?.content || 'No code generated';

      return {
        code: generatedCode,
        explanation: `Code generated using CopilotKit for: ${prompt}`
      };
    } catch (error) {
      console.error('CopilotKit code generation error:', error);
      throw new Error('Failed to generate code with CopilotKit');
    }
  },

  // Enhanced chat with CopilotKit
  chat: async (message: string, context?: string) => {
    try {
      const systemMessage = context 
        ? `You are a helpful coding assistant. Context: ${context}`
        : 'You are a helpful coding assistant. Provide clear, concise answers about programming concepts, code explanations, debugging help, and best practices.';

      const response = await fetch('https://api.copilotkit.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${COPILOTKIT_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemMessage
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`CopilotKit API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('CopilotKit chat error:', error);
      throw new Error('Failed to get response from CopilotKit');
    }
  }
};

export default copilotKitService;