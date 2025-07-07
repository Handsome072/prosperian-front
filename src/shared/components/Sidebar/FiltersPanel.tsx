import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter, MapPin } from "lucide-react";
import { FilterState } from "../../../types/Business";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  label: string;
  unit?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  formatValue,
  label,
  unit = ''
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round(min + (percentage / 100) * (max - min));

    if (isDragging === 'min') {
      onChange([Math.min(newValue, value[1]), value[1]]);
    } else {
      onChange([value[0], Math.max(newValue, value[0])]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line
  }, [isDragging, value]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600 font-medium">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500 w-8 text-right">
          {formatValue ? formatValue(min) : min}
        </span>
        <div className="flex-1 relative" ref={sliderRef}>
          <div className="h-2 bg-gray-200 rounded-full relative">
            <div 
              className="h-2 bg-[#E95C41] rounded-full absolute"
              style={{
                left: `${minPercentage}%`,
                width: `${maxPercentage - minPercentage}%`
              }}
            />
            <div 
              className="absolute w-3 h-3 bg-[#E95C41] rounded-full transform -translate-x-1/2 -translate-y-0.5 cursor-pointer hover:bg-orange-600 transition-colors"
              style={{ left: `${minPercentage}%`, top: '50%' }}
              onMouseDown={handleMouseDown('min')}
            />
            <div 
              className="absolute w-3 h-3 bg-[#E95C41] rounded-full transform -translate-x-1/2 -translate-y-0.5 cursor-pointer hover:bg-orange-600 transition-colors"
              style={{ left: `${maxPercentage}%`, top: '50%' }}
              onMouseDown={handleMouseDown('max')}
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 w-12">
          {formatValue ? formatValue(max) : max}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
        <span>{formatValue ? formatValue(value[0]) : value[0]}{unit}</span>
        <span>{formatValue ? formatValue(value[1]) : value[1]}{unit}</span>
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
  employeeRange,
  revenueRange,
  ageRange,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["activities", "key-figures"]);
  const [activitySearch, setActivitySearch] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]));
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

  const filteredActivities = availableActivities.filter((activity) =>
    activity.toLowerCase().includes(activitySearch.toLowerCase())
  );

  const FilterSection = ({
    title,
    id,
    children,
    hasCheckbox = false,
  }: {
    title: string;
    id: string;
    children?: React.ReactNode;
    hasCheckbox?: boolean;
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {hasCheckbox && <div className="w-4 h-4 border border-gray-300 rounded"></div>}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes(id) ? "rotate-180" : ""}`}
        />
      </button>
      {expandedSections.includes(id) && children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filtres Entreprises</span>
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
              })
            }
            className="ml-auto text-xs text-orange-600 hover:text-orange-700 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      <div>
        <FilterSection title="Activités" id="activities">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <div className="max-h-48 overflow-y-auto space-y-2">
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
        </FilterSection>

        <FilterSection title="Chiffres clés" id="key-figures">
          <div className="space-y-6">
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
        </FilterSection>

        <FilterSection title="Forme juridique" id="legal">
          <div className="space-y-2 max-h-48 overflow-y-auto">
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
        </FilterSection>

        <FilterSection title="Localisation" id="location">
          <div className="space-y-2 max-h-48 overflow-y-auto">
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
        </FilterSection>
      </div>

      {/* Active Filters Summary */}
      {(filters.activities.length > 0 || filters.cities.length > 0 || filters.legalForms.length > 0) && (
        <div className="p-4 bg-orange-50 border-t border-orange-200">
          <div className="text-sm font-medium text-orange-800 mb-2">Filtres actifs:</div>
          <div className="space-y-1 text-xs text-orange-700">
            {filters.activities.length > 0 && <div>• {filters.activities.length} activité(s)</div>}
            {filters.cities.length > 0 && <div>• {filters.cities.length} ville(s)</div>}
            {filters.legalForms.length > 0 && <div>• {filters.legalForms.length} forme(s) juridique(s)</div>}
          </div>
        </div>
      )}
    </>
  );
};
