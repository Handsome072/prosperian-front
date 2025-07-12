import React, { useState } from "react";
import { Search, Filter, Download, MapPin, Building } from "lucide-react";
import { BusinessCard } from "./BusinessCard";
import { Business } from "@entities/Business";
import BusinessOptions from "./BusinessOptions";
import BusinessSummaryCard from "./BusinessSummaryCard";
import { saveAs } from 'file-saver';
import { 
  getSelectedEnterprisesCount, 
  setSelectedEnterprisesCount, 
  resetSelectedEnterprisesCount, 
  getSelectedContactsCount 
} from "../../../../utils/localStorageCounters";
import { calculateSelectedEntrepriseStats } from "../../../../utils/selectionStats";

export interface MainContentProps {
  businesses: Business[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showCheckbox?: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({ businesses, searchTerm, onSearchChange, showCheckbox }) => {
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [layout, setLayout] = useState<'list' | 'grid'>(showCheckbox ? 'list' : 'grid');
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<number>>(new Set());
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [exportFileName, setExportFileName] = React.useState('ma_liste');
  const [storedEnterprisesCount, setStoredEnterprisesCount] = useState(0);
  const [storedContactsCount, setStoredContactsCount] = useState(0);

  // Si showCheckbox passe à true, on force le layout à 'list'
  React.useEffect(() => {
    if (showCheckbox) setLayout('list');
  }, [showCheckbox]);

  // Charger les compteurs depuis localStorage au montage
  React.useEffect(() => {
    const enterprisesCount = getSelectedEnterprisesCount();
    const contactsCount = getSelectedContactsCount();
    setStoredEnterprisesCount(isNaN(enterprisesCount) ? 0 : enterprisesCount);
    setStoredContactsCount(isNaN(contactsCount) ? 0 : contactsCount);
  }, []);

  // Mettre à jour le localStorage quand selectedBusinesses change
  React.useEffect(() => {
    const count = selectedBusinesses.size;
    setSelectedEnterprisesCount(count);
    setStoredEnterprisesCount(count);
  }, [selectedBusinesses.size]);

  const handleCheckboxChange = (id: number) => {
    setSelectedBusinesses(prev => {
      const newSet = new Set(prev);
      const numId = Number(id);
      if (newSet.has(numId)) {
        newSet.delete(numId);
      } else {
        newSet.add(numId);
      }
      return newSet;
    });
  };

  const total = businesses.length;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  // slice the array for the current page
  const paginatedList = businesses.slice(start - 1, end);

  // Exporter les entreprises sélectionnées en CSV
  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleExportConfirm = () => {
    const listName = exportFileName.trim() || 'ma_liste';
    const selected = businesses.filter(b => selectedBusinesses.has(Number(b.id)));
    if (selected.length === 0) {
      setShowExportModal(false);
      return;
    }
    // Générer le CSV (même méthode que Contact)
    const headers = [
      'Nom',
      'Activité',
      'Ville',
      'Adresse',
      'Code Postal',
      'Téléphone',
      'Forme Juridique',
      'Description',
      'Année de création',
      'Nombre employés',
      'Chiffre d\'affaires',
    ];
    const rows = selected.map(b => [
      b.name,
      b.activity,
      b.city,
      b.address,
      b.postalCode,
      b.phone,
      b.legalForm,
      b.description,
      b.foundedYear,
      b.employeeCount,
      b.revenue,
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(val => (val ?? '').toString().replace(/"/g, '""')).map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${listName}.csv`);
    // Stocker le CSV en base64 dans localStorage
    const base64Content = btoa(unescape(encodeURIComponent(csvContent)));
    localStorage.setItem(`export_${listName}`, base64Content);
    setShowExportModal(false);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <BusinessSummaryCard businesses={businesses} />
        <BusinessOptions
          businesses={businesses}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          start={start}
          end={end}
          onPageChange={setCurrentPage}
          layout={layout}
          setLayout={setLayout}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
            setLayout('list');
          }}
          onExport={handleExport}
          selectedIds={Array.from(selectedBusinesses)}
          storedEnterprisesCount={storedEnterprisesCount}
          storedContactsCount={storedContactsCount}
        />
        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Exporter la liste</h2>
              <label className="block text-sm text-gray-700 mb-2">Nom du fichier :</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={exportFileName}
                onChange={e => setExportFileName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowExportModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 rounded bg-[#E95C41] text-white hover:bg-orange-600"
                  onClick={handleExportConfirm}
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Business Cards Grid */}
        {paginatedList.length > 0 ? (
          <>
            {layout === 'list' && (
              <div className="flex items-center gap-2 px-3 pt-3 pb-2 text-xs font-semibold text-gray-500 uppercase bg-white border-t border-l border-r border-gray-200 rounded-t-lg">
                <span className="w-4" /> {/* Checkbox */}
                <span className="w-8" /> {/* Logo */}
                <span className="flex-1 min-w-0">Nom</span>
                <span className="w-32 text-center">&nbsp;</span> {/* Icônes */}
                <span className="w-20 text-center"># Contacts</span>
                <span className="w-20 text-center"># Employés</span>
                <span className="w-24 text-center">CA</span>
                <span className="w-32 text-right">Adresse</span>
              </div>
            )}
            <div className={layout === 'list' ? 'divide-y bg-white rounded-lg border border-gray-200 max-h-[calc(100vh-12rem)] overflow-y-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-12rem)] overflow-y-auto'}>
              {paginatedList.map((business) => {
                const numId = Number(business.id);
                // Si showCheckbox est true, toujours afficher avec checkbox
                if (showCheckbox) {
                  return (
                    <BusinessCard
                      key={numId}
                      company={business}
                      id={numId}
                      showCheckbox
                      checked={selectedBusinesses.has(numId)}
                      onCheckboxChange={handleCheckboxChange}
                    />
                  );
                }
                // Sinon, comportement normal
                return layout === 'list' ? (
                  <BusinessCard
                    key={numId}
                    company={business}
                    id={numId}
                    showCheckbox
                    checked={selectedBusinesses.has(numId)}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ) : (
                  <BusinessCard key={numId} company={business} />
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres mots-clés ou ajustez les filtres.`
                  : "Aucune entreprise ne correspond aux critères sélectionnés. Essayez d'ajuster les filtres."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => onSearchChange("")}
                  className="bg-[#E95C41] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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
