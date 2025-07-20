import React, { useState, useEffect, useCallback } from "react";
import { useProntoData } from "@hooks/useProntoData";
import { MainContent } from "./_components/MainContent";
import { RightPanel } from "./_components/RightPanel";

export const Entreprises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [allowedNames, setAllowedNames] = useState<string[] | null>(null);
  
  // Hook pour les données Pronto avec pagination intelligente
  const { 
    searches, 
    leads, 
    loading, 
    error, 
    currentPage,
    totalPages,
    itemsPerPage,
    totalLeads,
    failedCategories,
    fetchSearches, 
    loadPage,
    setItemsPerPage
  } = useProntoData();

  // Fonction mémorisée pour charger les données initiales
  const loadInitialData = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      await fetchSearches();
      setIsInitialized(true);
    } catch (error) {
      console.error('Erreur lors du chargement des recherches Pronto:', error);
    }
  }, [fetchSearches, isInitialized]);

  // Effet pour charger automatiquement les données Pronto au montage (une seule fois)
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Effet pour charger automatiquement la première page après l'initialisation
  useEffect(() => {
    if (searches.length > 0 && isInitialized && leads.length === 0) {
      loadPage(1);
    }
  }, [searches.length, isInitialized, leads.length, loadPage]);

  // Convertir les données Pronto en format Business pour MainContent
  const businesses = leads.map((leadWithCompany, index) => {
    // Extraire l'adresse depuis headquarters
    const extractAddress = (headquarters: any) => {
      if (!headquarters) return 'Adresse non disponible';
      const parts = [];
      if (headquarters.line1) parts.push(headquarters.line1);
      if (headquarters.city) parts.push(headquarters.city);
      if (headquarters.postalCode) parts.push(headquarters.postalCode);
      if (headquarters.country) parts.push(headquarters.country);
      return parts.length > 0 ? parts.join(', ') : 'Adresse non disponible';
    };

    // Extraire la ville depuis headquarters
    const extractCity = (headquarters: any) => {
      return headquarters?.city || 'Ville non disponible';
    };

    // Extraire le code postal depuis headquarters
    const extractPostalCode = (headquarters: any) => {
      return headquarters?.postalCode || '';
    };

    return {
      id: String(index), // Convertir en string pour correspondre à l'interface Business
      name: leadWithCompany.company.name || 'Nom non disponible',
      activity: leadWithCompany.company.industry || 'Activité non disponible',
      city: extractCity(leadWithCompany.company.headquarters),
      address: extractAddress(leadWithCompany.company.headquarters),
      postalCode: extractPostalCode(leadWithCompany.company.headquarters),
      phone: leadWithCompany.lead?.phones?.[0] || '',
      legalForm: leadWithCompany.company.legalForm || '',
      description: leadWithCompany.company.description || 'Aucune description disponible',
      foundedYear: leadWithCompany.company.foundedYear || null,
      employeeCount: leadWithCompany.company.employeeCount || null,
      revenue: leadWithCompany.company.revenue || null,
      logo: leadWithCompany.company.company_profile_picture || null, // Utiliser company_profile_picture pour le logo
      rating: leadWithCompany.company.rating || null
    };
  });

  // Effet pour écouter l'événement updateBusinessList et mettre à jour allowedNames
  useEffect(() => {
    const handler = (e: any) => setAllowedNames(e.detail);
    window.addEventListener("updateBusinessList", handler);
    return () => window.removeEventListener("updateBusinessList", handler);
  }, []);

  // Gérer les événements de mise à jour de la liste
  useEffect(() => {
    const handler = (e) => {
      setShowCheckbox(!!e.detail);
    };
    window.addEventListener('updateBusinessListShowCheckbox', handler);
    return () => {
      window.removeEventListener('updateBusinessListShowCheckbox', handler);
    };
  }, []);

  // Fonction pour réessayer le chargement
  const handleRetry = useCallback(async () => {
    setIsInitialized(false);
    try {
      await fetchSearches();
      setIsInitialized(true);
    } catch (error) {
      console.error('Erreur lors du rechargement:', error);
    }
  }, [fetchSearches]);

  // Fonction pour changer de page
  const handlePageChange = useCallback((page: number) => {
    loadPage(page);
  }, [loadPage]);

  // Fonction pour changer le nombre d'éléments par page
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  }, [setItemsPerPage]);

  const normalize = (str: string) => str.trim().toLowerCase();
  const filteredBusinesses = allowedNames
    ? businesses.filter(b => allowedNames.map(normalize).includes(normalize(b.name)))
    : businesses;
  console.log('allowedNames:', allowedNames);
  console.log('businesses names:', businesses.map(b => b.name));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Contenu principal */}
      <MainContent
        businesses={filteredBusinesses}
        leads={leads}
        totalBusinesses={totalLeads}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showCheckbox={showCheckbox}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalLeads={totalLeads}
        failedCategories={failedCategories}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      {/* Panel de droite avec statistiques */}
      <RightPanel businesses={businesses} totalBusinesses={totalLeads} />
    </div>
  );
};

export default Entreprises;
