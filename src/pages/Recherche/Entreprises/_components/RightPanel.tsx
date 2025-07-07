import React from 'react';
import { MapPin, TrendingUp, Info } from 'lucide-react';

interface RightPanelProps {
  businesses: any[];
}

export const RightPanel: React.FC<RightPanelProps> = ({ businesses }) => {
  // Calculate geographic distribution
  const getGeographicDistribution = () => {
    const cityCount: { [key: string]: number } = {};
    businesses.forEach(business => {
      cityCount[business.city] = (cityCount[business.city] || 0) + 1;
    });
    
    return Object.entries(cityCount)
      .map(([city, count]) => ({
        city,
        count,
        percentage: ((count / businesses.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Calculate top activity sectors
  const getTopActivitySectors = () => {
    const activityCount: { [key: string]: number } = {};
    businesses.forEach(business => {
      activityCount[business.activity] = (activityCount[business.activity] || 0) + 1;
    });
    
    return Object.entries(activityCount)
      .map(([activity, count]) => ({
        activity,
        count,
        percentage: ((count / businesses.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10
  };

  const geographicData = getGeographicDistribution();
  const activityData = getTopActivitySectors();

  // Color palette for the bars
  const colors = [
    'bg-blue-600',
    'bg-indigo-600', 
    'bg-purple-600',
    'bg-pink-600',
    'bg-red-600',
    'bg-orange-600',
    'bg-yellow-600',
    'bg-green-600',
    'bg-teal-600',
    'bg-cyan-600'
  ];

  return (
    <div className="w-100 md:w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto">
      {/* Geographic Distribution */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Répartitions géographiques</h3>
        </div>
        
        {/* France Map Placeholder */}
        <div className="mb-6">
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Simplified France map representation */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Simplified France outline */}
                <path
                  d="M50 40 L150 30 L170 60 L160 120 L140 160 L100 170 L60 160 L40 120 L30 80 Z"
                  fill="currentColor"
                  className="text-orange-400"
                />
                {/* Regional divisions */}
                <circle cx="80" cy="60" r="8" fill="currentColor" className="text-red-500" />
                <circle cx="120" cy="80" r="6" fill="currentColor" className="text-blue-500" />
                <circle cx="100" cy="120" r="7" fill="currentColor" className="text-green-500" />
                <circle cx="140" cy="100" r="5" fill="currentColor" className="text-purple-500" />
                <circle cx="70" cy="140" r="6" fill="currentColor" className="text-yellow-500" />
              </svg>
            </div>
            <div className="relative z-10 text-center">
              <div className="text-2xl font-bold text-orange-700">{businesses.length}</div>
              <div className="text-sm text-orange-600">entreprises</div>
            </div>
          </div>
        </div>

        {/* Geographic breakdown */}
        <div className="space-y-3">
          {geographicData.map((item, index) => (
            <div key={item.city} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                <span className="text-sm text-gray-700">{item.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                <span className="text-xs text-gray-500">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Activity Sectors */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Top des secteurs d'activités</h3>
          <Info className="w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-4">
          {activityData.map((item, index) => (
            <div key={item.activity} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium truncate pr-2">
                  {item.activity}
                </span>
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colors[index % colors.length]}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {item.count} entreprise{item.count > 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Répartition basée sur {businesses.length} entreprises analysées
          </div>
        </div>
      </div>
    </div>
  );
};