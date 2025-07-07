import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { mockBusinesses } from '@data/mockBusinesses';
import type { FilterState } from 'src/types/Business';
import {
  filterBusinesses,
  getUniqueActivities,
  getUniqueCities,
  getUniqueLegalForms,
  getEmployeeRanges,
  getRevenueRanges,
  getAgeRanges,
} from '@shared/utils/filterUtils';

interface FilterContextType {
  filters: FilterState;
  availableActivities: string[];
  availableCities: string[];
  availableLegalForms: string[];
  employeeRange: [number, number];
  revenueRange: [number, number];
  ageRange: [number, number];
  filteredBusinesses: typeof mockBusinesses;
  setFilters: (f: FilterState) => void;
  handleSearchChange: (term: string) => void;
}

const defaultFilters: FilterState = {
  searchTerm: '',
  activities: [],
  employeeRange: [0, 5000],
  revenueRange: [0, 1000000],
  ageRange: [0, 50],
  cities: [],
  legalForms: [],
  ratingRange: [0, 5],
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const availableActivities = useMemo(() => getUniqueActivities(mockBusinesses), []);
  const availableCities = useMemo(() => getUniqueCities(mockBusinesses), []);
  const availableLegalForms = useMemo(() => getUniqueLegalForms(mockBusinesses), []);
  const employeeRange = useMemo(() => getEmployeeRanges(mockBusinesses), []);
  const revenueRange = useMemo(() => getRevenueRanges(mockBusinesses), []);
  const ageRange = useMemo(() => getAgeRanges(mockBusinesses), []);

  // Sync initial ranges into filters
  useEffect(() => {
    setFilters(prev => ({ ...prev, employeeRange, revenueRange, ageRange }));
  }, [employeeRange, revenueRange, ageRange]);

  const filteredBusinesses = useMemo(
    () => filterBusinesses(mockBusinesses, filters),
    [filters]
  );

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  return (
    <FilterContext.Provider value={{
      filters,
      availableActivities,
      availableCities,
      availableLegalForms,
      employeeRange,
      revenueRange,
      ageRange,
      filteredBusinesses,
      setFilters,
      handleSearchChange,
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within a FilterProvider');
  return ctx;
}
