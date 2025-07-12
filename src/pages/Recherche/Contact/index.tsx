import React, { useState, useEffect } from "react";
import { Building, Linkedin, Globe, Phone, Mail, User, Facebook, Eye, Twitter } from "lucide-react";
import { useFilterContext } from "@contexts/FilterContext";
import ContactOptions from "./_components/ContactOptions";
import ExportModalGlobal from "../../../components/ExportModalGlobal";

import { RightPanel } from "../Entreprises/_components/RightPanel";

const Contact: React.FC = () => {
  const { filteredContacts, headerStats, postes, niveaux, setSort, filters, setFilters } = useFilterContext();
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [displayLimit, setDisplayLimit] = useState(10);
  const [showLimitInput, setShowLimitInput] = useState(false);
  const [currentSort, setCurrentSort] = useState("Pertinence");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

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
      {/* Popup contact */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowContactModal(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <div className="text-center mb-2 text-lg font-semibold text-gray-800">
              {selectedContact.role}
            </div>
            <div className="text-center mb-4">
              <span className="text-blue-900 font-bold text-base underline cursor-pointer">
                {selectedContact.entreprise}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
              <div className="text-gray-500">Civilité</div>
              <div className="text-gray-900">{selectedContact.civilite}</div>
              <div className="text-gray-500">Prénom</div>
              <div className="text-gray-900">{selectedContact.prenom}</div>
              <div className="text-gray-500">Nom</div>
              <div className="text-gray-900">{selectedContact.nom}</div>
              <div className="text-gray-500">Niveau</div>
              <div className="text-gray-900">{selectedContact.niveau}</div>
              <div className="text-gray-500">Domaine</div>
              <div className="text-gray-900">{selectedContact.domaine}</div>
              <div className="text-gray-500">LinkedIn</div>
              <div className="text-blue-700 underline truncate cursor-pointer">{selectedContact.linkedin}</div>
              <div className="text-gray-500">Email</div>
              <div className="text-orange-700 truncate">{selectedContact.email}</div>
              <div className="text-gray-500">Webmail</div>
              <div className="text-gray-900">{selectedContact.webmail}</div>
              <div className="text-gray-500">statut :</div>
              <div className="text-gray-900">{selectedContact.statut}</div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-400 text-orange-500 font-medium bg-white hover:bg-orange-50">
                <Eye className="w-4 h-4" />
                Plus de contacts
              </button>
              <button className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-400 to-[#E95C41] text-white font-medium hover:opacity-90">
                1 crédit
              </button>
            </div>
          </div>
        </div>
      )}
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
                          <Eye className="w-5 h-5 cursor-pointer" onClick={() => { setSelectedContact(item); setShowContactModal(true); }} />
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
