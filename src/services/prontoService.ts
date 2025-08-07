import { ProntoSearchResponse, ProntoSearch } from '@entities/Business';
import { API_CONFIG, buildApiUrl } from '@config/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface ProntoEnrichmentContact {
  firstname: string;
  lastname: string;
  company_name?: string;
  linkedin_url?: string;
  domain?: string;
}

export interface ProntoEnrichmentRequest {
  contacts: ProntoEnrichmentContact[];
  enrichment_type: string[];
}

export const sendEnrichmentToPronto = async (data: ProntoEnrichmentRequest) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/pronto/enrichments/contacts/bulk`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi vers Pronto:', error);
    throw error;
  }
};

export interface ProntoCompany {
  name: string;
  country_code?: string | null;
  domain?: string | null;
  linkedin_url?: string | null;
}

export interface ProntoListRequest {
  name: string;
  webhook_url?: string;
  companies: ProntoCompany[];
}

export interface ProntoListResponse {
  success: boolean;
  list: {
    id: string;
    name: string;
    webhook_url?: string;
    companies_count: number;
    companies: ProntoCompany[];
    created_at: string;
    pronto_response: any;
  };
  message: string;
}

export interface ProntoListItem {
  id: string;
  name: string;
  type: string;
  companies_count: number;
  linkedin_id?: string;
  created_at: string;
  updated_at: string;
  webhook_url?: string;
  status?: string;
}

export interface ProntoListsResponse {
  success: boolean;
  lists: ProntoListItem[];
  total: number;
  message: string;
  pronto_response?: any;
}

export class ProntoService {
  // Récupérer toutes les recherches
  static async getAllSearches(): Promise<ProntoSearch[]> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.PRONTO.SEARCHES));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.searches || [];
    } catch (error) {
      console.error('Error fetching searches:', error);
      throw error;
    }
  }

  // Créer une liste d'entreprises dans Pronto
  static async createCompanyList(data: ProntoListRequest): Promise<ProntoListResponse> {
    try {
      // Nettoyer les données avant l'envoi - supprimer les valeurs null/undefined
      const cleanedData = {
        ...data,
        companies: data.companies.map(company => {
          const cleaned: any = { name: company.name };

          if (company.country_code) cleaned.country_code = company.country_code;
          if (company.domain) cleaned.domain = company.domain;
          if (company.linkedin_url) cleaned.linkedin_url = company.linkedin_url;

          return cleaned;
        })
      };

      console.log('🚀 Envoi des données nettoyées vers l\'API Pronto:', cleanedData);

      const response = await fetch(buildApiUrl(API_CONFIG.PRONTO.LISTS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating company list:', error);
      throw error;
    }
  }

  // Récupérer toutes les listes Pronto
  static async getAllLists(): Promise<ProntoListsResponse> {
    try {
      console.log('📋 Récupération des listes Pronto...');

      const response = await fetch(buildApiUrl(API_CONFIG.PRONTO.LISTS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Listes récupérées:', result.total, 'liste(s)');

      return result;
    } catch (error) {
      console.error('Error fetching Pronto lists:', error);
      throw error;
    }
  }

  // Récupérer le statut des services Pronto
  static async getServiceStatus(): Promise<any> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.PRONTO.STATUS));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching service status:', error);
      throw error;
    }
  }

  // Récupérer les détails d'une recherche spécifique avec ses leads
  static async getSearchWithLeads(searchId: string): Promise<ProntoSearchResponse> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.PRONTO.SEARCH_DETAILS(searchId)));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching search with leads:', error);
      throw error;
    }
  }

  // Récupérer les leads d'une recherche avec pagination
  static async getSearchLeads(searchId: string, page: number = 1, limit: number = 100): Promise<ProntoSearchResponse> {
    try {
      const url = buildApiUrl(API_CONFIG.PRONTO.SEARCH_LEADS(searchId));
      console.log(`🔍 Tentative de chargement: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ Erreur ${response.status} pour ${url}`);
        console.error(`📄 Réponse:`, await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Succès pour ${searchId}: ${data.leads?.length || 0} entreprises chargées`);
      
      // Debug: Afficher la structure des données pour la première entreprise
      if (data.leads && data.leads.length > 0) {
        const firstLead = data.leads[0];
        console.log('🔍 Structure des données de la première entreprise:', {
          company: firstLead.company,
          lead: firstLead.lead,
          companyProfilePicture: firstLead.company?.company_profile_picture,
          leadProfileImage: firstLead.lead?.profile_image_url
        });
      }
      
      return data;
    } catch (error) {
      console.error(`❌ Error fetching search leads for ${searchId}:`, error);
      throw error;
    }
  }

  // Workflow complet pour récupérer toutes les recherches avec leurs leads
  static async getAllSearchesComplete(includeLeads: boolean = true, leadsPerSearch: number = 50): Promise<any> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.PRONTO.ALL_SEARCHES_COMPLETE(includeLeads, leadsPerSearch)));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching complete searches:', error);
      throw error;
    }
  }
} 