import React, { useState } from 'react';
import { Search, Filter, Download, MapPin, Building } from 'lucide-react';
import { BusinessCard } from './BusinessCard';

const mockBusinesses = [
  {
    id: '1',
    name: 'SUEZ RV ILE-DE-FRANCE',
    address: '16 RUE COLONEL FABIEN',
    city: 'PARIS',
    postalCode: '75010',
    phone: '01 42 85 85 85',
    employees: '1000-4999 salariés',
    activity: 'Gestion des déchets',
    description: 'Collecte, traitement et valorisation des déchets. Spécialiste en économie circulaire et services environnementaux.',
    rating: 4.2
  },
  {
    id: '2',
    name: 'QUERUIT',
    address: '25 RUE DE LA PAIX',
    city: 'LYON',
    postalCode: '69001',
    phone: '04 78 28 28 28',
    employees: '50-199 salariés',
    activity: 'Conseil en ingénierie',
    description: 'Conseil en ingénierie et études techniques. Accompagnement des entreprises dans leurs projets innovants.',
    rating: 4.5
  },
  {
    id: '3',
    name: 'SOC ALSACIENNE DE CAFES',
    address: '12 RUE DU COMMERCE',
    city: 'STRASBOURG',
    postalCode: '67000',
    phone: '03 88 15 15 15',
    employees: '200-499 salariés',
    activity: 'Torréfaction de café',
    description: 'Torréfaction et distribution de café. Expertise dans la sélection et le traitement des grains de café premium.',
    rating: 4.8
  },
  {
    id: '4',
    name: 'TECHNOLOGIE AVANCEE',
    address: '45 AVENUE DES CHAMPS',
    city: 'MARSEILLE',
    postalCode: '13001',
    phone: '04 91 55 55 55',
    employees: '10-49 salariés',
    activity: 'Développement logiciel',
    description: 'Développement de solutions logicielles sur mesure. Spécialiste en intelligence artificielle et transformation digitale.',
    rating: 4.3
  },
  {
    id: '5',
    name: 'CONSTRUCTION MODERNE',
    address: '78 RUE DE LA RÉPUBLIQUE',
    city: 'TOULOUSE',
    postalCode: '31000',
    phone: '05 61 25 25 25',
    employees: '500-999 salariés',
    activity: 'BTP et construction',
    description: 'Construction et rénovation de bâtiments. Expertise en construction durable et éco-responsable.',
    rating: 4.1
  },
  {
    id: '6',
    name: 'SERVICES FINANCIERS PLUS',
    address: '33 BOULEVARD SAINT-GERMAIN',
    city: 'PARIS',
    postalCode: '75005',
    phone: '01 43 29 29 29',
    employees: '100-199 salariés',
    activity: 'Services financiers',
    description: 'Conseil financier et gestion de patrimoine. Accompagnement des entreprises et particuliers.',
    rating: 4.6
  }
];

export const BusinessDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredBusinesses = mockBusinesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-[#E95C41]" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
                  <p className="text-sm text-gray-600">Répertoire des entreprises françaises</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">31 838 477</div>
                  <div className="text-sm text-gray-600">entreprises référencées</div>
                </div>
                <button className="bg-[#E95C41] hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredBusinesses.length} résultats trouvés
              {searchTerm && ` pour "${searchTerm}"`}
            </div>
          </div>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} company={business} />
          ))}
        </div>

        {/* Load More */}
        {filteredBusinesses.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-300 transition-colors">
              Charger plus d'entreprises
            </button>
          </div>
        )}
      </div>
    </div>
  );
};