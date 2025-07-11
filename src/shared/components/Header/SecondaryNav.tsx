import React from "react";
import { Search } from "lucide-react";
import { ScrollableNav } from "@shared/components/Header/ScrollableNav";

export const SecondaryNav: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 p-3 lg:p-1 bg-white border-b border-gray-200">
      <div className="mx-auto lg:mx-0 max-w-full">
        <ScrollableNav
          links={[
            { label: "Entreprises", href: "/recherche/entreprises" },
            { label: "Contacts", href: "/recherche/contact" },
            { label: "Listes", href: "/recherche/listes" },
            { label: "Exports", href: "/recherche/export" },
            { label: "Mes Recherches", href: "/recherche/mes-recherches" },
          ]}
        />
      </div>
      <div className="w-full lg:max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Je recherche une entreprise, un dirigeant..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
