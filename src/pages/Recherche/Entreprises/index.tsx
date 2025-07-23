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
        description: lead.company.description
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
    async (page: number, perPageValue: number, nafCodes: string[], revenueRange: [number, number], legalForms: string[], idConventionCollective?: string) => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_URL}&page=${page}&per_page=${perPageValue}`;
        if (nafCodes.length > 0) {
          url += `&activite_principale=${nafCodes.join(',')}`;
        }
        if (revenueRange && revenueRange.length === 2) {
          url += `&ca_min=${revenueRange[0]}&ca_max=${revenueRange[1]}`;
        }
        if (legalForms && legalForms.length > 0) {
          url += `&nature_juridique=${legalForms.join(',')}`;
        }
        if (idConventionCollective) {
          url += `&id_convention_collective=${idConventionCollective}`;
        }
        console.log('Fetching URL:', url);
        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) throw new Error("Erreur lors de la récupération des entreprises");
        const data: EntrepriseApiResponse = await res.json();
        setBusinesses(data.results);
        setTotalResults(data.total_results);
        setCurrentPage(data.page);
        setPerPage(data.per_page);
        setTotalPages(data.total_pages);
      } catch (e: any) {
        setError(e.message || "Erreur inconnue");
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
      filters.revenueRange || [0, 0],
      filters.legalForms || [],
      filters.id_convention_collective || undefined
    );
    // eslint-disable-next-line
  }, [currentPage, perPage, filters.activities, filters.revenueRange, filters.legalForms, filters.id_convention_collective]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MainContent
        businesses={enrichedBusinesses}
        totalBusinesses={totalResults}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={perPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      <RightPanel businesses={enrichedBusinesses} totalBusinesses={totalResults} />
    </div>
  );
};

export default Entreprises;
