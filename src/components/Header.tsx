import React from 'react';
import { Search, Sun, BookOpen, MessageCircle, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
              COMP<span className="text-orange-500">ANYX</span>
              </span>
            </div>
            
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
                Recherche
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Enrichissement
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Surveillance
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Veille
              </a>
            </nav>
          </div>

          {/* Right side icons and button */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <BookOpen className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Se connecter</span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex items-center space-x-8 mt-4">
          <a href="#" className="text-orange-500 font-medium border-b-2 border-orange-500 pb-2">
            Entreprises
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors pb-2">
            Contacts
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors pb-2">
            Listes
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors pb-2">
            Exports
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors pb-2">
            Mes Recherches
          </a>
          
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Je recherche une entreprise, un dirigeant..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};