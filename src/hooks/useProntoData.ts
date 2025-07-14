import { useState, useEffect, useCallback, useRef } from 'react';
import { ProntoService } from '@services/prontoService';
import { ProntoSearch, ProntoSearchResponse, ProntoLeadWithCompany } from '@entities/Business';

interface UseProntoDataReturn {
  searches: ProntoSearch[];
  currentSearch: ProntoSearchResponse | null;
  leads: ProntoLeadWithCompany[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalLeads: number;
  failedCategories: number;
  fetchSearches: () => Promise<void>;
  fetchSearchWithLeads: (searchId: string) => Promise<void>;
  fetchSearchLeads: (searchId: string, page?: number, limit?: number) => Promise<void>;
  fetchAllSearchesComplete: (includeLeads?: boolean, leadsPerSearch?: number) => Promise<any>;
  loadPage: (page: number) => Promise<void>;
  setItemsPerPage: (itemsPerPage: number) => void;
}

export const useProntoData = (): UseProntoDataReturn => {
  const [searches, setSearches] = useState<ProntoSearch[]>([]);
  const [currentSearch, setCurrentSearch] = useState<ProntoSearchResponse | null>(null);
  const [leads, setLeads] = useState<ProntoLeadWithCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalLeads, setTotalLeads] = useState(0);
  const [failedCategories, setFailedCategories] = useState(0);
  
  // Référence pour éviter les appels multiples simultanés
  const loadingRef = useRef(false);
  
  // Cache pour stocker les leads par catégorie
  const leadsCache = useRef<Map<string, ProntoLeadWithCompany[]>>(new Map());
  
  // Calculer le nombre total de pages basé sur toutes les entreprises
  const totalPages = Math.ceil(totalLeads / itemsPerPage);

  const fetchSearches = useCallback(async () => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const searchesData = await ProntoService.getAllSearches();
      setSearches(searchesData);
      
      // Calculer le total des leads
      const total = searchesData.reduce((sum, search) => sum + search.leads_count, 0);
      setTotalLeads(total);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des recherches');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const fetchSearchWithLeads = useCallback(async (searchId: string) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const searchData = await ProntoService.getSearchWithLeads(searchId);
      setCurrentSearch(searchData);
      setLeads(searchData.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des détails de la recherche');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const fetchSearchLeads = useCallback(async (searchId: string, page: number = 1, limit: number = 100) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const searchData = await ProntoService.getSearchLeads(searchId, page, limit);
      setCurrentSearch(searchData);
      setLeads(searchData.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des leads');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const fetchAllSearchesComplete = useCallback(async (includeLeads: boolean = true, leadsPerSearch: number = 50) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const completeData = await ProntoService.getAllSearchesComplete(includeLeads, leadsPerSearch);
      return completeData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des données complètes');
      throw err;
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Fonction optimisée pour charger une page spécifique
  const loadPage = useCallback(async (page: number) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      // Calculer quelle catégorie et quelles entreprises nous avons besoin
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      // Trouver les catégories nécessaires pour cette page
      const neededLeads: ProntoLeadWithCompany[] = [];
      let currentIndex = 0;
      let failedCategories = 0;
      
      for (const search of searches) {
        // Vérifier si cette catégorie est déjà en cache
        if (!leadsCache.current.has(search.id)) {
          console.log(`Chargement de la catégorie: ${search.name} (${search.leads_count} entreprises)`);
          
          try {
            // Charger toutes les entreprises de cette catégorie
            const searchData = await ProntoService.getSearchLeads(search.id);
            const searchLeads = searchData.leads || [];
            
            // Mettre en cache
            leadsCache.current.set(search.id, searchLeads);
            
            console.log(`✓ ${searchLeads.length} entreprises chargées pour ${search.name}`);
            
          } catch (err) {
            console.error(`⚠️ Erreur lors du chargement de ${search.name}:`, err);
            failedCategories++;
            
            // Marquer cette catégorie comme vide pour éviter de réessayer
            leadsCache.current.set(search.id, []);
            
            // Continuer avec les autres catégories
            continue;
          }
        }
        
        const cachedLeads = leadsCache.current.get(search.id) || [];
        
        // Ajouter les entreprises nécessaires pour cette page
        for (const lead of cachedLeads) {
          if (currentIndex >= startIndex && currentIndex < endIndex) {
            neededLeads.push(lead);
          }
          currentIndex++;
          
          // Si on a assez d'entreprises, on peut arrêter
          if (neededLeads.length >= itemsPerPage) {
            break;
          }
        }
        
        // Si on a assez d'entreprises, on peut arrêter
        if (neededLeads.length >= itemsPerPage) {
          break;
        }
      }
      
      // Afficher les entreprises de cette page
      setLeads(neededLeads);
      setCurrentPage(page);
      
      // Mettre à jour le nombre de catégories échouées
      setFailedCategories(failedCategories);
      
      // Afficher un message d'information si des catégories ont échoué
      if (failedCategories > 0) {
        console.warn(`⚠️ ${failedCategories} catégorie(s) n'ont pas pu être chargées (404 ou erreur)`);
      }
      
      console.log(`Page ${page}: Affichage de ${neededLeads.length} entreprises (${startIndex + 1} à ${startIndex + neededLeads.length} sur ${totalLeads} totales)`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la page');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [searches, itemsPerPage, totalLeads]);

  // Fonction pour changer le nombre d'éléments par page
  const handleSetItemsPerPage = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    // Recharger la page courante avec le nouveau nombre d'éléments
    if (currentPage > 0) {
      loadPage(currentPage);
    }
  }, [currentPage, loadPage]);

  return {
    searches,
    currentSearch,
    leads,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalLeads,
    failedCategories,
    fetchSearches,
    fetchSearchWithLeads,
    fetchSearchLeads,
    fetchAllSearchesComplete,
    loadPage,
    setItemsPerPage: handleSetItemsPerPage
  };
}; 