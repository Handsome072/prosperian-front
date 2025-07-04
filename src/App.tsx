import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { mockBusinesses } from './data/mockBusinesses';
import { FilterState } from './types/Business';
import { 
  filterBusinesses, 
  getUniqueActivities, 
  getUniqueCities, 
  getUniqueLegalForms,
  getEmployeeRanges,
  getRevenueRanges,
  getAgeRanges
} from './utils/filterUtils';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    activities: [],
    employeeRange: [0, 5000],
    revenueRange: [0, 1000000],
    ageRange: [0, 50],
    cities: [],
    legalForms: [],
    ratingRange: [0, 5]
  });

  // Calculate available options and ranges from data
  const availableActivities = useMemo(() => getUniqueActivities(mockBusinesses), []);
  const availableCities = useMemo(() => getUniqueCities(mockBusinesses), []);
  const availableLegalForms = useMemo(() => getUniqueLegalForms(mockBusinesses), []);
  const employeeRange = useMemo(() => getEmployeeRanges(mockBusinesses), []);
  const revenueRange = useMemo(() => getRevenueRanges(mockBusinesses), []);
  const ageRange = useMemo(() => getAgeRanges(mockBusinesses), []);

  // Initialize filter ranges based on actual data
  React.useEffect(() => {
    setFilters(prev => ({
      ...prev,
      employeeRange: employeeRange,
      revenueRange: revenueRange,
      ageRange: ageRange
    }));
  }, [employeeRange, revenueRange, ageRange]);

  // Filter businesses based on current filters
  const filteredBusinesses = useMemo(() => {
    return filterBusinesses(mockBusinesses, filters);
  }, [filters]);

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableActivities={availableActivities}
          availableCities={availableCities}
          availableLegalForms={availableLegalForms}
          employeeRange={employeeRange}
          revenueRange={revenueRange}
          ageRange={ageRange}
        />
        <MainContent 
          businesses={filteredBusinesses}
          searchTerm={filters.searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default App;