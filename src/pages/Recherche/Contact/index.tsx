// In Contact.tsx
import React from "react";
import { Building, Linkedin } from "lucide-react";
import { mockContacts } from "@data/mockContacts";
import { useFilterContext } from "@contexts/FilterContext";

const Contact: React.FC = () => {
  const { filteredContacts, headerStats, postes, niveaux } = useFilterContext();

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
          <input type="checkbox" />
          <button className="bg-red-500 text-white px-4 py-1 rounded">Exporter</button>
        </div>
        <div className="text-gray-600">
          Trier : <span className="font-semibold">Pertinence</span>
        </div>
      </div>

      {/* Main content with right sidebar */}
      <div className="flex gap-6 w-full max-w-full">
        {/* Table principale (gauche) */}
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((item, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{item.role}</div>
                    {item.subrole && (
                      <div className="text-gray-500 text-xs">{item.subrole}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <span className="text-xs">WEB</span>
                    <Linkedin size={16} />
                    <Building size={16} />
                    <span className="text-xs text-blue-600 underline">
                      {item.entreprise}
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
    </div>
  );
};

export default Contact;