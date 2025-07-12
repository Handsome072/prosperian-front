import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Globe, Phone, Mail, Linkedin, Facebook, Twitter, Youtube, ChevronDown, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const COLORS = ['#E95C41', '#F7B267', '#A3A1FB', '#4F8A8B', '#F76E11', '#43BCCD'];

const SocieteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('legal');
  const [activeSubTab, setActiveSubTab] = useState('infos');
  const [contactsTab, setContactsTab] = useState('directs');

  // Données pour le graphique CA
  const caData = [
    { year: '2013', reels: 15.3, estimes: 0 },
    { year: '2014', reels: 22.0, estimes: 0 },
    { year: '2015', reels: 21.9, estimes: 0 },
    { year: '2016', reels: 21.3, estimes: 0 },
    { year: '2017', reels: 20.1, estimes: 0 },
    { year: '2018', reels: 0, estimes: 22.1 },
    { year: '2019', reels: 0, estimes: 21.3 },
    { year: '2020', reels: 0, estimes: 20.1 },
    { year: '2021', reels: 0, estimes: 21.5 },
    { year: '2022', reels: 0, estimes: 21.3 },
    { year: '2023', reels: 0, estimes: 20.1 },
    { year: '2024', reels: 0, estimes: 22.1 }
  ];

  // Données pour les graphiques contacts
  const domainesData = [
    { name: 'Commerce', value: 14, color: '#E95C41' },
    { name: 'Production', value: 3, color: '#F7B267' },
    { name: 'Marketing', value: 3, color: '#A3A1FB' },
    { name: 'Magasin', value: 3, color: '#4F8A8B' },
    { name: 'Direction Gén.', value: 5, color: '#F76E11' },
    { name: 'Responsable et...', value: 4, color: '#43BCCD' }
  ];

  const postesData = [
    { name: 'Assistant', value: 9, color: '#E95C41' },
    { name: 'Mandataire', value: 6, color: '#F7B267' },
    { name: 'Responsable', value: 22, color: '#A3A1FB' },
    { name: 'Collaborateur', value: 23, color: '#4F8A8B' },
    { name: 'Directeur', value: 6, color: '#F76E11' }
  ];

  const effectifsData = [
    { year: '2016', reels: 246, estimes: 0 },
    { year: '2017', reels: 239, estimes: 0 },
    { year: '2018', reels: 237, estimes: 0 },
    { year: '2019', reels: 235, estimes: 0 },
    { year: '2020', reels: 233, estimes: 0 },
    { year: '2021', reels: 0, estimes: 275 },
    { year: '2022', reels: 0, estimes: 300 },
    { year: '2023', reels: 0, estimes: 261 },
    { year: '2024', reels: 0, estimes: 275 },
    { year: '2025', reels: 0, estimes: 261 }
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Header avec logo et nom */}
      <div className="bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-wide">TRICOTAGE DES VOSGES</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <span className="text-red-500 text-lg">✕</span>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <Globe className="w-5 h-5 text-red-500" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <Mail className="w-5 h-5 text-red-500" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <Linkedin className="w-5 h-5 text-red-500" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <Youtube className="w-5 h-5 text-red-500" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <Phone className="w-5 h-5 text-red-500" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <Mail className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Section principale avec infos et graphique */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg p-6 flex gap-8">
          {/* Colonne gauche - Informations */}
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Site Web</span>
              </div>
              <a href="http://www.tdv.fr/" className="text-red-500 text-sm hover:underline">
                http://www.tdv.fr/
              </a>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">LinkedIn</span>
              </div>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                https://www.linkedin.com/company/bleuforet/
              </a>
              <p className="text-sm text-gray-600 mt-2">
                Bleuforêt, marque de Tricotage des Vosges. Bleuforêt est un créateur d'accessoires de mode chaussants. Depuis 1924, Bleuforêt fabrique des chaussettes, collants et leggings au cœur...
              </p>
              <button className="text-gray-400 mt-1">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700">Objet social</span>
              <p className="text-sm text-gray-600 mt-2">
                Fabrication et vente d'articles de bonneterie et plus particulièrement d'articles chaussants ainsi que toute opérations concernant ces articles : Création, acquisition, dépôt de tou...
              </p>
              <button className="text-gray-400 mt-1">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Colonne droite - Graphique CA */}
          <div className="flex-1">
            <div className="text-right mb-4">
              <span className="text-sm font-medium text-gray-700">Chiffre d'affaires</span>
              <div className="text-2xl font-bold text-gray-800 mt-1">30 M</div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="year" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    domain={[0, 30]}
                    tickFormatter={(value) => `${value} M`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value} M€`, name === 'reels' ? 'Chiffres réels' : 'Chiffres estimés']}
                    labelFormatter={(label) => `Année ${label}`}
                  />
                  <Bar dataKey="reels" fill="#1E40AF" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="estimes" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                <span className="text-gray-600">Chiffres réels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Chiffres estimés</span>
              </div>
            </div>

            <div className="text-center mt-6">
              <button className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50">
                Ajouter à une liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets principaux */}
      <div className="px-8">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'legal' 
                ? 'text-red-500 border-red-500' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('legal')}
          >
            Légal
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'finances' 
                ? 'text-red-500 border-red-500' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('finances')}
          >
            € Finances
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'web' 
                ? 'text-red-500 border-red-500' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('web')}
          >
            🌐 Web
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'events' 
                ? 'text-red-500 border-red-500' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            📅 Événements
          </button>
        </div>

        {/* Sous-onglets pour Légal */}
        {activeTab === 'legal' && (
          <div className="flex border-b border-gray-200 mt-4">
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeSubTab === 'infos' 
                  ? 'text-red-500 border-red-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveSubTab('infos')}
            >
              ⚠️ Informations générales
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeSubTab === 'mandataires' 
                  ? 'text-red-500 border-red-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveSubTab('mandataires')}
            >
              👥 Mandataires / Bénéficiaires effectifs
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeSubTab === 'publications' 
                  ? 'text-red-500 border-red-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveSubTab('publications')}
            >
              📰 Publications
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeSubTab === 'etablissements' 
                  ? 'text-red-500 border-red-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveSubTab('etablissements')}
            >
              🏢 Établissements
            </button>
          </div>
        )}

        {/* Contenu des informations générales */}
        {activeTab === 'legal' && activeSubTab === 'infos' && (
          <div className="bg-white rounded-lg mt-6 p-6">
            <div className="grid grid-cols-3 gap-8 text-sm">
              {/* Colonne 1 */}
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">DÉNOMINATION</div>
                  <div className="font-medium">TRICOTAGE DES VOSGES</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">NOM COMMERCIAL</div>
                  <div className="font-medium">BLEU FORÊT, OLYMPIA</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">SIGLE</div>
                  <div className="font-medium">TDV</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">TYPE ÉTABLISSEMENT</div>
                  <div className="font-medium">Siège</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">STATUT</div>
                  <div className="font-medium">Active</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">N° SIREN</div>
                  <div className="font-medium">398356246 📋</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">N° SIRET</div>
                  <div className="font-medium">39835624600015 📋</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">N° TVA UE</div>
                  <div className="font-medium">FR398356246 📋</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">FORME JURIDIQUE</div>
                  <div className="font-medium">SA à directoire</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">CODE NAF/APE</div>
                  <div className="font-medium">1431Z (Fabrication d'articles chaussants à mailles) ℹ️</div>
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">ADRESSE</div>
                  <div className="font-medium">2 RUE DU JUMELAGE 88120 VAGNEY</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">DATE DE CRÉATION</div>
                  <div className="font-medium">19/09/1994</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">DATE DE CRÉATION D'ÉTABLISSEMENT</div>
                  <div className="font-medium">19/09/1994</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">DERNIÈRE MISE À JOUR LÉGALE</div>
                  <div className="font-medium">30/06/2025</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">CAPITAL SOCIAL</div>
                  <div className="font-medium">809 250 €</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">CHIFFRE D'AFFAIRES (2024)</div>
                  <div className="font-medium">22 154 625 €</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">GREFFE</div>
                  <div className="font-medium">Epinal</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">N° RCS</div>
                  <div className="font-medium">398356246 RCS Epinal 📋</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">CONVENTION COLLECTIVE</div>
                  <div className="font-medium">0018 - Convention collective nationale des industries textiles</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">TÉLÉCHARGER LES DERNIERS STATUTS</div>
                  <div className="font-medium text-red-500 cursor-pointer flex items-center gap-1">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Contacts */}
        <div className="bg-white rounded-lg mt-6 p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">👥</span>
            <h2 className="text-lg font-bold text-gray-800">CONTACTS</h2>
          </div>

          {/* Graphiques contacts */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Domaines */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Domaines</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={domainesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {domainesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {domainesData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Types de poste */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Types de poste</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={postesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {postesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {postesData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historique des effectifs */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Historique des effectifs</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={effectifsData}>
                    <XAxis 
                      dataKey="year" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      domain={[0, 400]}
                    />
                    <Tooltip />
                    <Bar dataKey="reels" fill="#1E40AF" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="estimes" fill="#EF4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                  <span className="text-gray-600">Chiffres réels</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Chiffres estimés</span>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets contacts */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                contactsTab === 'directs' 
                  ? 'text-red-500 border-red-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setContactsTab('directs')}
            >
              Contacts directs
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                contactsTab === 'generiques' 
                  ? 'text-red-500 border-red-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setContactsTab('generiques')}
            >
              Contacts génériques
            </button>
          </div>

          {/* Barre de recherche et pagination */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Nom, domaine..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>1 - 5 sur 50</span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tableau des contacts */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left py-3 font-medium">RÔLE</th>
                  <th className="text-left py-3 font-medium">NOM</th>
                  <th className="text-left py-3 font-medium">LINKEDIN</th>
                  <th className="text-left py-3 font-medium">EMAIL</th>
                  <th className="text-left py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4">
                    <div className="font-medium text-gray-800">Mandataire / Direction Générale</div>
                    <div className="text-xs text-gray-500">Président du directoire | Président</div>
                  </td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600"></span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button className="px-4 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full font-medium">
                      1 crédit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="font-medium text-gray-800">Mandataire / Direction Générale</div>
                    <div className="text-xs text-gray-500">Membre du conseil de direction | Directeur</div>
                  </td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600"></span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button className="px-4 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full font-medium">
                      1 crédit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="font-medium text-gray-800">Mandataire / Direction Générale</div>
                    <div className="text-xs text-gray-500">Membre du conseil de surveillance | Directeur</div>
                  </td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600"></span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button className="px-4 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full font-medium">
                      1 crédit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="font-medium text-gray-800">Mandataire / Direction Générale</div>
                    <div className="text-xs text-gray-500">Président du conseil de surveillance | Directeur administratif et financier</div>
                  </td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600"></span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button className="px-4 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full font-medium">
                      1 crédit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="font-medium text-gray-800">Dirigeant / Direction Générale</div>
                    <div className="text-xs text-gray-500">Directeur général</div>
                  </td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4 text-gray-600"></td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600"></span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button className="px-4 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full font-medium">
                      1 crédit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-xs text-gray-500">
          © SMART DATA 2024 • CGV / CGU • Vie privée & Confidentialité • Mentions Légales
          <div className="flex items-center justify-center gap-2 mt-2">
            <span>in</span>
            <Twitter className="w-4 h-4" />
            <Facebook className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocieteDetails;