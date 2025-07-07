import React from "react";
import { Outlet } from "react-router-dom";
import { useFilterContext } from "@contexts/FilterContext";
import { SecondaryNav } from "@shared/components/Header/SecondaryNav";
import { ResponsiveSidebar } from "@shared/components/Sidebar/ResponsiveSidebar";
import { FilterState } from "@entities/Business";

export const SearchLayout: React.FC = () => {
  const {
    filters,
    setFilters,
    availableActivities,
    availableCities,
    availableLegalForms,
    employeeRange,
    revenueRange,
    ageRange,
  } = useFilterContext();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <>
      {/* SubTopbar */}
      <SecondaryNav />
      {/*Content */}
      <div className="flex flex-col md:flex-row">
        {/* Filter Sidebar */}
        <ResponsiveSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableActivities={availableActivities}
          availableCities={availableCities}
          availableLegalForms={availableLegalForms}
          employeeRange={employeeRange}
          revenueRange={revenueRange}
          ageRange={ageRange}
          searchTerm={filters.searchTerm}
          activities={filters.activities}
          cities={filters.cities}
          legalForms={filters.legalForms}
          ratingRange={filters.ratingRange}
        />
        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          <Outlet />
        </div>
      </div>
    </>
  );
};
