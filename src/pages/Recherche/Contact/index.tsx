import React, { useState, useEffect } from "react";
import { Building, Linkedin } from "lucide-react";
import { useFilterContext } from "@contexts/FilterContext";
import { saveAs } from "file-saver";
import ExportModalGlobal from "../../../components/ExportModalGlobal";
import { 
  getSelectedContactsCount, 
  setSelectedContactsCount, 
  resetSelectedContactsCount, 
  getSelectedEnterprisesCount 
} from "../../../utils/localStorageCounters";
import { calculateSelectedContactStats } from "../../../utils/selectionStats";

const Contact: React.FC = () => {
  const {
    filteredContacts,
    headerStats,
    postes,
    niveaux,
    setSort,
    filters,
    setFilters,
  } = useFilterContext();
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [showLimitInput, setShowLimitInput] = useState(false);
  const [currentSort, setCurrentSort] = useState("Pertinence");
  const [storedContactsCount, setStoredContactsCount] = useState(0);
  const [storedEnterprisesCount, setStoredEnterprisesCount] = useState(0);

  useEffect(() => {
    console.log("Filtered Contacts:", filteredContacts); // Debug: Check rendered data
  }, [filteredContacts]);

  // Charger le compteur depuis localStorage au montage
  useEffect(() => {
    setStoredContactsCount(getSelectedContactsCount());
    setStoredEnterprisesCount(getSelectedEnterprisesCount());
  }, []);

  // Mettre à jour le localStorage quand selectedContacts change
  useEffect(() => {
    setSelectedContactsCount(selectedContacts.size);
    setStoredContactsCount(selectedContacts.size);
  }, [selectedContacts.size]);

  // Handle checkbox change for individual contacts
  const handleCheckboxChange = (index: number) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // Handle export button click to show popup
  const handleExport = () => {
    if (selectedContacts.size > 0) setShowExportPopup(true);
    else alert("No contacts selected for export.");
  };

  // Nouvelle fonction d'export (à adapter selon besoin)
  const handleConfirmExport = () => {
    // ... logique d'export CSV ou API ...
    setShowExportPopup(false);
    setSelectedContacts(new Set());
  };

  // Handle sort change and update currentSort
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSort(sortValue);
    setCurrentSort(sortValue);
    setSelectedContacts(new Set());
    resetSelectedContactsCount(); // Reset le compteur localStorage
  };

  // Statistiques pour le popup (version globale)
  const statsEntreprise = {
    total: headerStats.totalEntreprises || 0,
  };
  const statsContact = {
    total: headerStats.totalContacts || 0,
    entreprises: headerStats.totalEntreprises || 0,
    contactsDirectEmail: headerStats.contactsDirects.avecEmail || 0,
    contactsDirectLinkedin: headerStats.contactsDirects.avecLinkedIn || 0,
    contactsGeneriquesTel: headerStats.contactsGeneriques.avecTelephone || 0,
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-gray-500">Contacts</div>
          <div className="text-xl font-bold">{headerStats.totalContacts}</div>
          <div className="text-gray-400 text-sm">Entreprises : {headerStats.totalEntreprises}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-gray-500 mb-1">Contacts directs</div>
          <div className="flex justify-between text-sm">
            <span>Avec email :</span>
            <span className="font-semibold">{headerStats.contactsDirects.avecEmail}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Avec LinkedIn :</span>
            <span className="font-semibold">{headerStats.contactsDirects.avecLinkedIn}</span>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-gray-500 mb-1">Contacts génériques</div>
          <div className="flex justify-between text-sm">
            <span>Avec téléphone :</span>
            <span className="font-semibold">{headerStats.contactsGeneriques.avecTelephone}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            className="border rounded px-2 py-1 text-sm"
            onClick={() => setShowLimitInput(true)}
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
            value={currentSort}
            onChange={handleSortChange}
            aria-label="Sort by"
          >
            <option value="Pertinence">Pertinence</option>
            <option value="Role">Rôle</option>
            <option value="Entreprise">Entreprise</option>
          </select>
          <span className="text-sm">
            {filteredContacts.length > 0
              ? `1 - ${Math.min(displayLimit, filteredContacts.length)} sur ${filteredContacts.length}`
              : "0 - 0 sur 0"}
          </span>
        </div>
      </div>

      {/* Limit Input Section (below toolbar) */}
      {showLimitInput && (
        <div className="mt-2 p-2 bg-white border rounded shadow flex items-center gap-2">
          <span className="text-sm text-gray-600">Sélectionner la page en cours :</span>
          <input
            type="number"
            className="w-20 border rounded px-2 py-1 text-sm"
            value={displayLimit}
            onChange={(e) => setDisplayLimit(Number(e.target.value) || 0)}
            autoFocus
          />
          <button
            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            onClick={() => { const limit = parseInt(displayLimit.toString(), 10); if (!isNaN(limit) && limit > 0) setShowLimitInput(false); else alert("Please enter a valid number of contacts."); }}
          >
            Ok
          </button>
          <button
            className="px-2 py-1 bg-gray-300 rounded text-sm"
            onClick={() => { setShowLimitInput(false); setDisplayLimit(10); }}
          >
            Annuler
          </button>
        </div>
      )}

      {/* Main content with right sidebar */}
      <div className="flex gap-6 w-full max-w-full">
        {/* Table principale (gauche) */}
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y">
            {filteredContacts.length > 0 ? (
              filteredContacts
                .slice(0, displayLimit)
                .map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-gray-50 flex items-start justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {currentSort !== "Pertinence" && (
                        <input
                          type="checkbox"
                          checked={selectedContacts.has(index)}
                          onChange={() => handleCheckboxChange(index)}
                          aria-label={`Select contact ${item.role} at ${item.entreprise}`}
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{item.role || "No Role"}</div>
                        {item.subrole && (
                          <div className="text-gray-500 text-xs">{item.subrole}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="text-xs">WEB</span>
                      <Linkedin size={16} />
                      <Building size={16} />
                      <span className="text-xs text-blue-600 underline">
                        {item.entreprise || "No Entreprise"}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-4 text-gray-500 text-center">Aucun contact trouvé avec les filtres actuels.</div>
            )}
          </div>
        </div>

        {/* Sidebar Stats (droite) */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Types de postes */}
          <div className="bg-white shadow p-4 rounded-lg">
            <div className="font-semibold text-gray-700 mb-2">Types de postes</div>
            {postes.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.label}</span>
                  <span>
                    {item.value >= 1
                      ? `${item.value}M+`
                      : `${(item.value * 1000).toFixed(0)}K+`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-red-500 h-2 rounded"
                    style={{ width: `${(item.value / 1.5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Niveaux hiérarchiques */}
          <div className="bg-white shadow p-4 rounded-lg">
            <div className="font-semibold text-gray-700 mb-2">Niveaux hiérarchiques</div>
            {niveaux.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.label}</span>
                  <span>{item.value} M+</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-red-500 h-2 rounded"
                    style={{ width: `${(item.value / 4.7) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nouveau Export Popup */}
      {showExportPopup && (
        <ExportModalGlobal
          mode="contact"
          selectedCount={selectedContacts.size}
          statsEntreprise={statsEntreprise}
          statsContact={statsContact}
          selectedEntrepriseListsCount={storedEnterprisesCount} // Nombre d'entreprises sélectionnées depuis localStorage
          selectedContactListsCount={storedContactsCount} // Nombre de contacts sélectionnés depuis localStorage
          onClose={() => setShowExportPopup(false)}
          onExport={handleConfirmExport}
        />
      )}
    </div>
  );
};

export default Contact;