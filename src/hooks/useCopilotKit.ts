import { useState } from 'react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useCopilotKitIntegration = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Make user context readable by CopilotKit
  useCopilotReadable({
    description: 'Current user information',
    value: user ? {
      id: user.id,
      email: user.email,
      isAuthenticated: true
    } : {
      isAuthenticated: false
    }
  });

  // Define actions that CopilotKit can perform
  useCopilotAction({
    name: 'generateCode',
    description: 'Generate code based on user requirements',
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'The code generation prompt',
        required: true,
      },
      {
        name: 'language',
        type: 'string',
        description: 'Programming language',
        required: true,
      },
    ],
    handler: async ({ prompt, language }) => {
      setLoading(true);
      try {
        // Placeholder response - CopilotKit requires backend proxy for full functionality
        const result = {
          code: `// CopilotKit code generation for: ${prompt}\n// Language: ${language}\n// Note: Full CopilotKit integration requires a backend proxy`,
          explanation: `Code generation placeholder for ${language}. To enable full CopilotKit functionality, please set up a backend proxy endpoint.`
        };
        toast.success('Code generation placeholder created!');
        return result;
      } catch (error) {
        toast.error('Failed to generate code');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  useCopilotAction({
    name: 'explainCode',
    description: 'Explain code functionality',
    parameters: [
      {
        name: 'code',
        type: 'string',
        description: 'The code to explain',
        required: true,
      },
      {
        name: 'language',
        type: 'string',
        description: 'Programming language',
        required: true,
      },
    ],
    handler: async ({ code, language }) => {
      setLoading(true);
      try {
        // Placeholder response - CopilotKit requires backend proxy for full functionality
        const explanation = `This ${language} code explanation is a placeholder. To enable full CopilotKit functionality with real AI responses, please set up a backend proxy endpoint for CopilotKit API calls.`;
        toast.success('Code explanation placeholder created!');
        return { explanation };
      } catch (error) {
        toast.error('Failed to explain code');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    loading,
  };
};

export const useCopilotKitChat = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string, context?: string) => {
    setLoading(true);
    try {
      // CopilotKit chat requires a backend proxy for API calls
      // Return a helpful message explaining the limitation
      const response = `**CopilotKit Integration Notice**

I'm a CopilotKit-powered assistant, but I need a backend proxy to provide full AI responses. 

**Your message**: ${message}

**What you can do**:
1. **Switch to Gemini**: Use the AI provider switch in the navbar to use Gemini 2.0 Flash for full AI functionality
2. **Set up backend proxy**: To enable full CopilotKit functionality, you'll need to set up a backend endpoint that proxies requests to CopilotKit's API

**Current limitation**: Direct client-side calls to CopilotKit's API are not supported with public API keys for security reasons.

Try switching to Gemini for immediate AI assistance! 🚀`;

      return response;
    } catch (error) {
      toast.error('CopilotKit requires backend proxy setup');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendMessage,
  };
};