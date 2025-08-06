import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RightPanelContextType {
  isRightPanelVisible: boolean;
  setIsRightPanelVisible: (visible: boolean) => void;
  toggleRightPanel: () => void;
}

const RightPanelContext = createContext<RightPanelContextType | undefined>(undefined);

export const useRightPanel = () => {
  const context = useContext(RightPanelContext);
  if (context === undefined) {
    throw new Error('useRightPanel must be used within a RightPanelProvider');
  }
  return context;
};

interface RightPanelProviderProps {
  children: ReactNode;
}

export const RightPanelProvider: React.FC<RightPanelProviderProps> = ({ children }) => {
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);

  const toggleRightPanel = () => {
    setIsRightPanelVisible(!isRightPanelVisible);
  };

  return (
    <RightPanelContext.Provider value={{
      isRightPanelVisible,
      setIsRightPanelVisible,
      toggleRightPanel
    }}>
      {children}
    </RightPanelContext.Provider>
  );
}; 