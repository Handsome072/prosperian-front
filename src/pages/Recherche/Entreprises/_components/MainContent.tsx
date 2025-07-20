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
import { ExportService } from '../../../../services/exportService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export interface MainContentProps {
  businesses: Business[];
  leads: any[]; // Ajout de la prop leads pour accès aux objets complets
  totalBusinesses: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showCheckbox?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  totalLeads?: number;
  failedCategories?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  businesses, 
  leads, // Ajout
  totalBusinesses,
  searchTerm, 
  onSearchChange, 
  showCheckbox,
  loading = false,
  error = null,
  onRetry,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 12,
  totalLeads = 0,
  failedCategories = 0,
  onPageChange,
  onItemsPerPageChange
}) => {
  const navigate = useNavigate();
  // pagination state
  const [layout, setLayout] = useState<'list' | 'grid'>(showCheckbox ? 'list' : 'grid');
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(new Set());
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [exportFileName, setExportFileName] = React.useState('ma_liste');
  const [storedEnterprisesCount, setStoredEnterprisesCount] = useState(0);
  const [storedContactsCount, setStoredContactsCount] = useState(0);
  const [allowedNames, setAllowedNames] = useState<string[] | null>(null);
  const [importedLists, setImportedLists] = useState<any[]>([]); // À adapter selon ta source

  // Exemple de récupération des listes importées (à adapter selon ton flux)
  // useEffect(() => {
  //   axios.get('/api/list/import').then(res => setImportedLists(res.data));
  // }, []);

  const handleListClick = async (listId: string) => {
    console.log('Bouton liste cliqué, id utilisé pour API:', listId);
    try {
      const res = await axios.get(`/api/list/${listId}/first-column`);
      console.log('Réponse API first-column:', res.data);
      setAllowedNames(res.data);
    } catch (err) {
      setAllowedNames(null);
      console.error('Erreur lors de la récupération des noms d\'entreprise:', err);
      alert("Erreur lors de la récupération des noms d'entreprise !");
    }
  };

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
      const stringId = String(id);
      if (newSet.has(stringId)) {
        newSet.delete(stringId);
      } else {
        newSet.add(stringId);
      }
      return newSet;
    });
  };

  const total = totalLeads || businesses.length;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  // Exporter les entreprises sélectionnées en CSV
  const handleExport = () => {
    setShowExportModal(true);
  };

  // Ajout : Export direct avec nom par défaut (pour ExportModalGlobal)
  const handleDirectExport = () => {
    // Générer 2x 8 chiffres aléatoires
    const randomDigits1 = Math.floor(10000000 + Math.random() * 90000000);
    const randomDigits2 = Math.floor(10000000 + Math.random() * 90000000);
    const fileName = `export_${randomDigits1}-${randomDigits2}`;
    // Trouver les index sélectionnés
    const selectedIndexes = businesses
      .map((b, idx) => selectedBusinesses.has(b.id) ? idx : -1)
      .filter(idx => idx !== -1);
    // Utiliser leads pour récupérer les objets complets
    const selectedLeads = selectedIndexes.map(idx => leads[idx]);
    if (selectedLeads.length === 0) {
      setShowExportModal(false);
      return;
    }
    ExportService.exportSelectedBusinesses(selectedLeads, fileName);
    setShowExportModal(false);
    navigate('/recherche/export');
  };

  const handleExportConfirm = () => {
    const listName = exportFileName.trim() || 'ma_liste';
    // Trouver les index sélectionnés
    const selectedIndexes = businesses
      .map((b, idx) => selectedBusinesses.has(b.id) ? idx : -1)
      .filter(idx => idx !== -1);
    // Utiliser leads pour récupérer les objets complets
    const selectedLeads = selectedIndexes.map(idx => leads[idx]);
    if (selectedLeads.length === 0) {
      setShowExportModal(false);
      return;
    }
    ExportService.exportSelectedBusinesses(selectedLeads, listName);
    setShowExportModal(false);
    navigate('/recherche/export');
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <BusinessSummaryCard businesses={businesses} totalBusinesses={totalBusinesses} />
        

        
        <BusinessOptions
          businesses={businesses}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          start={start}
          end={end}
          totalPages={totalPages}
          totalItems={totalLeads}
          onPageChange={onPageChange || (() => {})}
          layout={layout}
          setLayout={setLayout}
          onItemsPerPageChange={onItemsPerPageChange || (() => {})}
          // Remplacer handleExport par handleDirectExport pour l'export direct
          onExport={handleDirectExport}
          selectedIds={Array.from(selectedBusinesses).map(id => Number(id))}
          storedEnterprisesCount={storedEnterprisesCount}
          storedContactsCount={storedContactsCount}
        />
        
        {/* Boutons de listes importées */}
        {importedLists.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {importedLists.map((list) => {
              console.log('Affichage bouton liste, id:', list.id, 'nom:', list.nom);
              return (
                <button
                  key={list.id}
                  className="text-white text-sm font-normal py-1 px-3 rounded-full transition hover:opacity-90 truncate max-w-full"
                  type="button"
                  title={list.nom}
                  style={{ background: 'linear-gradient(to right, #141838, #2a2f5a)' }}
                  onClick={() => handleListClick(list.id)}
                >
                  {list.nom}
                </button>
              );
            })}
          </div>
        )}

        {/* États de chargement et d'erreur */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <style>{`
              @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
              .animate-spin-reverse { animation: spin-reverse 1s linear infinite; }
            `}</style>
            <div className="relative w-12 h-12 mb-2">
              <div className="absolute inset-0 rounded-full border-4 border-orange-400 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-[#E95C41] border-b-transparent animate-spin-reverse"></div>
            </div>
            <span className="ml-2 text-gray-600">Chargement des entreprises...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-800">Erreur: {error}</p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Réessayer
              </button>
            )}
          </div>
        )}
        
        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
              <h2 className="text-lg font-bold mb-4 text-gray-900"></h2>
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
        
        {/* Business Cards Grid - Affichage optimisé */}
        {!loading && !error && businesses.length > 0 && (
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
            <div className={
              layout === 'list'
                ? 'divide-y bg-white rounded-lg border border-gray-200 max-h-[calc(100vh-12rem)] overflow-y-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-12rem)] overflow-y-auto'
            }>
              {/* Affichage filtré des BusinessCard */}
              {(allowedNames ? businesses.filter(b => allowedNames.includes(b.name)) : businesses).map((business, idx) => {
                const numId = Number(business.id);
                // Si showCheckbox est true, toujours afficher avec checkbox
                if (showCheckbox) {
                  return (
                    <BusinessCard
                      key={`${business.id}-${idx}`}
                      company={business}
                      id={numId}
                      showCheckbox
                      checked={selectedBusinesses.has(business.id)}
                      onCheckboxChange={handleCheckboxChange}
                      isProntoData={true}
                      loading={loading}
                    />
                  );
                }
                // Sinon, comportement normal
                return layout === 'list' ? (
                  <BusinessCard
                    key={`${business.id}-${idx}`}
                    company={business}
                    id={numId}
                    showCheckbox
                    checked={selectedBusinesses.has(business.id)}
                    onCheckboxChange={handleCheckboxChange}
                    isProntoData={true}
                    loading={loading}
                  />
                ) : (
                  <BusinessCard key={`${business.id}-${idx}`} company={business} isProntoData={true} loading={loading} />
                );
              })}
            </div>
          </>
        )}
        
        {/* État vide - seulement si pas en chargement et pas d'erreur */}
        {!loading && !error && businesses.length === 0 && (
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
