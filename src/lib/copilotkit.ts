import { CopilotKit } from '@copilotkit/react-core';

const COPILOTKIT_API_KEY = 'ck_pub_80f9f24df790f471aa3bf63b4992b409';

export const copilotKitConfig = {
  publicApiKey: COPILOTKIT_API_KEY,
  // You can add more configuration options here
  chatApiEndpoint: '/api/copilotkit/chat', // This would be your backend endpoint
};

// Note: Direct API calls to CopilotKit require a backend proxy
// The public API key is intended for use with CopilotKit SDK components
export default copilotKitConfig;