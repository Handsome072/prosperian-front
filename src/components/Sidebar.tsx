import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter, Users, Minus } from 'lucide-react';

// RangeSlider tel que fourni (avec corrections de syntaxe)
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
              className="h-2 bg-red-500 rounded-full absolute"
              style={{
                left: `${minPercentage}%`,
                width: `${maxPercentage - minPercentage}%`
              }}
            />
            <div 
              className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-0.5 cursor-pointer hover:bg-red-600 transition-colors"
              style={{ left: `${minPercentage}%`, top: '50%' }}
              onMouseDown={handleMouseDown('min')}
            />
            <div 
              className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-0.5 cursor-pointer hover:bg-red-600 transition-colors"
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

// Sidebar avec RangeSlider
export const Sidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['enterprises', 'legal']);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);
  const [employeesRange, setEmployeesRange] = useState<[number, number]>([0, 1000]);
  const [revenueRange, setRevenueRange] = useState<[number, number]>([0, 1000000]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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
          {hasCheckbox && (
            <div className="w-4 h-4 border border-gray-300 rounded"></div>
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            expandedSections.includes(id) ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expandedSections.includes(id) && children && (
        <div className="px-4 pb-4">{children}</div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Filtres Enterprises */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filtres Enterprises</span>
          <div className="w-4 h-4 border border-gray-300 rounded ml-auto"></div>
        </div>
      </div>

      {/* Filter Sections */}
      <div>
        <FilterSection title="Activités" id="activities">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Code NAF</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Activité Google (GMB)</button>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-orange-500 text-white rounded">Sémantique</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Enseigne/Franchise</button>
            </div>
            <input
              type="text"
              placeholder="Mots-clés, expression"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </FilterSection>

        <FilterSection title="Chiffres clés" id="key-figures">
          <div className="space-y-4">
            <RangeSlider
              min={0}
              max={100}
              value={ageRange}
              onChange={setAgeRange}
              label="Âge de l'entreprise"
            />
            <div>
              <RangeSlider
                min={0}
                max={1000}
                value={employeesRange}
                onChange={setEmployeesRange}
                label="Nombre employés"
              />
              <div className="flex items-center mt-2">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Inclue les effectifs LinkedIn</span>
              </div>
            </div>
            <div>
              <RangeSlider
                min={0}
                max={1000000}
                value={revenueRange}
                onChange={setRevenueRange}
                label="Chiffres d'affaires"
                formatValue={v => v.toLocaleString()}
                unit="€"
              />
              <div className="flex items-center mt-2">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Inclue les valeurs estimées</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Autre indicateur</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Indicateurs</option>
              </select>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Juridique" id="legal">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Forme juridique</label>
              <div className="mt-1 space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Entrepreneur individuel</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Groupement de droit privé non doté de la personnalité morale</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Personne morale de droit étranger</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Personne morale de droit public soumise au droit commercial</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Société commerciale</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Autre personne morale immatriculée au RCS</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Personne morale et organisme soumis au droit administratif</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Organisme privé spécialisé</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Groupement de droit privé</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span>Organisme de placement collectif</span>
                </label>
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Localisation" id="location">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Région, département, ville...</div>
          </div>
        </FilterSection>

        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <span className="font-medium text-gray-900">Web et Technos</span>
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <Minus className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <span className="font-medium text-gray-900">Évènements</span>
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <Minus className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <FilterSection title="Autres" id="others">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Autres critères de filtrage</div>
          </div>
        </FilterSection>
      </div>

      {/* Filtres Contacts */}
      <div className="border-t-4 border-gray-100 mt-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filtres Contacts</span>
            <div className="w-4 h-4 border border-gray-300 rounded ml-auto"></div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span>IA le filtre intelligent</span>
          </div>
        </div>
      </div>
    </div>
  );
};
