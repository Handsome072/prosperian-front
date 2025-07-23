// In FiltersPanel.tsx
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { Filter, MapPin, ChevronDown } from "lucide-react";
import { FilterState } from "@entities/Business";
import { useFilterContext } from "@contexts/FilterContext";
import { ListService, List } from "@services/listService";
import axios from 'axios';
import nafCodes from '@data/naf_codes.json';
import naturesJuridiques from '@data/natures_juridiques.json';
import conventionsCollectives from '@data/conventions_collectives.json';
import ReactDOM from 'react-dom';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  label: string;
  unit?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  formatValue,
  label,
  unit,
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: [number, number]) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMouseDown = (index: 0 | 1) => (e: React.MouseEvent) => {
    e.preventDefault();
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const updateValue = (clientX: number) => {
      const percentage = (clientX - rect.left) / rect.width;
      let newVal = Math.round(min + percentage * (max - min));
      newVal = Math.max(min, Math.min(max, newVal));

      const newValues: [number, number] = [...localValue];
      newValues[index] = newVal;

      if (index === 0 && newVal > localValue[1]) {
        newValues[1] = newVal;
      } else if (index === 1 && newVal < localValue[0]) {
        newValues[0] = newVal;
      }

      handleChange([Math.min(newValues[0], newValues[1]), Math.max(newValues[0], newValues[1])]);
    };

    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    updateValue(e.clientX);
  };

  const percentageLeft = ((localValue[0] - min) / (max - min)) * 100;
  const percentageRight = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>
          {formatValue ? formatValue(localValue[0]) : localValue[0]}
          {unit && ` ${unit}`} -{" "}
          {formatValue ? formatValue(localValue[1]) : localValue[1]}
          {unit && ` ${unit}`}
        </span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded" ref={trackRef}>
        <div
          className="absolute h-2 bg-orange-500 rounded"
          style={{
            left: `${percentageLeft}%`,
            width: `${percentageRight - percentageLeft}%`,
          }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1 cursor-pointer"
          style={{ left: `${percentageLeft}%`, top: "50%" }}
          onMouseDown={handleMouseDown(0)}
        ></div>
        <div
          className="absolute w-4 h-4 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1 cursor-pointer"
          style={{ left: `${percentageRight}%`, top: "50%" }}
          onMouseDown={handleMouseDown(1)}
        ></div>
      </div>
    </div>
  );
};

export interface FiltersPanelProps extends FilterState {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCities: string[];
  availableLegalForms: string[];
  availableRoles: string[];
  employeeRange: [number, number];
  revenueRange: [number, number];
  ageRange: [number, number];
  // onNafCodesChange?: (codes: string[]) => void; // SUPPRIMÉ
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  availableCities,
  availableLegalForms,
  availableRoles,
  employeeRange,
  revenueRange,
  ageRange,
  // onNafCodesChange, // SUPPRIMÉ
}) => {
  console.log('FiltersPanel mounted');
  const { setFilters } = useFilterContext();
  const location = useLocation();
  // Détecter la section par défaut selon la route
  const isContactPage = location.pathname.includes("/recherche/contact");
  const isEntreprisePage = location.pathname.includes("/recherche/entreprises") || location.pathname === "/recherche";

  // Ajout 'listes' comme valeur possible
  const [expandedMainSection, setExpandedMainSection] = useState<'entreprise' | 'contact' | 'listes' | null>(
    isContactPage ? 'contact' : 'entreprise'
  );

  const [activitySearch, setActivitySearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [nafModalOpen, setNafModalOpen] = useState(false);
  const [selectedNafCodes, setSelectedNafCodes] = useState<string[]>([]);

  // Ajoute un state pour la recherche
  const [legalFormSearch, setLegalFormSearch] = useState("");

  // Ajoute un state pour la recherche de convention collective
  const [conventionSearch, setConventionSearch] = useState("");
  // Supprime la déclaration de conventionsCollectives (liste statique)
  // Remplace selectedConventions par selectedConventionId (string|null)
  const [selectedConventionId, setSelectedConventionId] = useState<string|null>(null);

  // Ajoute un state pour l'ouverture des sections de conventions collectives
  const [openConventionSections, setOpenConventionSections] = useState<{ [prefix: string]: boolean }>({ '0': true });

  // Fonction utilitaire pour grouper par millier
  const conventionsGrouped = conventionsCollectives.reduce((acc: Record<string, typeof conventionsCollectives>, c) => {
    const prefix = c.idcc[0];
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(c);
    return acc;
  }, {});
  const conventionPrefixes = Object.keys(conventionsGrouped).sort();

  // Gestion de l'ouverture/fermeture des sous-filtres dans chaque section principale
  const [openEntrepriseFilters, setOpenEntrepriseFilters] = useState<{ [key: string]: boolean }>(() => {
    return {
      activites: isEntreprisePage,
      chiffres: isEntreprisePage,
      forme: isEntreprisePage,
    };
  });
  const [openContactFilters, setOpenContactFilters] = useState<{ [key: string]: boolean }>(() => {
    return {
      roles: isContactPage,
      localisation: isContactPage,
    };
  });

  // Synchroniser l'ouverture par défaut lors du changement de route
  useEffect(() => {
    setExpandedMainSection(isContactPage ? 'contact' : 'entreprise');
    setOpenEntrepriseFilters({
      activites: isEntreprisePage,
      chiffres: isEntreprisePage,
      forme: isEntreprisePage,
    });
    setOpenContactFilters({
      roles: isContactPage,
      localisation: isContactPage,
    });
  }, [isContactPage, isEntreprisePage]);

  const toggleEntrepriseFilter = (key: string) => {
    setOpenEntrepriseFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleContactFilter = (key: string) => {
    setOpenContactFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const safeFilters = {
    activities: [],
    cities: [],
    legalForms: [],
    roles: [],
    ...filters
  };

  const toggleActivity = (activity: string) => {
    const currentActivities = safeFilters.activities;
    const newActivities = currentActivities.includes(activity)
      ? currentActivities.filter((a) => a !== activity)
      : [...currentActivities, activity];
    updateFilters({ activities: newActivities });
  };

  const toggleCity = (city: string) => {
    const currentCities = safeFilters.cities;
    const newCities = currentCities.includes(city)
      ? currentCities.filter((c) => c !== city)
      : [...currentCities, city];
    updateFilters({ cities: newCities });
  };

  const toggleLegalForm = (form: string) => {
    const currentLegalForms = safeFilters.legalForms;
    const newForms = currentLegalForms.includes(form)
      ? currentLegalForms.filter((f) => f !== form)
      : [...currentLegalForms, form];
    updateFilters({ legalForms: newForms });
  };

  const toggleRole = (role: string) => {
    const currentRoles = safeFilters.roles;
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    updateFilters({ roles: newRoles });
  };

  const filteredRoles = availableRoles.filter((role) =>
    role.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const [importedLists, setImportedLists] = useState<List[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    // Charger les listes importées au montage
    ListService.getAllImportedLists()
      .then((data) => setImportedLists(data))
      .catch(() => setImportedLists([]))
      .finally(() => setLoadingLists(false));
  }, []);

  const handleNafCheckbox = (code: string) => {
    setSelectedNafCodes((prev) => {
      const newCodes = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      setFilters({ ...filters, activities: newCodes });
      return newCodes;
    });
  };

  const legalFormListRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const conventionListRef = useRef<HTMLDivElement>(null);
  const lastConventionScrollTop = useRef(0);

  // Adapte MainSection pour accepter 'listes'
  const MainSection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: 'entreprise' | 'contact' | 'listes';
    children?: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setExpandedMainSection(expandedMainSection === id ? null : id)}
        className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors rounded-t-lg ${expandedMainSection === id ? 'bg-gray-100' : ''}`}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <span className="text-xl font-bold text-gray-500 select-none">
          {expandedMainSection === id ? '-' : '+'}
        </span>
      </button>
      {expandedMainSection === id && children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  return (
    <>
      {/* Section Listes importées toujours ouverte, non réductible */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="font-medium text-gray-900 mb-2">Listes importées</div>
        {loadingLists ? (
          <div className="text-xs text-gray-500">Chargement...</div>
        ) : importedLists.length === 0 ? (
          <div className="text-xs text-gray-500">Aucune liste importée</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {importedLists.map((list) => (
              <button
                key={list.id}
                className="text-white text-sm font-normal py-1 px-3 rounded-full transition hover:opacity-90 truncate max-w-full"
                type="button"
                title={list.nom}
                style={{ background: 'linear-gradient(to right, #141838, #2a2f5a)' }}
                onClick={async () => {
                  try {
                    const res = await axios.get(`/api/list/${list.id}/first-column`);
                    window.dispatchEvent(new CustomEvent('updateBusinessList', { detail: res.data }));
                    console.log('Liste des noms autorisés envoyée:', res.data);
                  } catch (err) {
                    alert("Erreur lors de la récupération des noms d'entreprise !");
                    console.error(err);
                  }
                }}
              >
                {list.nom}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filtres</span>
          <button
            onClick={() =>
              onFiltersChange({
                searchTerm: "",
                activities: [],
                employeeRange: employeeRange,
                revenueRange: revenueRange,
                ageRange: ageRange,
                cities: [],
                legalForms: [],
                ratingRange: [0, 5],
                roles: [],
              })
            }
            className="ml-auto text-xs text-orange-600 hover:text-orange-700 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div>
        {/* Affichage dynamique de l'ordre des sections selon la page */}
        {/* Toujours afficher la section Entreprise en premier si on est sur la page entreprise */}
        {isEntreprisePage ? (
          <>
            <MainSection title="Entreprise" id="entreprise">
      {/* Activités (UI inspirée de l'image fournie) */}
      <div className="mb-2 border-b border-gray-100 last:border-b-0">
        <button
          className="w-full flex items-center justify-between py-2 text-left"
          onClick={() => toggleEntrepriseFilter('activites')}
        >
          <span className="font-semibold">Activités</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.activites ? 'rotate-180' : ''}`}
          />
        </button>
        {openEntrepriseFilters.activites && (
          <div className="pt-2 pb-4 space-y-4">
            {/* Onglets de recherche */}
            <div className="flex flex-wrap gap-2">
              {['Code NAF', 'Activité Google (GMB)', 'Sémantique', 'Enseigne/Franchise'].map((label, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded text-sm font-medium border ${
                    label === 'Code NAF' ? 'bg-orange-600 text-white border-orange-600' : 'text-orange-600 border-orange-300'
                  } hover:bg-orange-50 transition`}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Zone de recherche */}
            <input
              type="text"
              placeholder="Mots-clés, code NAF"
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />

            {/* Boutons de code et chargement */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded border border-gray-300"
                        onClick={() => { console.log('NAF modal click'); setNafModalOpen(true); }}
              >
                📘 Codes NAF
              </button>
              <button
                type="button"
                className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded border border-gray-300"
              >
                ⬆️ Charger
              </button>
            </div>

            {/* Checkbox d'exclusion */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-600 rounded"
                onChange={(e) =>
                  updateFilters({
                    excludeSelectedActivities: e.target.checked,
                  } as any) // ajuster selon ton type exact
                }
              />
              <span className="text-gray-700">Exclure les éléments sélectionnés</span>
            </label>
          </div>
        )}
      </div>
              {/* Chiffres clés */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleEntrepriseFilter('chiffres')}
                >
                  <span className="font-semibold">Chiffres clés</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.chiffres ? 'rotate-180' : ''}`}
                  />
                </button>
                {openEntrepriseFilters.chiffres && (
                  <div className="pt-2 pb-4 space-y-4">
                    <RangeSlider
                      min={ageRange[0]}
                      max={ageRange[1]}
                      value={filters.ageRange}
                      onChange={(value) => updateFilters({ ageRange: value })}
                      label="Âge de l'entreprise"
                      unit=" ans"
                    />
                    <RangeSlider
                      min={employeeRange[0]}
                      max={employeeRange[1]}
                      value={filters.employeeRange}
                      onChange={(value) => updateFilters({ employeeRange: value })}
                      label="Nombre d'employés"
                    />
                    <RangeSlider
                      min={revenueRange[0]}
                      max={revenueRange[1]}
                      value={filters.revenueRange}
                      onChange={(value) => setFilters({ ...filters, revenueRange: value })}
                      label="Chiffre d'affaires"
                      formatValue={(v) => `${Math.round(v / 1000)}k`}
                      unit="€"
                    />
                    <RangeSlider
                      min={0}
                      max={5}
                      value={filters.ratingRange}
                      onChange={(value) => updateFilters({ ratingRange: value })}
                      label="Note minimum"
                      formatValue={(v) => v.toFixed(1)}
                      unit="⭐"
                    />
                  </div>
                )}
              </div>
              {/* Juridique */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleEntrepriseFilter('forme')}
                >
                  <span className="font-semibold">Juridique</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.forme ? 'rotate-180' : ''}`}
                  />
                </button>
                {openEntrepriseFilters.forme && (
                  <div className="pt-2 pb-4 space-y-6">
                    {/* Section Forme juridique avec scroll dédié */}
                    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2 bg-white">
                      <div className="font-semibold text-base text-gray-700 mb-1">Forme juridique</div>
                      <input
                        type="text"
                        placeholder="Rechercher une forme juridique..."
                        value={legalFormSearch}
                        onChange={e => setLegalFormSearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      {naturesJuridiques
                        .filter(nature => nature.titre.toLowerCase().includes(legalFormSearch.toLowerCase()))
                        .map((nature) => (
                          <label key={nature.id} className="flex items-center space-x-2 text-base">
                            <input
                              type="checkbox"
                              checked={safeFilters.legalForms.includes(nature.id)}
                              onChange={() => {
                                if (legalFormListRef.current) {
                                  lastScrollTop.current = legalFormListRef.current.scrollTop;
                                }
                                const currentIds = safeFilters.legalForms || [];
                                const newIds = currentIds.includes(nature.id)
                                  ? currentIds.filter((id) => id !== nature.id)
                                  : [...currentIds, nature.id];
                                setFilters({ ...filters, legalForms: newIds });
                              }}
                              className="w-4 h-4 text-orange-600 rounded"
                            />
                            <span className="text-gray-700">{nature.titre}</span>
                          </label>
                        ))}
                    </div>
                    {/* Séparateur */}
                    <div className="border-t border-gray-200 my-2"></div>
                    {/* Section Convention Collective avec scroll dédié */}
                    <div
                      ref={conventionListRef}
                      className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 bg-white"
                    >
                      <div className="font-semibold text-base text-gray-700 mb-1 mt-0">Convention Collective</div>
                      <input
                        type="text"
                        placeholder="Rechercher une convention..."
                        value={conventionSearch}
                        onChange={e => setConventionSearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      {conventionPrefixes.map(prefix => (
                        <div key={prefix}>
                          <button
                            type="button"
                            className="w-full flex items-center justify-between py-1 text-left font-semibold text-orange-700 hover:bg-orange-50 rounded"
                            onClick={() => setOpenConventionSections(s => ({ ...s, [prefix]: !s[prefix] }))}
                          >
                            <span>{prefix}XXX</span>
                            <span className="text-xl font-bold text-gray-500 select-none">{openConventionSections[prefix] ? '-' : '+'}</span>
                          </button>
                          {openConventionSections[prefix] && (
                            <div className="pl-2 space-y-1">
                              {conventionsGrouped[prefix]
                                .filter(c => c.titre.toLowerCase().includes(conventionSearch.toLowerCase()))
                                .map(c => (
                                  <label key={c.idcc} className="flex items-center space-x-2 text-base">
                                    <input
                                      type="checkbox"
                                      checked={selectedConventionId === c.idcc}
                                      onChange={() => {
                                        if (conventionListRef.current) {
                                          lastConventionScrollTop.current = conventionListRef.current.scrollTop;
                                        }
                                        if (selectedConventionId === c.idcc) {
                                          setSelectedConventionId(null);
                                          setFilters({ ...filters, id_convention_collective: undefined });
                                        } else {
                                          setSelectedConventionId(c.idcc);
                                          setFilters({ ...filters, id_convention_collective: c.idcc });
                                        }
                                      }}
                                      className="w-4 h-4 text-orange-600 rounded"
                                    />
                                    <span className="text-gray-700">{c.titre}</span>
                                  </label>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

                            {/* Localisation */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleContactFilter('localisation')}
                >
                  <span className="font-semibold">Localisation</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openContactFilters.localisation ? 'rotate-180' : ''}`}
                  />
                </button>
                {openContactFilters.localisation && (
                  <div className="pt-2 pb-4 space-y-2 max-h-32 overflow-y-auto">
                    {availableCities.map((city) => (
                      <label key={city} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={safeFilters.cities.includes(city)}
                          onChange={() => toggleCity(city)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {city}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </MainSection>
            <MainSection title="Contact" id="contact">
              {/* Rôles */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleContactFilter('roles')}
                >
                  <span className="font-semibold">Rôles</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openContactFilters.roles ? 'rotate-180' : ''}`}
                  />
                </button>
                {openContactFilters.roles && (
                  <div className="pt-2 pb-4">
                    <input
                      type="text"
                      placeholder="Rechercher un rôle..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {filteredRoles.map((role) => (
                        <label key={role} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={safeFilters.roles.includes(role)}
                            onChange={() => toggleRole(role)}
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <span className="text-gray-700">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Localisation */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleContactFilter('localisation')}
                >
                  <span className="font-semibold">Localisation</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openContactFilters.localisation ? 'rotate-180' : ''}`}
                  />
                </button>
                {openContactFilters.localisation && (
                  <div className="pt-2 pb-4 space-y-2 max-h-32 overflow-y-auto">
                    {availableCities.map((city) => (
                      <label key={city} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={safeFilters.cities.includes(city)}
                          onChange={() => toggleCity(city)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {city}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </MainSection>
          </>
        ) : (
          <>
            <MainSection title="Contact" id="contact">
              {/* Rôles */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleContactFilter('roles')}
                >
                  <span className="font-semibold">Rôles</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openContactFilters.roles ? 'rotate-180' : ''}`}
                  />
                </button>
                {openContactFilters.roles && (
                  <div className="pt-2 pb-4">
                    <input
                      type="text"
                      placeholder="Rechercher un rôle..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {filteredRoles.map((role) => (
                        <label key={role} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={safeFilters.roles.includes(role)}
                            onChange={() => toggleRole(role)}
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <span className="text-gray-700">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Localisation */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleContactFilter('localisation')}
                >
                  <span className="font-semibold">Localisation</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openContactFilters.localisation ? 'rotate-180' : ''}`}
                  />
                </button>
                {openContactFilters.localisation && (
                  <div className="pt-2 pb-4 space-y-2 max-h-32 overflow-y-auto">
                    {availableCities.map((city) => (
                      <label key={city} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={safeFilters.cities.includes(city)}
                          onChange={() => toggleCity(city)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {city}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </MainSection>
            <MainSection title="Entreprise" id="entreprise">
              {/* Activités */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleEntrepriseFilter('activites')}
                >
                  <span className="font-semibold">Activités</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.activites ? 'rotate-180' : ''}`}
                  />
                </button>
                {openEntrepriseFilters.activites && (
                  <div className="pt-2 pb-4 space-y-4">
                    {/* Onglets de recherche */}
                    <div className="flex flex-wrap gap-2">
                      {['Code NAF', 'Activité Google (GMB)', 'Sémantique', 'Enseigne/Franchise'].map((label, index) => (
                        <button
                          key={index}
                          className={`px-3 py-1 rounded text-sm font-medium border ${
                            label === 'Code NAF' ? 'bg-orange-600 text-white border-orange-600' : 'text-orange-600 border-orange-300'
                          } hover:bg-orange-50 transition`}
                          type="button"
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Zone de recherche */}
                    <input
                      type="text"
                      placeholder="Mots-clés, code NAF"
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />

                    {/* Boutons de code et chargement */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded border border-gray-300"
                        onClick={() => setNafModalOpen(true)}
                      >
                        📘 Codes NAF
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded border border-gray-300"
                      >
                        ⬆️ Charger
                      </button>
                    </div>

                    {/* Checkbox d'exclusion */}
                    <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-orange-600 rounded"
                        onChange={(e) =>
                          updateFilters({
                            excludeSelectedActivities: e.target.checked,
                          } as any) // ajuster selon ton type exact
                        }
                          />
                      <span className="text-gray-700">Exclure les éléments sélectionnés</span>
                        </label>
                  </div>
                )}
              </div>
              {/* Chiffres clés */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleEntrepriseFilter('chiffres')}
                >
                  <span className="font-semibold">Chiffres clés</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.chiffres ? 'rotate-180' : ''}`}
                  />
                </button>
                {openEntrepriseFilters.chiffres && (
                  <div className="pt-2 pb-4 space-y-4">
                    <RangeSlider
                      min={ageRange[0]}
                      max={ageRange[1]}
                      value={filters.ageRange}
                      onChange={(value) => updateFilters({ ageRange: value })}
                      label="Âge de l'entreprise"
                      unit=" ans"
                    />
                    <RangeSlider
                      min={employeeRange[0]}
                      max={employeeRange[1]}
                      value={filters.employeeRange}
                      onChange={(value) => updateFilters({ employeeRange: value })}
                      label="Nombre d'employés"
                    />
                    <RangeSlider
                      min={revenueRange[0]}
                      max={revenueRange[1]}
                      value={filters.revenueRange}
                      onChange={(value) => updateFilters({ revenueRange: value })}
                      label="Chiffre d'affaires"
                      formatValue={(v) => `${Math.round(v / 1000)}k`}
                      unit="€"
                    />
                    <RangeSlider
                      min={0}
                      max={5}
                      value={filters.ratingRange}
                      onChange={(value) => updateFilters({ ratingRange: value })}
                      label="Note minimum"
                      formatValue={(v) => v.toFixed(1)}
                      unit="⭐"
                    />
                  </div>
                )}
              </div>
              {/* Juridique */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleEntrepriseFilter('forme')}
                >
                  <span className="font-semibold">Juridique</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.forme ? 'rotate-180' : ''}`}
                  />
                </button>
                {openEntrepriseFilters.forme && (
                  <div className="pt-2 pb-4 space-y-6 max-h-96 overflow-y-auto">
                    {/* Section Forme juridique */}
                    <div>
                      <div className="font-semibold text-xs text-gray-500 mb-1">Forme juridique</div>
                      <input
                        type="text"
                        placeholder="Rechercher une forme juridique..."
                        value={legalFormSearch}
                        onChange={e => setLegalFormSearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      {naturesJuridiques
                        .filter(nature => nature.titre.toLowerCase().includes(legalFormSearch.toLowerCase()))
                        .map((nature) => (
                          <label key={nature.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                              checked={safeFilters.legalForms.includes(nature.id)}
                              onChange={() => {
                                const currentIds = safeFilters.legalForms || [];
                                const newIds = currentIds.includes(nature.id)
                                  ? currentIds.filter((id) => id !== nature.id)
                                  : [...currentIds, nature.id];
                                setFilters({ ...filters, legalForms: newIds });
                              }}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                            <span className="text-gray-700">{nature.titre}</span>
                      </label>
                    ))}
                  </div>
                    {/* Section Convention Collective */}
                    <div>
                      <div className="font-semibold text-xs text-gray-500 mb-1 mt-4">Convention Collective</div>
                    <input
                      type="text"
                        placeholder="Rechercher une convention..."
                        value={conventionSearch}
                        onChange={e => setConventionSearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                    />
                      {conventionsCollectives
                        .filter(c => c.titre.toLowerCase().includes(conventionSearch.toLowerCase()))
                        .map(c => (
                          <label key={c.idcc} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                              checked={selectedConventionId === c.idcc}
                              onChange={() => {
                                if (selectedConventionId === c.idcc) {
                                  setSelectedConventionId(null);
                                  setFilters({ ...filters, id_convention_collective: undefined });
                                } else {
                                  setSelectedConventionId(c.idcc);
                                  setFilters({ ...filters, id_convention_collective: c.idcc });
                                }
                              }}
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                            <span className="text-gray-700">{c.titre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </MainSection>
          </>
        )}
      </div>

      {(safeFilters.activities.length > 0 || safeFilters.cities.length > 0 || safeFilters.legalForms.length > 0 || safeFilters.roles.length > 0) && (
        <div className="p-4 bg-orange-50 border-t border-orange-200">
          <div className="text-sm font-medium text-orange-800 mb-2">Filtres actifs:</div>
          <div className="space-y-1 text-xs text-orange-700">
            {safeFilters.activities.length > 0 && <div>• {safeFilters.activities.length} activité(s)</div>}
            {safeFilters.cities.length > 0 && <div>• {safeFilters.cities.length} ville(s)</div>}
            {safeFilters.legalForms.length > 0 && <div>• {safeFilters.legalForms.length} forme(s) juridique(s)</div>}
            {safeFilters.roles.length > 0 && <div>• {safeFilters.roles.length} rôle(s)</div>}
          </div>
        </div>
      )}
      {/* Modal NAF Codes */}
      {nafModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-2xl max-h-[80vh] w-full max-w-xl mx-4 sm:mx-0 p-4 sm:p-8 relative flex flex-col">
                <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setNafModalOpen(false)}
              aria-label="Fermer"
                >
              ×
                </button>
            <h2 className="text-lg font-semibold mb-4 text-center">Codes NAF</h2>
            <div className="divide-y divide-gray-200 border rounded overflow-y-auto max-h-[60vh] bg-white">
              {Object.entries(nafCodes).map(([code, label], idx) => (
                <label
                  key={code}
                  className={`flex items-center space-x-2 text-sm px-2 py-2 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-orange-50 transition`}
                  style={{ cursor: 'pointer' }}
                >
                        <input
                          type="checkbox"
                    checked={selectedNafCodes.includes(code)}
                    onChange={() => handleNafCheckbox(code)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                  <span className="font-mono text-gray-800 min-w-[5.5rem]">{code}</span>
                  <span className="text-gray-700 flex-1">{label as string}</span>
                      </label>
                    ))}
                  </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                onClick={() => setNafModalOpen(false)}
              >
                Fermer
              </button>
              </div>
      </div>
        </div>,
        document.body
      )}
      {/* Après le rendu du composant, restaure la position du scroll */}
      {useLayoutEffect(() => {
        if (legalFormListRef.current) {
          legalFormListRef.current.scrollTop = lastScrollTop.current;
        }
      })}
      {useLayoutEffect(() => {
        if (conventionListRef.current) {
          conventionListRef.current.scrollTop = lastConventionScrollTop.current;
        }
      })}
    </>
  );
};