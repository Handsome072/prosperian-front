import React, { useState, useEffect, useCallback } from "react";
import { EntrepriseApiResponse, EntrepriseApiResult, ProntoLeadWithCompany } from "@entities/Business";
import { MainContent } from "./_components/MainContent";
import { RightPanel } from "./_components/RightPanel";
import { useProntoData } from "@hooks/useProntoData";
import { useFilterContext } from "@contexts/FilterContext";

const API_URL =
  "http://localhost:4000/api/search?section_activite_principale=A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U";

export const Entreprises = () => {
  const [businesses, setBusinesses] = useState<EntrepriseApiResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { filters } = useFilterContext();

  // Pronto data
  const { leads: prontoLeads } = useProntoData();

  // Mapping Pronto: nom => { logo, description }
  const prontoMap = prontoLeads.reduce((acc: Record<string, { logo: string; description: string }>, lead: ProntoLeadWithCompany) => {
    if (lead.company && lead.company.name) {
      acc[lead.company.name.trim().toLowerCase()] = {
        logo: lead.company.company_profile_picture,
        description: Winlead.company.description
      };
    }
    return acc;
  }, {});

  // Enrichir les entreprises avec logo/description Pronto si nom identique
  const enrichedBusinesses = businesses.map(biz => {
    const pronto = prontoMap[biz.nom_complet.trim().toLowerCase()];
    return pronto
      ? { ...biz, prontoLogo: pronto.logo, prontoDescription: pronto.description }
      : biz;
  });

  const fetchBusinesses = useCallback(
    async (
      page: number,
      perPageValue: number,
      nafCodes: string[],
      revenueRange: [number, number],
      ageRange: [number, number],
      legalForms: string[],
      idConventionCollective?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_URL}&page=${page}&per_page=${perPageValue}`;

        // Filtres d'activité (codes NAF)
        if (nafCodes.length > 0) {
          url += `&activite_principale=${nafCodes.join(',')}`;
        }

        // Filtres de chiffre d'affaires
        if (revenueRange && revenueRange.length === 2 && (revenueRange[0] > 0 || revenueRange[1] < 1000000)) {
          if (revenueRange[0] > 0) {
            url += `&ca_min=${revenueRange[0]}`;
          }
          if (revenueRange[1] < 1000000) {
            url += `&ca_max=${revenueRange[1]}`;
          }
        }

        // Filtres d'âge d'entreprise
        if (ageRange && ageRange.length === 2 && (ageRange[0] > 0 || ageRange[1] < 50)) {
          if (ageRange[0] > 0) {
            url += `&age_min=${ageRange[0]}`;
          }
          if (ageRange[1] < 50) {
            url += `&age_max=${ageRange[1]}`;
          }
        }

        // Filtres de nature juridique
        if (legalForms && legalForms.length > 0) {
          url += `&nature_juridique=${legalForms.join(',')}`;
        }

        // Filtre de convention collective
        if (idConventionCollective) {
          url += `&id_convention_collective=${idConventionCollective}`;
        }

        console.log('🔍 URL de recherche avec filtres complets:', url);
        console.log('📊 Filtres appliqués:', {
          activites: nafCodes,
          chiffreAffaires: revenueRange,
          ageEntreprise: ageRange,
          naturesJuridiques: legalForms,
          conventionCollective: idConventionCollective
        });

        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erreur lors de la récupération des entreprises");
        }

        const data: EntrepriseApiResponse = await res.json();

        console.log('✅ Réponse API reçue:', {
          total: data.total_results,
          entreprisesRecues: data.results?.length || 0,
          enrichedWithAge: (data as any).enriched_with_age,
          filtersApplied: (data as any).filters_applied
        });

        setBusinesses(data.results || []);
        setTotalResults(data.total_results || 0);
        setCurrentPage(data.page || page);
        setPerPage(data.per_page || perPageValue);
        setTotalPages(data.total_pages || 1);
      } catch (e: any) {
        console.error('❌ Erreur lors de la recherche:', e);
        setError(e.message || "Erreur inconnue");
        setBusinesses([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBusinesses(
      currentPage,
      perPage,
      filters.activities || [],
      filters.revenueRange || [0, 1000000],
      filters.ageRange || [0, 50],
      filters.legalForms || [],
      filters.id_convention_collective || undefined
    );
    // eslint-disable-next-line
  }, [currentPage, perPage, filters.activities, filters.revenueRange, filters.ageRange, filters.legalForms, filters.id_convention_collective]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <RightPanel
        businesses={enrichedBusinesses.map(biz => ({
          city: biz.siege?.libelle_commune || "Ville inconnue",
          activity: biz.activite_principale || "Activité inconnue"
        }))}
        totalBusinesses={totalResults}
        filters={filters}
        onFiltersChange={() => {}}
        availableCities={[]}
        availableLegalForms={[]}
        availableRoles={[]}
        employeeRange={[0, 5000]}
        revenueRange={[0, 1000000]}
        ageRange={[0, 50]}
      />
      <MainContent
        businesses={enrichedBusinesses}
        totalBusinesses={totalResults}
        loading={loading}
        error={error}
        onRetry={() => fetchBusinesses(
          currentPage,
          perPage,
          filters.activities || [],
          filters.revenueRange || [0, 1000000],
          filters.ageRange || [0, 50],
          filters.legalForms || [],
          filters.id_convention_collective || undefined
        )}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={perPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default Entreprises;