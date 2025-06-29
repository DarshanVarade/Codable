import { useState } from 'react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { copilotKitService } from '../lib/copilotkit';
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
        const result = await copilotKitService.generateCode(prompt, language);
        toast.success('Code generated with CopilotKit!');
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
        // Use CopilotKit for code explanation
        const explanation = await copilotKitService.chat(
          `Explain this ${language} code: ${code}`,
          `Code explanation for ${language}`
        );
        toast.success('Code explained with CopilotKit!');
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
    generateCode: copilotKitService.generateCode,
    chat: copilotKitService.chat,
  };
};

export const useCopilotKitChat = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string, context?: string) => {
    setLoading(true);
    try {
      const response = await copilotKitService.chat(message, context);
      return response;
    } catch (error) {
      toast.error('Failed to send message to CopilotKit');
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