// In FiltersPanel.tsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Filter, MapPin, ChevronDown } from "lucide-react";
import { FilterState } from "@entities/Business";
import { useFilterContext } from "@contexts/FilterContext";

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
  availableActivities: string[];
  availableCities: string[];
  availableLegalForms: string[];
  availableRoles: string[];
  employeeRange: [number, number];
  revenueRange: [number, number];
  ageRange: [number, number];
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  availableActivities,
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

  const [activitySearch, setActivitySearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");

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

  const filteredActivities = availableActivities.filter((activity) =>
    activity.toLowerCase().includes(activitySearch.toLowerCase())
  );

  const filteredRoles = availableRoles.filter((role) =>
    role.toLowerCase().includes(roleSearch.toLowerCase())
  );

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
                  <div className="pt-2 pb-4">
                    <input
                      type="text"
                      placeholder="Rechercher une activité..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {filteredActivities.map((activity) => (
                        <label key={activity} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.activities.includes(activity)}
                            onChange={() => toggleActivity(activity)}
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <span className="text-gray-700">{activity}</span>
                        </label>
                      ))}
                    </div>
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
                  <div className="pt-2 pb-4">
                    <input
                      type="text"
                      placeholder="Rechercher une activité..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {filteredActivities.map((activity) => (
                        <label key={activity} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.activities.includes(activity)}
                            onChange={() => toggleActivity(activity)}
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <span className="text-gray-700">{activity}</span>
                        </label>
                      ))}
                    </div>
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