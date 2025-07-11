import React, { useState } from "react";
import SectionCard from "@shared/components/SectionCard/SectionCard";
import SectionTableCard from "@shared/components/SectionCard/SectionTableCard";

const Lists: React.FC = () => {
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [listName, setListName] = useState("");
  const [listType, setListType] = useState("Entreprise (SIREN)");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(f.type) && !f.name.endsWith(".csv") && !f.name.endsWith(".xlsx")) {
        setFileError("Format de fichier non supporté");
        setFile(null);
      } else {
        setFile(f);
        setFileError("");
      }
    }
  };

  const myListColumns = ["Type", "Nom", "Éléments", "Créée le"];
  const myListItems: React.ReactNode[][] = [];

  const sharedListColumns = ["Type", "Nom", "Éléments", "Créée le", "Modifiée le"];
  const sharedListItems: React.ReactNode[][] = [
    ["Base", "Base ORIAS - agrément CIF", "6210", "26/10/2023", "25/06/2025"],
    ["Base", "Base ORIAS - agrément MIOBSP", "12362", "28/02/2024", "26/03/2024"],
    ["Base", "Participants au salon CES 2024", "113", "23/01/2024", "27/01/2024"],
    ["Base", "Participants au salon Vivatech 2023", "851", "21/09/2023", "07/11/2023"],
    ["Base", "Entreprises avec DPO", "84902", "03/10/2023", "07/11/2023"],
  ];

  return (
    <div className="mx-auto p-3">
      {/* Modal Nouvelle Liste */}
      {showNewListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 relative animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">Créer une nouvelle liste</h2>
            <input
              className="w-full border-b-2 border-gray-200 focus:border-orange-500 outline-none px-3 py-2 mb-4 placeholder-gray-400 bg-gray-50 rounded-t"
              placeholder="Nom de liste"
              value={listName}
              onChange={e => setListName(e.target.value)}
            />
            <select
              className="w-full border border-gray-200 rounded px-3 py-2 mb-6 bg-white"
              value={listType}
              onChange={e => setListType(e.target.value)}
            >
              <option>Entreprise (SIREN)</option>
              <option>Contact (Email)</option>
            </select>
            <div className="mb-2 font-medium text-gray-700">Ajouter des entreprises à ma liste</div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 mb-2 flex flex-col items-center justify-center text-center bg-gray-50">
              <div className="text-gray-400 mb-2">Déposez votre fichier ici</div>
              <div className="text-gray-400 mb-2">ou</div>
              <label htmlFor="file-upload" className="inline-block cursor-pointer">
                <span className="inline-block bg-gradient-to-r from-orange-400 to-[#E95C41] text-white font-medium px-6 py-2 rounded-full text-base">Sélectionnez votre fichier</span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {file && <div className="mt-2 text-sm text-gray-700">{file.name}</div>}
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-1 mb-4">
              <span className="text-orange-500 mr-1">&#9888;</span>
              Formats supportés: CSV et XLSX
            </div>
            {fileError && <div className="text-xs text-red-500 mb-2">{fileError}</div>}
            <div className="flex justify-between mt-6">
              <button
                className="px-6 py-2 rounded-full border border-orange-400 text-orange-500 font-medium bg-white hover:bg-orange-50"
                onClick={() => setShowNewListModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-400 to-[#E95C41] text-white font-medium hover:opacity-90 disabled:opacity-50"
                disabled={!listName || !file}
                onClick={() => {/* Créer la liste ici */}}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Fin Modal */}
      <SectionCard
        mainTitle="Créez et gérez vos listes en toute simplicité !"
        subTitle="Pourquoi utiliser notre service de liste ?"
        items={[
          "Sélectionnez précisément les entreprises qui vous intéressent",
          "Visualisez directement les contacts de votre liste d’entreprise",
          "Créez une surveillance à partir d’une liste de sociétés",
          "Accédez à des listes exclusives partagées par l’équipe SocieteInfo",
        ]}
        remark={
          <>
            Pour mieux comprendre notre <strong>service de liste</strong>, nous vous recommandons
            de jeter un œil à nos <a href="#" className="text-[#E95C41] underline">tutoriels</a> !
          </>
        }
        buttonText="Créer ma première liste"
        onButtonClick={() => console.log("Créer une liste")}
      />

      <div className="relative">
        <SectionTableCard
          title={
            <span>Mes listes</span>
          }
          columns={myListColumns}
          items={myListItems}
          showExport={false}
          emptyMessage="Vous n’avez créé aucune liste."
          onExportSelect={() => {}}
        />
        <button
          className="absolute top-0 right-0 mt-2 mr-8 inline-flex items-center bg-gradient-to-r from-orange-400 to-[#E95C41] hover:opacity-90 text-white font-medium py-3 px-6 rounded-full text-sm z-10"
          onClick={() => setShowNewListModal(true)}
        >
          Nouvelle liste
        </button>
      </div>

      <SectionTableCard
        title="Listes partagées"
        columns={sharedListColumns}
        items={sharedListItems}
        showExport={false}
        emptyMessage="Aucune liste partagée."
        onExportSelect={() => console.log("Export CSV")}
      />

      <p className="text-center text-xs text-gray-500 my-6">
        © SMART DATA 2024 · <a href="#" className="underline">CGV / CGU</a> · <a href="#" className="underline">Vie privée & Confidentialité</a> · <a href="#" className="underline">Mentions Légales</a>
      </p>
    </div>
  );
};

export default Lists;
