import { ProntoSearchResponse, ProntoSearch } from '@entities/Business';
import { API_CONFIG, buildApiUrl } from '@config/api';

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

export async function getAvailableActivities(): Promise<string[]> {
  const res = await fetch('/api/pronto/activities');
  if (!res.ok) return [];
  const data = await res.json();
  return data.activities || [];
} 