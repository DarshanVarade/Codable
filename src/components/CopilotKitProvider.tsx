import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { copilotKitConfig } from '../lib/copilotkit';

interface CopilotKitProviderProps {
  children: React.ReactNode;
}

const CopilotKitProvider: React.FC<CopilotKitProviderProps> = ({ children }) => {
  return (
    <CopilotKit publicApiKey={copilotKitConfig.publicApiKey}>
      {children}
    </CopilotKit>
  );
};

export default CopilotKitProvider;