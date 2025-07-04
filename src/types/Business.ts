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
  }