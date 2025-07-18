export interface Business {
    id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    employees: string;
    activity: string;
    description: string;
    website?: string;
    rating?: number;
    logo?: string;
    foundedYear?: number;
    employeeCount?: number;
    revenue?: number;
    legalForm?: string;
    role?: string; // <-- Ajout du champ role pour compatibilité FilterPanel
  }
  
  export interface FilterState {
    searchTerm: string;
    activities: string[];
    employeeRange: [number, number];
    revenueRange: [number, number];
    ageRange: [number, number];
    cities: string[];
    legalForms: string[];
    ratingRange: [number, number];
    roles: string[];
  }

  export interface FiltersPanelProps extends FilterState {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    availableActivities: string[];
    availableCities: string[];
    availableLegalForms: string[];
    availableRoles: string[];
    employeeRange: [number, number];
    revenueRange: [number, number];
    ageRange: [number, number];
  }

// Interfaces pour les données Pronto API
export interface ProntoLead {
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  most_probable_email: string;
  phones: string[];
  title: string;
  title_description: string;
  summary: string;
  linkedin_profile_url: string;
  profile_image_url: string;
  is_premium_linkedin: boolean;
  connection_degree: number;
  status: string;
  rejection_reason: string[];
  lk_headline: string;
  sales_navigator_profile_url: string;
  current_positions_count: number;
  years_in_position: number;
  months_in_position: number;
  years_in_company: number;
  months_in_company: number;
  lk_connections_count: number;
  is_open_profile_linkedin: boolean;
  is_open_to_work_linkedin: boolean;
  most_probable_email_status: string;
}

export interface ProntoCompany {
  name: string;
  cleaned_name: string;
  website: string;
  location: string;
  industry: string;
  headquarters: string;
  description: string;
  linkedin_url: string;
  employee_range: string;
  company_profile_picture: string;
  profile_image_url?: string; // Champ alternatif pour l'image de profil
}

export interface ProntoLeadWithCompany {
  lead: ProntoLead;
  company: ProntoCompany;
}

export interface ProntoSearch {
  id: string;
  name: string;
  created_at: string;
}

export interface ProntoSearchResponse {
  search: ProntoSearch;
  leads: ProntoLeadWithCompany[];
}

// Type combiné pour BusinessCard avec données Pronto
export interface BusinessWithProntoData extends Business {
  contactsCount?: number;
  email?: string;
  linkedin?: string;
  google?: string;
  facebook?: string;
  prontoData?: {
    lead?: ProntoLead;
    company?: ProntoCompany;
  };
}

// Table de correspondance code NAF -> mots-clés d'activité (à enrichir)
export const nafKeywordsMap: Record<string, string[]> = {
  'Télécommunication': ['télécom', 'telecom', 'it', 'logiciel', 'software', 'application', 'développement', 'informatique', 'digital'],
  'Développement logiciel': ['logiciel', 'software', 'application', 'développement', 'it', 'informatique'],
  // ... à compléter pour chaque code NAF pertinent
};