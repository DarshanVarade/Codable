import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';

interface CopilotKitProviderProps {
  children: React.ReactNode;
}

const CopilotKitProvider: React.FC<CopilotKitProviderProps> = ({ children }) => {
  const COPILOTKIT_API_KEY = 'ck_pub_80f9f24df790f471aa3bf63b4992b409';

  return (
    <CopilotKit publicApiKey={COPILOTKIT_API_KEY}>
      {children}
    </CopilotKit>
  );
};

export default CopilotKitProvider;