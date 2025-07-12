import React, { useState, useEffect } from "react";
import { Building, Linkedin, Globe, Phone, Mail, User, Facebook, Eye, Twitter } from "lucide-react";
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
              <div className="overflow-x-auto max-h-[calc(100vh-12rem)] overflow-y-auto">
                {/* Header colonnes */}
                <div className="flex items-center gap-2 px-3 pt-3 pb-2 text-xs font-semibold text-gray-500 uppercase bg-white border-t border-l border-r border-gray-200 rounded-t-lg min-w-[900px]">
                  {currentSort !== 'Pertinence' && <span className="w-8" />} {/* Checkbox */}
                  <span className="flex-1 min-w-0">Rôle</span>
                  <span className="w-24 text-center">Web</span>
                  <span className="flex-[1.5] min-w-0">Entreprise</span>
                  <span className="w-24 text-center text-[#E95C41]"># Contacts</span>
                  <span className="w-24 text-center">CA</span>
                  <span className="w-32 text-right">Adresse</span>
                </div>
                <div className="divide-y">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.slice(0, displayLimit).map((item, index) => (
                      <div key={item.id || index} className="p-3 hover:bg-gray-50 flex items-center gap-2 min-w-[900px]">
                        {/* Checkbox (si tri != Pertinence) */}
                        {currentSort !== 'Pertinence' && (
                          <input
                            type="checkbox"
                            checked={selectedContacts.has(index)}
                            onChange={() => handleCheckboxChange(index)}
                            aria-label={`Select contact ${item.role} at ${item.entreprise}`}
                          />
                        )}
                        {/* Rôle */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{item.role}</div>
                          {item.subrole && <div className="text-xs text-gray-500 truncate">{item.subrole}</div>}
                        </div>
                        {/* WEB */}
                        <div className="w-24 flex items-center justify-center gap-2 text-gray-400">
                          <Eye className="w-5 h-5" />
                          <Mail className="w-5 h-5" />
                          <Linkedin className="w-5 h-5" />
                        </div>
                        {/* ENTREPRISE */}
                        <div className="flex-[1.5] min-w-0 flex items-center gap-2">
                          {item.logo ? (
                            <img src={item.logo} alt={item.entreprise} className="w-8 h-8 rounded-lg object-cover border border-gray-200" />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-blue-800 text-sm underline truncate cursor-pointer">{item.entreprise}</span>
                            <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                              <Globe className="w-4 h-4" />
                              <Phone className="w-4 h-4" />
                              <Mail className="w-4 h-4" />
                              <Linkedin className="w-4 h-4" />
                              <User className="w-4 h-4" /> {/* Google icon placeholder */}
                              <Twitter className="w-4 h-4" />
                              <Facebook className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        {/* # CONTACTS */}
                        <div className="w-24 text-center text-sm font-semibold text-[#E95C41]">
                          {item.contactsCount ?? '-'}
                        </div>
                        {/* CA */}
                        <div className="w-24 text-center text-sm text-gray-800 font-medium">
                          {item.revenue ? `${(item.revenue / 1_000_000).toLocaleString()} M €` : '-'}
                        </div>
                        {/* Adresse */}
                        <div className="w-32 text-right text-sm text-blue-800 underline truncate">
                          {item.postalCode} {item.city}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500 text-center">Aucun contact trouvé avec les filtres actuels.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightPanel businesses={businessesToShow} />
    </>
  );
};

export default Contact;
