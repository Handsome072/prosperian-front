import React, { useState, useEffect } from 'react';
import { Download, Building } from 'lucide-react';
import { BusinessCard } from './BusinessCard';
import { Business } from '@entities/Business';
import { useFilterContext } from '@contexts/FilterContext';

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
  const { setSort } = useFilterContext();
  const [displayLimit, setDisplayLimit] = useState(10); // Limite par défaut
  const [showLimitInput, setShowLimitInput] = useState(false);
  const [isListView, setIsListView] = useState(false); // Nouvel état pour la vue liste
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]); // Entreprises sélectionnées
  const [showExportPopup, setShowExportPopup] = useState(false); // État pour la popup
  const [fileName, setFileName] = useState(''); // Nom du fichier par défaut vide

  useEffect(() => {
    // Basculement de la vue selon la présence d'une recherche
    setIsListView(searchTerm.length > 0);
  }, [searchTerm]);

  const handleExport = () => {
    if (selectedBusinesses.length === 0) {
      alert("Veuillez sélectionner au moins une entreprise.");
      return;
    }
    setShowExportPopup(true); // Ouvre la popup
  };

  const confirmExport = () => {
    // Filtrer les entreprises sélectionnées
    const selectedData = businesses.filter(b => selectedBusinesses.includes(b.id));

    // Générer le contenu CSV
    const headers = ['ID', 'Nom', 'Activité', 'Adresse', 'Ville', 'Code Postal', 'Téléphone'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(b => [
        b.id,
        `"${b.name}"`,
        `"${b.activity}"`,
        `"${b.address}"`,
        `"${b.city}"`,
        b.postalCode,
        b.phone
      ].join(','))
    ].join('\n');

    // Convertir le contenu CSV en base64
    const base64Content = btoa(csvContent);

    // Stocker en localStorage avec une clé basée sur fileName
    const storageKey = `export_${fileName || `export_${Date.now()}`}`;
    localStorage.setItem(storageKey, JSON.stringify({
      csv: base64Content,
      originalName: fileName || `export_${Date.now()}`
    }));

    // Créer et télécharger le fichier avec le nom personnalisé
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName || 'entreprises_selectionnees'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fermer la popup et réinitialiser
    setShowExportPopup(false);
    setFileName('');
  };

  const cancelExport = () => {
    setShowExportPopup(false);
    setFileName('');
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setIsListView(true); // Passer à la vue liste lors du changement de tri
  };

  const handleLimitClick = () => {
    setIsListView(true); // Passer à la vue liste au clic sur le bouton displayLimit
    setShowLimitInput(true);
  };

  const handleRangeClick = () => {
    setIsListView(true); // Passer à la vue liste au clic sur le texte de plage
  };

  const handleSelectionChange = (businessId: string, isChecked: boolean) => {
    setSelectedBusinesses(prev => 
      isChecked ? [...prev, businessId] : prev.filter(id => id !== businessId)
    );
  };

  const displayedBusinesses = businesses.slice(0, displayLimit);

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
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
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{businesses.length.toLocaleString()}</div>
                <div className="text-sm text-gray-600">entreprises trouvées</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  className="border rounded px-2 py-1 text-sm"
                  onClick={handleLimitClick}
                >
                  {displayLimit}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={handleExport}
                >
                  Exporter
                </button>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={searchTerm ? 'Pertinence' : businesses.length ? 'Pertinence' : 'Pertinence'}
                  onChange={handleSortChange}
                  aria-label="Trier par"
                >
                  <option value="Pertinence">Pertinence</option>
                  <option value="Role">Rôle</option>
                  <option value="Entreprise">Entreprise</option>
                </select>
                <span
                  className="text-sm cursor-pointer"
                  onClick={handleRangeClick}
                >
                  {businesses.length > 0
                    ? `1 - ${Math.min(displayLimit, businesses.length)} sur ${businesses.length}`
                    : "0 - 0 sur 0"}
                </span>
              </div>
            </div>
            {showLimitInput && (
              <input
                type="number"
                value={displayLimit}
                onChange={(e) => setDisplayLimit(Number(e.target.value))}
                onBlur={() => setShowLimitInput(false)}
                className="border rounded px-2 py-1 text-sm w-20 mt-2"
                autoFocus
              />
            )}
          </div>
        </div>

        {/* Business Cards Grid or List */}
        {businesses.length > 0 ? (
          <>
            <div className={isListView ? 'space-y-2' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
              {displayedBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  company={business}
                  isListView={isListView}
                  onSelectionChange={handleSelectionChange}
                />
              ))}
            </div>

            {/* Load More */}
            {businesses.length > displayLimit && (
              <div className="text-center mt-8">
                <button
                  className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-300 transition-colors"
                  onClick={() => setDisplayLimit(displayLimit + 10)}
                >
                  Charger plus d'entreprises
                </button>
              </div>
            )}
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
                  : 'Aucune entreprise ne correspond aux critères sélectionnés. Essayez d\'ajouter des filtres.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="bg-[#E95C41] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          </div>
        )}

        {/* Popup pour nommer l'exportation */}
        {showExportPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Nommer la liste exportée</h2>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Entrez un nom pour le fichier"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={cancelExport}
                >
                  Annuler
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={confirmExport}
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};