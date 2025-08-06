import React from 'react';
import { useLocation } from 'react-router-dom';
import { RightPanel } from '../pages/Recherche/Entreprises/_components/RightPanel';
import { ContactRightPanel } from '../pages/Recherche/Contact/_components/RightPanel';
import { useRightPanel } from '../contexts/RightPanelContext';

interface GlobalRightPanelProps {
  // Props pour les données des entreprises
  businesses?: { city: string; activity: string }[];
  totalBusinesses?: number;
  // Props pour les données des contacts
  contacts?: { 
    city: string; 
    role: string; 
    entreprise: string;
    ca?: number;
    employeesCount?: number;
  }[];
  totalContacts?: number;
  // Props communes
  filters: any;
  onFiltersChange: (filters: any) => void;
  availableCities: string[];
  availableLegalForms: string[];
  availableRoles: string[];
  employeeRange: [number, number];
  revenueRange: [number, number];
  ageRange: [number, number];
}

export const GlobalRightPanel: React.FC<GlobalRightPanelProps> = ({
  businesses = [],
  totalBusinesses = 0,
  contacts = [],
  totalContacts = 0,
  filters,
  onFiltersChange,
  availableCities,
  availableLegalForms,
  availableRoles,
  employeeRange,
  revenueRange,
  ageRange
}) => {
  const location = useLocation();
  const { isRightPanelVisible } = useRightPanel();

  // Déterminer quelle page est active
  const isContactPage = location.pathname.includes('/recherche/contact');
  const isEntreprisePage = location.pathname.includes('/recherche/entreprises') || location.pathname === '/recherche';

  // Rendre le bon RightPanel selon la page
  if (isContactPage) {
    return (
      <div className={`transition-all duration-300 ease-in-out ${isRightPanelVisible ? 'w-80' : 'w-0'} flex-shrink-0 overflow-hidden`}>
        <ContactRightPanel
          contacts={contacts}
          totalContacts={totalContacts}
          filters={filters}
          onFiltersChange={onFiltersChange}
          availableCities={availableCities}
          availableLegalForms={availableLegalForms}
          availableRoles={availableRoles}
          employeeRange={employeeRange}
          revenueRange={revenueRange}
          ageRange={ageRange}
        />
      </div>
    );
  }

  if (isEntreprisePage) {
    return (
      <div className={`transition-all duration-300 ease-in-out ${isRightPanelVisible ? 'w-80' : 'w-0'} flex-shrink-0 overflow-hidden`}>
        <RightPanel
          businesses={businesses}
          totalBusinesses={totalBusinesses}
          filters={filters}
          onFiltersChange={onFiltersChange}
          availableCities={availableCities}
          availableLegalForms={availableLegalForms}
          availableRoles={availableRoles}
          employeeRange={employeeRange}
          revenueRange={revenueRange}
          ageRange={ageRange}
        />
      </div>
    );
  }

  // Par défaut, ne rien afficher
  return null;
}; 