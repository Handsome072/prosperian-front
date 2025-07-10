export interface Contact {
    role: string;
    subrole: string;
    entreprise: string;
  }
  
  export interface Poste {
    label: string;
    value: number;
  }
  
  export interface Niveau {
    label: string;
    value: number;
  }
  
  export interface HeaderStats {
    totalContacts: string;
    totalEntreprises: string;
    contactsDirects: {
      avecEmail: string;
      avecLinkedIn: string;
    };
    contactsGeneriques: {
      avecTelephone: string;
    };
  }
  
  export interface MockContacts {
    contacts: Contact[];
    postes: Poste[];
    niveaux: Niveau[];
    headerStats: HeaderStats;
  }