import React, { useState, useEffect } from "react";
import { Building, Linkedin } from "lucide-react";
import { useFilterContext } from "@contexts/FilterContext";
import ContactOptions from "./_components/ContactOptions";
import ExportModalGlobal from "../../../components/ExportModalGlobal";
/* import { 
  getSelectedContactsCount, 
  setSelectedContactsCount, 
  resetSelectedContactsCount, 
  getSelectedEnterprisesCount 
} from "../../../../utils/localStorageCounters"; */
import { RightPanel } from "../Entreprises/_components/RightPanel";

const Contact: React.FC = () => {
  const { filteredContacts, headerStats, postes, niveaux, setSort, filters, setFilters } = useFilterContext();
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [displayLimit, setDisplayLimit] = useState(10);
  const [showLimitInput, setShowLimitInput] = useState(false);
  const [currentSort, setCurrentSort] = useState("Pertinence");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [layout, setLayout] = useState<"list" | "grid">("list");

  const { filteredBusinesses } = useFilterContext();
  const [businessesOverride, setBusinessesOverride] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setBusinessesOverride(e.detail);
    };
    window.addEventListener("updateBusinessList", handler);
    return () => {
      window.removeEventListener("updateBusinessList", handler);
    };
  }, []);

  const businessesToShow = businessesOverride || filteredBusinesses;

  // Pagination indices
  const pageStart = 1;
  const pageEnd = Math.min(displayLimit, filteredContacts.length);

  // Handlers
  const handleLimitClick = () => setShowLimitInput(true);
  const handleSetLimit = (n: number) => {
    setDisplayLimit(n);
    setShowLimitInput(false);
  };
  const handleCancelLimit = () => {
    setDisplayLimit(10);
    setShowLimitInput(false);
  };

  const handleSortChange = (value: string) => {
    setCurrentSort(value);
    setSort(value);
    setSelectedContacts(new Set());
  };
  /* const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSort(sortValue);
    setCurrentSort(sortValue);
    setSelectedContacts(new Set());
    resetSelectedContactsCount(); // Reset le compteur localStorage
  }; */

  // Handle checkbox change for individual contacts
  const handleCheckboxChange = (index: number) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const handleExport = () => {
    if (selectedContacts.size > 0) setShowExportPopup(true);
    else alert("No contacts selected for export.");
  };

  const handleConfirmExport = () => {
    // ... logique d'export CSV ou API ...
    setShowExportPopup(false);
    setSelectedContacts(new Set());
  };

  const handleExportClose = () => setShowExportPopup(false);

  const handlePrevPage = () => {
    /* page logic */
  };
  const handleNextPage = () => {
    /* page logic */
  };

  useEffect(() => {
    console.log(filteredContacts);
  }, [filteredContacts]);

  return (
    <>
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="text-common-blue font-bold mb-1">Contacts</div>
              <div className="text-xl font-bold text-dark-blue">{headerStats.totalContacts}</div>
              <div className="text-gray-400 text-sm">Entreprises : {headerStats.totalEntreprises}</div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="text-common-blue font-bold mb-1">Contacts directs</div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-blue">Avec email :</span>
                <span className="font-semibold text-dark-blue">{headerStats.contactsDirects.avecEmail}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-blue">Avec LinkedIn :</span>
                <span className="font-semibold text-dark-blue">{headerStats.contactsDirects.avecLinkedIn}</span>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="text-common-blue font-bold mb-1">Contacts génériques</div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-blue">Avec téléphone :</span>
                <span className="font-semibold text-dark-blue">{headerStats.contactsGeneriques.avecTelephone}</span>
              </div>
            </div>
          </div>

          <ContactOptions
            currentLimit={displayLimit}
            onLimitChangeClick={handleLimitClick}
            showLimitInput={showLimitInput}
            limitInputValue={displayLimit.toString()}
            onSetLimit={handleSetLimit}
            onCancelLimit={handleCancelLimit}
            currentSort={currentSort}
            onSortChange={handleSortChange}
            selectedCount={selectedContacts.size}
            onExportClick={handleExport}
            showExportModal={showExportPopup}
            onExportConfirm={handleConfirmExport}
            onExportClose={handleExportClose}
            filteredTotal={filteredContacts.length}
            pageStart={pageStart}
            pageEnd={pageEnd}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            layout={layout}
            setLayout={setLayout}
          />

          {/* Main content */}
          <div className="flex gap-6 w-full max-w-full">
            {/* Table principale (gauche) */}
            <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
              <div className="divide-y">
                {filteredContacts.length > 0 ? (
                  filteredContacts.slice(0, displayLimit).map((item, index) => (
                    <div key={item.id} className="p-3 hover:bg-gray-50 flex items-start justify-between">
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
                          {item.subrole && <div className="text-gray-500 text-xs">{item.subrole}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span className="text-xs">WEB</span>
                        <Linkedin size={16} />
                        <Building size={16} />
                        <span className="text-xs text-blue-600 underline">{item.entreprise || "No Entreprise"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 text-center">Aucun contact trouvé avec les filtres actuels.</div>
                )}
              </div>
            </div>

            {/* Sidebar Stats (droite) */}
            {/* Types de postes && Niveaux hiérarchiques */}
            {/* <div className="w-80 flex-shrink-0 space-y-6">
            <div className="bg-white shadow p-4 rounded-lg">
              <div className="font-semibold text-gray-700 mb-2">Types de postes</div>
              {postes.map((item, index) => (
                <div key={`poste-${index}-${item.label}`} className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.label}</span>
                    <span>{item.value >= 1 ? `${item.value}M+` : `${(item.value * 1000).toFixed(0)}K+`}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div className="bg-red-500 h-2 rounded" style={{ width: `${(item.value / 1.5) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white shadow p-4 rounded-lg">
              <div className="font-semibold text-gray-700 mb-2">Niveaux hiérarchiques</div>
              {niveaux.map((item, index) => (
                <div key={`niveau-${index}-${item.label}`} className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.label}</span>
                    <span>{item.value} M+</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div className="bg-red-500 h-2 rounded" style={{ width: `${(item.value / 4.7) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <RightPanel businesses={businessesToShow} />
    </>
  );
};

export default Contact;
