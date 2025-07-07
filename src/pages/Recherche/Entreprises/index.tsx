import React from "react";
import { MainContent } from "./_components/MainContent";
import { RightPanel } from "./_components/RightPanel";
import { useFilterContext } from "@contexts/FilterContext";

export const Entreprises = () => {
  const { filters, filteredBusinesses, handleSearchChange } = useFilterContext();

  return (
    <>
      <MainContent
        businesses={filteredBusinesses}
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
      />
      <RightPanel businesses={filteredBusinesses} />
    </>
  );
};

export default Entreprises;
