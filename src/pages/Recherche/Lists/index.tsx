import React from "react";
import SectionCard from "@shared/components/SectionCard/SectionCard";
import SectionTableCard from "@shared/components/SectionCard/SectionTableCard";

const Lists: React.FC = () => {
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
          onClick={() => console.log('Nouvelle liste')}
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
