interface ApifyCredentials {
  email: string;
  password: string;
}

interface ApifySearchParams {
  enseigne: string;
  location?: string;
  maxResults?: number;
  includeReviews?: boolean;
}

interface ApifyResult {
  title: string;
  address: string;
  phone?: string;
  website?: string;
  category: string;
  rating?: number;
  reviewsCount?: number;
  latitude?: number;
  longitude?: number;
  placeId: string;
  isAdvertisement?: boolean;
  description?: string;
  imageUrls?: string[];
}

interface ApifyResponse {
  results: ApifyResult[];
  totalResults: number;
  searchQuery: string;
}

class ApifyService {
  private credentials: ApifyCredentials = {
    email: 'corenthin@buffard.net',
    password: '5b#TUGy77T_*p#x'
  };

  private baseUrl = 'https://api.apify.com/v2';
  private actorId = 'compass/crawler-google-places';

  /**
   * Recherche d'entreprises par enseigne/franchise via Apify Google Places Crawler
   */
  async searchByEnseigne(params: ApifySearchParams): Promise<ApifyResponse> {
    try {
      console.log(`🔍 Recherche Apify pour enseigne: "${params.enseigne}"`);
      
      // Configuration de la recherche Apify
      const searchInput = {
        searchStringsArray: [`${params.enseigne} ${params.location || 'France'}`],
        locationQuery: params.location || 'France',
        maxCrawledPlacesPerSearch: params.maxResults || 50,
        includeReviews: params.includeReviews || false,
        includeImages: true,
        includeOpeningHours: true,
        includePeopleAlsoSearch: false,
        maxReviews: params.includeReviews ? 10 : 0,
        reviewsSort: 'newest',
        language: 'fr',
        exportPlaceUrls: false,
        additionalInfo: true,
        onlyDataFromSearchPage: false
      };

      // Appel à l'API Apify pour démarrer le run
      const runResponse = await fetch(`${this.baseUrl}/acts/${this.actorId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getApiToken()}`
        },
        body: JSON.stringify(searchInput)
      });

      if (!runResponse.ok) {
        throw new Error(`Erreur Apify: ${runResponse.status} ${runResponse.statusText}`);
      }

      const runData = await runResponse.json();
      const runId = runData.data.id;

      // Attendre que le run se termine
      const results = await this.waitForRunCompletion(runId);
      
      // Transformer les résultats au format attendu
      const transformedResults: ApifyResult[] = results.map((item: any) => ({
        title: item.title || item.name || '',
        address: item.address || '',
        phone: item.phoneNumber || item.phone || '',
        website: item.website || item.url || '',
        category: item.categoryName || item.category || '',
        rating: item.totalScore || item.rating || 0,
        reviewsCount: item.reviewsCount || 0,
        latitude: item.location?.lat || item.latitude,
        longitude: item.location?.lng || item.longitude,
        placeId: item.placeId || item.id || '',
        isAdvertisement: item.isAdvertisement || false,
        description: item.description || '',
        imageUrls: item.imageUrls || []
      }));

      return {
        results: transformedResults,
        totalResults: transformedResults.length,
        searchQuery: `${params.enseigne} ${params.location || 'France'}`
      };

    } catch (error) {
      console.error('Erreur lors de la recherche Apify:', error);
      throw new Error(`Erreur de recherche Apify: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Recherche de franchises populaires pour suggestions
   */
  async getPopularFranchises(): Promise<string[]> {
    // Liste des enseignes/franchises populaires en France
    return [
      "McDonald's",
      "Carrefour",
      "Auchan", 
      "Leclerc",
      "Intermarché",
      "Casino",
      "Monoprix",
      "Franprix",
      "Subway",
      "KFC",
      "Burger King",
      "Quick",
      "Pizza Hut",
      "Domino's Pizza",
      "Boulanger",
      "Darty",
      "Fnac",
      "BUT",
      "Conforama",
      "Ikea",
      "Leroy Merlin",
      "Castorama",
      "Bricomarché",
      "Mr. Bricolage",
      "Point P",
      "Renault",
      "Peugeot",
      "Citroën",
      "Ford",
      "Volkswagen",
      "BMW",
      "Mercedes",
      "Audi",
      "Toyota",
      "Nissan",
      "Hyundai",
      "Kia",
      "Fiat",
      "Opel",
      "Dacia",
      "Skoda",
      "Seat",
      "Volvo",
      "Mazda",
      "Honda",
      "Mitsubishi",
      "Suzuki",
      "Pharmacie",
      "Boulangerie",
      "Tabac",
      "Bureau de poste",
      "Banque Populaire",
      "Crédit Agricole",
      "BNP Paribas",
      "Société Générale",
      "LCL",
      "CIC",
      "Banque Postale",
      "Crédit Mutuel",
      "Caisse d'Épargne",
      "HSBC",
      "ING",
      "Boursorama",
      "Orange",
      "SFR",
      "Bouygues Telecom",
      "Free",
      "La Poste Mobile"
    ];
  }

  /**
   * Obtenir le token API Apify (simulation - dans un vrai cas, il faudrait gérer l'authentification)
   */
  private async getApiToken(): Promise<string> {
    // Dans un environnement de production, il faudrait gérer l'authentification Apify
    // Pour le moment, on utilise un token d'exemple ou on simule l'appel
    // Il faudra que le client configure son token API Apify
    
    // Vérifier si le token est en variable d'environnement
    const token = process.env.REACT_APP_APIFY_TOKEN || process.env.APIFY_TOKEN;
    
    if (!token) {
      throw new Error('Token API Apify non configuré. Veuillez définir REACT_APP_APIFY_TOKEN dans vos variables d\'environnement.');
    }
    
    return token;
  }

  /**
   * Attendre que le run Apify se termine
   */
  private async waitForRunCompletion(runId: string, maxWaitTime: number = 60000): Promise<any[]> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 secondes

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const statusResponse = await fetch(`${this.baseUrl}/actor-runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${await this.getApiToken()}`
          }
        });

        if (!statusResponse.ok) {
          throw new Error(`Erreur lors de la vérification du statut: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        const status = statusData.data.status;

        if (status === 'SUCCEEDED') {
          // Récupérer les résultats
          const resultsResponse = await fetch(`${this.baseUrl}/actor-runs/${runId}/dataset/items`, {
            headers: {
              'Authorization': `Bearer ${await this.getApiToken()}`
            }
          });

          if (!resultsResponse.ok) {
            throw new Error(`Erreur lors de la récupération des résultats: ${resultsResponse.status}`);
          }

          return await resultsResponse.json();
        } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
          throw new Error(`Le run Apify a échoué avec le statut: ${status}`);
        }

        // Attendre avant le prochain poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error('Erreur lors de l\'attente du run:', error);
        throw error;
      }
    }

    throw new Error('Timeout: Le run Apify a pris trop de temps à se terminer');
  }

  /**
   * Recherche simplifiée pour test/développement
   */
  async searchEnseigneSimplified(enseigne: string, location?: string): Promise<ApifyResponse> {
    // Version simplifiée pour test sans vraie API Apify
    console.log(`🔍 Recherche simplifiée pour enseigne: "${enseigne}" dans "${location || 'France'}"`);
    
    // Données factices pour les tests
    const mockResults: ApifyResult[] = [
      {
        title: `${enseigne} - Centre Commercial`,
        address: `123 Rue Example, ${location || 'Paris'}, France`,
        phone: '+33 1 23 45 67 89',
        website: `https://www.${enseigne.toLowerCase().replace(/\s+/g, '')}.fr`,
        category: 'Commerce de détail',
        rating: 4.2,
        reviewsCount: 156,
        latitude: 48.8566,
        longitude: 2.3522,
        placeId: `mock-place-id-${enseigne}`,
        isAdvertisement: false,
        description: `Magasin ${enseigne} avec une large gamme de produits`,
        imageUrls: []
      }
    ];

    return {
      results: mockResults,
      totalResults: mockResults.length,
      searchQuery: `${enseigne} ${location || 'France'}`
    };
  }
}

export const apifyService = new ApifyService();
export type { ApifySearchParams, ApifyResult, ApifyResponse }; 