import React from 'react';
import { ChevronRight } from 'lucide-react';

export const MainContent: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm text-gray-600">Total</span>
              <div className="mt-1">
                <span className="text-2xl font-bold text-gray-900">0</span>
                <span className="text-sm text-gray-500 ml-2">entreprises</span>
              </div>
            </div>
            
            <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-200 transition-colors">
              Exporter la liste
            </button>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune entreprise trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Utilisez les filtres à gauche pour affiner votre recherche et découvrir des entreprises.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Commencer la recherche
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-orange-500 hover:bg-orange-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};