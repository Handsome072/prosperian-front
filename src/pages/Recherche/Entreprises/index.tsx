import React, { useState, useEffect } from "react";
import { MainContent } from "./_components/MainContent";
import { RightPanel } from "./_components/RightPanel";
import { useFilterContext } from "@contexts/FilterContext";

export const Entreprises = () => {
  const { filters, filteredBusinesses, handleSearchChange } = useFilterContext();
  const [businessesOverride, setBusinessesOverride] = useState(null);
  const [showCheckboxOverride, setShowCheckboxOverride] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setBusinessesOverride(e.detail);
      setShowCheckboxOverride(true);
    };
    window.addEventListener('updateBusinessList', handler);
    const handlerShowCheckbox = (e) => {
      setShowCheckboxOverride(!!e.detail);
    };
    window.addEventListener('updateBusinessListShowCheckbox', handlerShowCheckbox);
    return () => {
      window.removeEventListener('updateBusinessList', handler);
      window.removeEventListener('updateBusinessListShowCheckbox', handlerShowCheckbox);
    };
  }, []);

  const businessesToShow = businessesOverride || filteredBusinesses;

  return (
    <>
      <MainContent
        businesses={businessesToShow}
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
        showCheckbox={showCheckboxOverride}
      />
      <RightPanel businesses={businessesToShow} />
    </>
  );
};

export default Entreprises;
