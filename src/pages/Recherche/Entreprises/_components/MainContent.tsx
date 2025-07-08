import React, { useState } from "react";
import { Search, Filter, Download, MapPin, Building } from "lucide-react";
import { BusinessCard } from "./BusinessCard";
import { Business } from "@entities/Business";
import BusinessOptions from "./BusinessOptions";
import BusinessSummaryCard from "./BusinessSummaryCard";

export interface MainContentProps {
  businesses: Business[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ businesses, searchTerm, onSearchChange }) => {
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const total = businesses.length;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  // slice the array for the current page
  const paginatedList = businesses.slice(start - 1, end);

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <BusinessSummaryCard businesses={businesses} />
        <BusinessOptions
          businesses={businesses}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          start={start}
          end={end}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
        {/* Business Cards Grid */}
        {paginatedList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedList.map((business) => (
                <BusinessCard key={business.id} company={business} />
              ))}
            </div>
          </>
        ) : (
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
