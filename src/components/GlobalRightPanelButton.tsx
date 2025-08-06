import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useRightPanel } from '../contexts/RightPanelContext';

export const GlobalRightPanelButton: React.FC = () => {
  const { isRightPanelVisible, toggleRightPanel } = useRightPanel();

  return (
    <button
      onClick={toggleRightPanel}
      className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      title={isRightPanelVisible ? "Masquer les statistiques" : "Afficher les statistiques"}
    >
      <BarChart3 className="w-6 h-6" />
    </button>
  );
}; 