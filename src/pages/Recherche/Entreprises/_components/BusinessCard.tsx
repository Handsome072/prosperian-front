import React from 'react';
import { MapPin, Phone, Users, Star, ExternalLink, Building } from 'lucide-react';
import { Business } from '@entities/Business';

interface BusinessCardProps {
  company: Business;
  id?: number;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheckboxChange?: (id: number) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ company, id, showCheckbox, checked, onCheckboxChange }) => {
  const currentYear = new Date().getFullYear();
  const companyAge = company.foundedYear ? currentYear - company.foundedYear : null;

  if (showCheckbox) {
    // Mode liste avec checkbox (t lignes)
    return (
      <div className="p-3 hover:bg-gray-50 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!checked}
            onChange={e => {
              console.log('Checkbox click', { id, checked: e.target.checked });
              if (onCheckboxChange && typeof id === 'number') {
                onCheckboxChange(id);
              }
            }}
            aria-label={`Sélectionner l'entreprise ${company.name}`}
          />
          {/* Logo après la checkbox */}
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-8 h-8 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{company.name}</div>
            <div className="text-gray-500 text-xs">{company.activity}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <span className="text-xs">{company.city}</span>
          <Building size={16} />
          <span className="text-xs text-blue-600 underline">
            {company.legalForm}
          </span>
        </div>
      </div>
    );
  }

  // Mode carte classique
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
                {company.name}
              </h3>
              {company.rating && (
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{company.rating}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-blue-600 mt-1">{company.activity}</p>
            {companyAge && (
              <p className="text-xs text-gray-500 mt-1">Fondée en {company.foundedYear} • {companyAge} ans</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <div>{company.address}</div>
              <div>{company.postalCode} {company.city}</div>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700">{company.phone}</span>
          </div>

          {/* Employees */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              {company.employees}
              {company.employeeCount && (
                <span className="text-gray-500"> ({company.employeeCount} employés)</span>
              )}
            </span>
          </div>

          {/* Revenue */}
          {company.revenue && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="text-gray-400 text-xs">€</span>
              </div>
              <span className="text-sm text-gray-700">
                CA: {(company.revenue / 1000).toLocaleString()}k€
              </span>
            </div>
          )}

          {/* Legal Form */}
          {company.legalForm && (
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              {company.legalForm}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <button className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
              PRODUITS 2024 - 2025
            </button>
          </div>
          <button className="text-blue-600 hover:text-blue-800 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};