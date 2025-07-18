// In FiltersPanel.tsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Filter, MapPin, ChevronDown } from "lucide-react";
import { FilterState } from "@entities/Business";
import { useFilterContext } from "@contexts/FilterContext";
import { NafModal } from './NafModal';
import { Business } from '@entities/Business';

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
  businesses: Business[]; // Ajouté pour accès aux résultats courants
  availableCities: string[];
  availableLegalForms: string[];
  availableRoles: string[];
  employeeRange: [number, number];
  revenueRange: [number, number];
  ageRange: [number, number];
}

// Fonction utilitaire pour obtenir tous les secteurs d'activité triés par fréquence (plus de slice(0, 10))
const getSortedActivitySectors = (businesses: Business[]) => {
  const activityCount: { [key: string]: number } = {};
  businesses.forEach(business => {
    if (business.activity) {
      activityCount[business.activity] = (activityCount[business.activity] || 0) + 1;
    }
  });
  return Object.entries(activityCount)
    .map(([activity, count]) => ({
      activity,
      count,
      percentage: ((count / businesses.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);
};

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  businesses = [], // valeur par défaut
  availableCities,
  availableLegalForms,
  availableRoles,
  employeeRange,
  revenueRange,
  ageRange,
}) => {
  useFilterContext();
  const location = useLocation();
  // Détecter la section par défaut selon la route
  const isContactPage = location.pathname.includes("/recherche/contact");
  const isEntreprisePage = location.pathname.includes("/recherche/entreprises") || location.pathname === "/recherche";

  const [expandedMainSection, setExpandedMainSection] = useState<'entreprise' | 'contact' | null>(
    isContactPage ? 'contact' : 'entreprise'
  );

  // Ajout d'un état pour le mode de recherche d'activité
  const [activityMode, setActivityMode] = useState<'naf' | 'gmb' | 'semantic' | 'franchise'>('naf');
  const [activitySearch, setActivitySearch] = useState('');

  // Ajout d'un état pour le code NAF et les résultats
  const [nafCode, setNafCode] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nafModalOpen, setNafModalOpen] = useState(false);
  const [nafExclude, setNafExclude] = useState(false);

  // Ajout d'un état pour l'activité sélectionnée dynamiquement
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  // Générer dynamiquement la liste des activités à partir des entreprises affichées (toutes, triées par fréquence)
  const allActivities = getSortedActivitySectors(Array.isArray(businesses) ? businesses : []);

  // Extraction dynamique des rôles à partir des données businesses (champ 'role' string)
  const allRoles = Array.from(new Set(
    (Array.isArray(businesses) ? businesses : [])
      .map(b => b.role)
      .filter((r): r is string => typeof r === 'string' && r.trim() !== '')
  ));

  // DEBUG : Afficher la liste brute des rôles extraits et la liste unique
  console.log('roles extraits', (Array.isArray(businesses) ? businesses : []).map(b => b.role).filter((r): r is string => typeof r === 'string' && r.trim() !== ''));
  console.log('allRoles uniques', allRoles);

  // Fonction pour lancer la recherche par code NAF
  const handleNafSearch = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.activities.length > 0) {
      params.append('activitePrincipaleUniteLegale', filters.activities.join(','));
    }
    if (nafExclude) {
      params.append('exclude', 'true');
    }
    // Ajoute d'autres filtres ici si besoin
    const res = await fetch(`/insee/unitesLegales?${params.toString()}`);
    const data = await res.json();
    setSearchResults(data.unitesLegales || []);
    setLoading(false);
  };

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

  const toggleActivity = (activity: string) => {
    const newActivities = filters.activities.includes(activity)
      ? filters.activities.filter((a) => a !== activity)
      : [...filters.activities, activity];
    updateFilters({ activities: newActivities });
  };

  const toggleCity = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    updateFilters({ cities: newCities });
  };

  const toggleLegalForm = (form: string) => {
    const newForms = filters.legalForms.includes(form)
      ? filters.legalForms.filter((f) => f !== form)
      : [...filters.legalForms, form];
    updateFilters({ legalForms: newForms });
  };

  const toggleRole = (role: string) => {
    const newRoles = filters.roles.includes(role)
      ? filters.roles.filter((r) => r !== role)
      : [...filters.roles, role];
    updateFilters({ roles: newRoles });
  };

  const handleNafConfirm = (selected: string[], exclude: boolean) => {
    updateFilters({ activities: selected });
    setNafExclude(exclude);
    setNafModalOpen(false);
  };

  // Nouveau composant pour les sections principales
  const MainSection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: 'entreprise' | 'contact';
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
        {isContactPage ? (
          <>
            <MainSection title="Contact" id="contact">
              {/* Rôles */}
              {/* Section Rôle dynamique */}
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
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {allRoles.length === 0 && (
                        <div className="text-gray-400 text-sm">Aucun rôle trouvé</div>
                      )}
                      {allRoles.map((role) => (
                        <label key={role} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.roles.includes(role)}
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
                          checked={filters.cities.includes(city)}
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
              {/* Section Activités avancée */}
              <div className="mb-4 p-2 border rounded bg-orange-50">
                <div className="font-semibold mb-1">Recherche par</div>
                <div className="flex gap-2 mb-2">
                  <button
                    className={`px-2 py-1 rounded ${activityMode === 'naf' ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'}`}
                    onClick={() => setActivityMode('naf')}
                  >
                    Code NAF
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${activityMode === 'gmb' ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'}`}
                    onClick={() => setActivityMode('gmb')}
                  >
                    Activité Google (GMB)
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${activityMode === 'semantic' ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'}`}
                    onClick={() => setActivityMode('semantic')}
                  >
                    Sémantique
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${activityMode === 'franchise' ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'}`}
                    onClick={() => setActivityMode('franchise')}
                  >
                    Enseigne/Franchise
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Mots-clés, code NAF"
                  value={activitySearch}
                  onChange={e => setActivitySearch(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                />
                {/* Affichage de l'activité sélectionnée */}
                {/* Ancien code à supprimer :
                {selectedActivity && (
                  <div className="mb-2 text-xs text-orange-700">Activité sélectionnée : <b>{selectedActivity}</b></div>
                )} */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded border border-orange-300 hover:bg-orange-200"
                    onClick={() => setNafModalOpen(true)}
                  >
                    Codes NAF
                  </button>
                  <button
                    className="px-3 py-1 bg-orange-600 text-white rounded"
                    onClick={() => {
                      if (selectedActivity) {
                        updateFilters({ activities: [selectedActivity] });
                      }
                      handleNafSearch();
                    }}
                    disabled={!selectedActivity}
                  >
                    Charger
                  </button>
                </div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={nafExclude}
                    onChange={e => setNafExclude(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Exclure les éléments sélectionnés</span>
                </label>
              </div>
              {/* Bouton Codes NAF et affichage des codes sélectionnés */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded border border-orange-300 hover:bg-orange-200"
                  onClick={() => setNafModalOpen(true)}
                >
                  Codes NAF
                </button>
                {filters.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {filters.activities.map(code => (
                      <span key={code} className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded text-xs">{code}</span>
                    ))}
                  </div>
                )}
              </div>
              <NafModal open={nafModalOpen} onClose={() => setNafModalOpen(false)} onConfirm={handleNafConfirm} />
              {/* Affichage des résultats (exemple, à adapter selon ton UI) */}
              {searchResults.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium text-sm mb-2">Résultats ({searchResults.length}) :</div>
                  <ul className="max-h-40 overflow-y-auto text-xs">
                    {searchResults.map((ent, idx) => (
                      <li key={ent.siren || idx} className="py-1 border-b last:border-b-0">
                        <span className="font-bold">{ent.denominationUniteLegale}</span> — {ent.siren} — {ent.activitePrincipaleUniteLegale}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              {/* Forme juridique */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleEntrepriseFilter('forme')}
                >
                  <span className="font-semibold">Forme juridique</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.forme ? 'rotate-180' : ''}`}
                  />
                </button>
                {openEntrepriseFilters.forme && (
                  <div className="pt-2 pb-4 space-y-2 max-h-32 overflow-y-auto">
                    {availableLegalForms.map((form) => (
                      <label key={form} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.legalForms.includes(form)}
                          onChange={() => toggleLegalForm(form)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-gray-700">{form}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </MainSection>
          </>
        ) : (
          <>
            <MainSection title="Entreprise" id="entreprise">
              {/* Activités */}
              {/* Section Activités en ligne avec checkboxes (comme le right panel) */}
              <div className="mb-4 p-2 border rounded bg-orange-50">
                <div className="font-semibold mb-1">Activités</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {allActivities.map(item => (
                    <label key={item.activity} className="flex items-center space-x-1 text-sm bg-orange-100 px-2 py-1 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.activities.includes(item.activity)}
                        onChange={() => {
                          const newActivities = filters.activities.includes(item.activity)
                            ? filters.activities.filter(a => a !== item.activity)
                            : [...filters.activities, item.activity];
                          onFiltersChange({ ...filters, activities: newActivities });
                        }}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="text-gray-700">{item.activity}</span>
                      <span className="text-xs text-gray-500">({item.count})</span>
                    </label>
                  ))}
                </div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={nafExclude}
                    onChange={e => setNafExclude(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Exclure les éléments sélectionnés</span>
                </label>
              </div>
              {/* Bouton Codes NAF et affichage des codes sélectionnés */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded border border-orange-300 hover:bg-orange-200"
                  onClick={() => setNafModalOpen(true)}
                >
                  Codes NAF
                </button>
                {filters.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {filters.activities.map(code => (
                      <span key={code} className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded text-xs">{code}</span>
                    ))}
                  </div>
                )}
              </div>
              <NafModal open={nafModalOpen} onClose={() => setNafModalOpen(false)} onConfirm={handleNafConfirm} />
              {/* Affichage des résultats (exemple, à adapter selon ton UI) */}
              {searchResults.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium text-sm mb-2">Résultats ({searchResults.length}) :</div>
                  <ul className="max-h-40 overflow-y-auto text-xs">
                    {searchResults.map((ent, idx) => (
                      <li key={ent.siren || idx} className="py-1 border-b last:border-b-0">
                        <span className="font-bold">{ent.denominationUniteLegale}</span> — {ent.siren} — {ent.activitePrincipaleUniteLegale}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              {/* Forme juridique */}
              <div className="mb-2 border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-2 text-left"
                  onClick={() => toggleEntrepriseFilter('forme')}
                >
                  <span className="font-semibold">Forme juridique</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openEntrepriseFilters.forme ? 'rotate-180' : ''}`}
                  />
                </button>
                {openEntrepriseFilters.forme && (
                  <div className="pt-2 pb-4 space-y-2 max-h-32 overflow-y-auto">
                    {availableLegalForms.map((form) => (
                      <label key={form} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.legalForms.includes(form)}
                          onChange={() => toggleLegalForm(form)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-gray-700">{form}</span>
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
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {allRoles.length === 0 && (
                        <div className="text-gray-400 text-sm">Aucun rôle trouvé</div>
                      )}
                      {allRoles.map((role) => (
                        <label key={role} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.roles.includes(role)}
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
                          checked={filters.cities.includes(city)}
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
        )}
      </div>

      {(filters.activities.length > 0 || filters.cities.length > 0 || filters.legalForms.length > 0 || filters.roles.length > 0) && (
        <div className="p-4 bg-orange-50 border-t border-orange-200">
          <div className="text-sm font-medium text-orange-800 mb-2">Filtres actifs:</div>
          <div className="space-y-1 text-xs text-orange-700">
            {filters.activities.length > 0 && <div>• {filters.activities.length} activité(s)</div>}
            {filters.cities.length > 0 && <div>• {filters.cities.length} ville(s)</div>}
            {filters.legalForms.length > 0 && <div>• {filters.legalForms.length} forme(s) juridique(s)</div>}
            {filters.roles.length > 0 && <div>• {filters.roles.length} rôle(s)</div>}
          </div>
        </div>
      )}
    </>
  );
};