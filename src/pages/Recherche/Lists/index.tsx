import React from "react";
import { ChevronDown, Plus } from "lucide-react";

const Lists: React.FC = () => {
  return (
    <div className="w-full bg-gray-50">
      <section className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h1 className="text-2xl font-semibold text-center mb-4">
            Créez et gérez vos listes en toute simplicité !
          </h1>
          <p className="text-center font-medium mb-6">
            Pourquoi utiliser notre service de liste ?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ul className="space-y-2">
              <li>✔️ Sélectionnez précisément les entreprises qui vous intéressent</li>
              <li>✔️ Visualisez directement les contacts de votre liste d’entreprise</li>
            </ul>
            <ul className="space-y-2">
              <li>✔️ Créez une surveillance à partir d’une liste de sociétés</li>
              <li>✔️ Accédez à des listes exclusives partagées par l’équipe SocieteInfo</li>
            </ul>
          </div>

          <div className="bg-orange-100 text-sm rounded p-4 mb-6">
            Pour mieux comprendre notre <strong>service de liste</strong>, nous vous recommandons de jeter un œil à nos <a href="#" className="text-orange-500 underline">tutoriels</a> !
          </div>

          <div className="flex justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full">
              Créer ma première liste
            </button>
          </div>
        </div>

        {/* Mes listes */}
        <div className="bg-white rounded-lg p-6 shadow mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mes listes</h2>
            <button className="flex items-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Créer une liste
            </button>
          </div>
          <div className="border rounded-lg">
            <div className="grid grid-cols-4 font-semibold text-sm p-3 bg-gray-100">
              <div>Type</div>
              <div>Nom</div>
              <div>Éléments</div>
              <div>Créée le</div>
            </div>
            <div className="p-4 text-center text-gray-500">
              Vous n’avez créé aucune liste.
            </div>
          </div>
        </div>

        {/* Listes partagées */}
        <div className="bg-white rounded-lg p-6 shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">Listes partagées</h2>
          <div className="border rounded-lg">
            <div className="grid grid-cols-5 font-semibold text-sm p-3 bg-gray-100">
              <div>Type</div>
              <div>Nom</div>
              <div>Éléments</div>
              <div>Créée le</div>
              <div>Modifiée le</div>
            </div>

            {[
              { name: "Base ORIAS - agrément CIF", elements: "6210", created: "26/10/2023", modified: "25/06/2025" },
              { name: "Base ORIAS - agrément MIOBSP", elements: "12362", created: "28/02/2024", modified: "26/03/2024" },
              { name: "Participants au salon CES 2024", elements: "113", created: "23/01/2024", modified: "27/01/2024" },
              { name: "Participants au salon Vivatech 2023", elements: "851", created: "21/09/2023", modified: "07/11/2023" },
              { name: "Entreprises avec DPO", elements: "84902", created: "03/10/2023", modified: "07/11/2023" },
            ].map((list, index) => (
              <div
                key={index}
                className="grid grid-cols-5 items-center border-t p-3 text-sm"
              >
                <div><ChevronDown className="inline w-4 h-4 mr-2" /> Base</div>
                <div>{list.name}</div>
                <div>{list.elements}</div>
                <div>{list.created}</div>
                <div>{list.modified}</div>
              </div>
            ))}

            <div className="text-xs text-gray-500 p-4">
              Mise à jour le 08/09/2023
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-500 mt-8">
          © SMART DATA 2024 · <a href="#" className="underline">CGV / CGU</a> · <a href="#" className="underline">Vie privée & Confidentialité</a> · <a href="#" className="underline">Mentions Légales</a>
        </footer>
      </section>
    </div>
  );
};

export default Lists;
