import React from 'react';
import { Search, Filter, Download, MapPin, Building } from 'lucide-react';
import { BusinessCard } from './BusinessCard';
import { Business } from '../types/Business';

interface MainContentProps {
  businesses: Business[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  businesses,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-orange-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
                  <p className="text-sm text-gray-600">Répertoire des entreprises françaises</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{businesses.length.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">entreprises trouvées</div>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter la liste
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une entreprise, un secteur d'activité..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filtres
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-4 h-4" />
                Localisation
              </button>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              {businesses.length} résultats trouvés
              {searchTerm && ` pour "${searchTerm}"`}
            </div>
          </div>
        </div>

        {/* Business Cards Grid */}
        {businesses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} company={business} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-300 transition-colors">
                Charger plus d'entreprises
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune entreprise trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres mots-clés ou ajustez les filtres.`
                  : 'Aucune entreprise ne correspond aux critères sélectionnés. Essayez d\'ajuster les filtres.'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};