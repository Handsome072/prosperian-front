import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Download, ArrowLeft, Building2, FileText, Euro, Globe, Calendar } from 'lucide-react';

const API_URL = 'http://localhost:4000/api/search';

const SocieteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('legal');
  const [activeSubTab, setActiveSubTab] = useState('infos');
  const [societeData, setSocieteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`${API_URL}?q=${id}&limite_matching_etablissements=10&page=1&per_page=10`, {
      headers: { accept: 'application/json' }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des données société');
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setSocieteData(data.results[0]);
        } else {
          setError('Aucune société trouvée pour ce SIREN');
        }
      })
      .catch((e) => setError(e.message || 'Erreur inconnue'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full mx-auto">
        <style>{`
          @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
          .animate-spin-reverse { animation: spin-reverse 1s linear infinite; }
        `}</style>
        <div className="relative w-12 h-12 mb-2">
          <div className="absolute inset-0 rounded-full border-4 border-orange-400 border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-[#E95C41] border-b-transparent animate-spin-reverse"></div>
        </div>
        <span className="ml-2 text-gray-600 text-lg">Chargement des données société...</span>
      </div>
    );
  }
  if (error || !societeData) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-red-600">{error || 'Erreur inconnue'}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-gray-100 shadow-md px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform">
              <span className="text-blue-600 font-bold text-xl">P</span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">{societeData.nom_complet}</h1>
          </div>
        </div>
      </div>

      {/* Onglets principaux */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
          <button 
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === 'legal' 
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('legal')}
            aria-current={activeTab === 'legal' ? 'page' : undefined}
          >
            <FileText className="w-4 h-4" /> Légal
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === 'finances' 
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('finances')}
            aria-current={activeTab === 'finances' ? 'page' : undefined}
          >
            <Euro className="w-4 h-4" /> Finances
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === 'web' 
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('web')}
            aria-current={activeTab === 'web' ? 'page' : undefined}
          >
            <Globe className="w-4 h-4" /> Web
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === 'events' 
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('events')}
            aria-current={activeTab === 'events' ? 'page' : undefined}
          >
            <Calendar className="w-4 h-4" /> Événements
          </button>
        </div>

        {/* Sous-onglets pour Légal */}
        {activeTab === 'legal' && (
          <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-xl shadow-sm mt-2">
            <button 
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
                activeSubTab === 'infos' 
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveSubTab('infos')}
              aria-current={activeSubTab === 'infos' ? 'page' : undefined}
            >
              <FileText className="w-4 h-4" /> Informations générales
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
                activeSubTab === 'mandataires' 
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveSubTab('mandataires')}
              aria-current={activeSubTab === 'mandataires' ? 'page' : undefined}
            >
              <Building2 className="w-4 h-4" /> Mandataires
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
                activeSubTab === 'etablissements' 
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveSubTab('etablissements')}
              aria-current={activeSubTab === 'etablissements' ? 'page' : undefined}
            >
              <Building2 className="w-4 h-4" /> Établissements
            </button>
          </div>
        )}

        {/* Contenu des informations générales */}
        {activeTab === 'legal' && activeSubTab === 'infos' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne 1 - Informations générales de l'entreprise */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">SIREN</div>
                  <div className="text-gray-800">{societeData.siren}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Nom complet</div>
                  <div className="text-gray-800">{societeData.nom_complet}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Raison sociale</div>
                  <div className="text-gray-800">{societeData.nom_raison_sociale}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Sigle</div>
                  <div className="text-gray-800">{societeData.sigle || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Nombre d'établissements</div>
                  <div className="text-gray-800">{societeData.nombre_etablissements}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Nombre d'établissements ouverts</div>
                  <div className="text-gray-800">{societeData.nombre_etablissements_ouverts}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Activité principale</div>
                  <div className="text-gray-800">{societeData.activite_principale} (Activités de poste dans le cadre du service universel)</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Catégorie entreprise</div>
                  <div className="text-gray-800">{societeData.categorie_entreprise}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Année catégorie entreprise</div>
                  <div className="text-gray-800">{societeData.annee_categorie_entreprise}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Date de création</div>
                  <div className="text-gray-800">{societeData.date_creation}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">État administratif</div>
                  <div className="text-gray-800">{societeData.etat_administratif === 'A' ? 'Actif' : 'Inactif'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Nature juridique</div>
                  <div className="text-gray-800">{societeData.nature_juridique} (Établissement public à caractère industriel et commercial)</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Section activité principale</div>
                  <div className="text-gray-800">{societeData.section_activite_principale}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Tranche effectif salarié</div>
                  <div className="text-gray-800">{societeData.tranche_effectif_salarie}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Année tranche effectif salarié</div>
                  <div className="text-gray-800">{societeData.annee_tranche_effectif_salarie}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Statut diffusion</div>
                  <div className="text-gray-800">{societeData.statut_diffusion}</div>
                </div>
              </div>
            </div>

            {/* Colonne 2 - Informations du siège */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Siège social</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Adresse siège</div>
                  <div className="text-gray-800">{societeData.siege.adresse}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Code postal</div>
                  <div className="text-gray-800">{societeData.siege.code_postal}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Commune</div>
                  <div className="text-gray-800">{societeData.siege.libelle_commune}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Département</div>
                  <div className="text-gray-800">{societeData.siege.departement}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Région</div>
                  <div className="text-gray-800">{societeData.siege.region}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">EPCI</div>
                  <div className="text-gray-800">{societeData.siege.epci}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">SIRET siège</div>
                  <div className="text-gray-800">{societeData.siege.siret}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Activité principale siège</div>
                  <div className="text-gray-800">{societeData.siege.activite_principale}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Caractère employeur</div>
                  <div className="text-gray-800">{societeData.siege.caractere_employeur === 'O' ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Date création siège</div>
                  <div className="text-gray-800">{societeData.siege.date_creation}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Date début activité</div>
                  <div className="text-gray-800">{societeData.siege.date_debut_activite}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Date mise à jour INSEE</div>
                  <div className="text-gray-800">{societeData.siege.date_mise_a_jour_insee}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Coordonnées</div>
                  <div className="text-gray-800">{societeData.siege.coordonnees}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Latitude</div>
                  <div className="text-gray-800">{societeData.siege.latitude}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Longitude</div>
                  <div className="text-gray-800">{societeData.siege.longitude}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Enseignes</div>
                  <div className="text-gray-800">{Array.isArray(societeData.siege.liste_enseignes) ? societeData.siege.liste_enseignes.join(', ') : '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">FINESS</div>
                  <div className="text-gray-800">{societeData.siege.liste_finess ? societeData.siege.liste_finess.join(', ') : '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Conventions collectives (IDCC)</div>
                  <div className="text-gray-800">{societeData.siege.liste_idcc ? societeData.siege.liste_idcc.join(', ') : '-'}</div>
                </div>
              </div>
            </div>

            {/* Colonne 3 - Finances et Compléments */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Finances et compléments</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Chiffre d'affaires (2023)</div>
                  <div className="text-gray-800">{societeData.finances['2023'].ca.toLocaleString()} €</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Résultat net (2023)</div>
                  <div className="text-gray-800">{societeData.finances['2023'].resultat_net.toLocaleString()} €</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Convention collective renseignée</div>
                  <div className="text-gray-800">{societeData.complements.convention_collective_renseignee ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">EGAPRO renseignée</div>
                  <div className="text-gray-800">{societeData.complements.egapro_renseignee ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Achats responsables</div>
                  <div className="text-gray-800">{societeData.complements.est_achats_responsables ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Alim confiance</div>
                  <div className="text-gray-800">{societeData.complements.est_alim_confiance ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Association</div>
                  <div className="text-gray-800">{societeData.complements.est_association ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Bio</div>
                  <div className="text-gray-800">{societeData.complements.est_bio ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Entrepreneur individuel</div>
                  <div className="text-gray-800">{societeData.complements.est_entrepreneur_individuel ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Entrepreneur spectacle</div>
                  <div className="text-gray-800">{societeData.complements.est_entrepreneur_spectacle ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">ESS</div>
                  <div className="text-gray-800">{societeData.complements.est_ess ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">FINESS</div>
                  <div className="text-gray-800">{societeData.complements.est_finess ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Organisme de formation</div>
                  <div className="text-gray-800">{societeData.complements.est_organisme_formation ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Qualiopi</div>
                  <div className="text-gray-800">{societeData.complements.est_qualiopi ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">RGE</div>
                  <div className="text-gray-800">{societeData.complements.est_rge ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Service public</div>
                  <div className="text-gray-800">{societeData.complements.est_service_public ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Bilan GES</div>
                  <div className="text-gray-800">{societeData.complements.bilan_ges_renseigne ? 'Oui' : 'Non'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Télécharger les derniers statuts</div>
                  <div className="text-red-600 cursor-pointer flex items-center gap-2 hover:text-red-700 transition-colors">
                    <Download className="w-4 h-4" /> Télécharger
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu des mandataires */}
        {activeTab === 'legal' && activeSubTab === 'mandataires' && (
          <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Mandataires</h2>
            </div>

            {/* Barre de recherche */}
            <div className="relative mb-6 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher un mandataire..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                aria-label="Rechercher un mandataire"
              />
            </div>

            {/* Tableau des mandataires */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium">RÔLE</th>
                    <th className="text-left py-3 px-4 font-medium">NOM</th>
                    <th className="text-left py-3 px-4 font-medium">NATIONALITÉ</th>
                    <th className="text-left py-3 px-4 font-medium">ANNÉE DE NAISSANCE</th>
                    <th className="text-left py-3 px-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {societeData.dirigeants.map((dirigeant, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{dirigeant.qualite || 'Non spécifié'}</div>
                        <div className="text-xs text-gray-500">{dirigeant.type_dirigeant}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{`${dirigeant.nom} ${dirigeant.prenoms}`}</td>
                      <td className="py-4 px-4 text-gray-600">{dirigeant.nationalite || '-'}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">{dirigeant.annee_de_naissance || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button className="px-4 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full font-medium hover:from-orange-500 hover:to-red-600 transition-all">
                          1 crédit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenu des établissements secondaires */}
        {activeTab === 'legal' && activeSubTab === 'etablissements' && (
          <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Établissements secondaires</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium">SIRET</th>
                    <th className="text-left py-3 px-4 font-medium">ADRESSE</th>
                    <th className="text-left py-3 px-4 font-medium">COMMUNE</th>
                    <th className="text-left py-3 px-4 font-medium">DATE CRÉATION</th>
                    <th className="text-left py-3 px-4 font-medium">ÉTAT ADMINISTRATIF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {societeData.matching_etablissements.map((etablissement, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-600">{etablissement.siret}</td>
                      <td className="py-4 px-4 text-gray-600">{etablissement.adresse}</td>
                      <td className="py-4 px-4 text-gray-600">{etablissement.libelle_commune}</td>
                      <td className="py-4 px-4 text-gray-600">{etablissement.date_creation}</td>
                      <td className="py-4 px-4 text-gray-600">{etablissement.etat_administratif === 'A' ? 'Actif' : 'Inactif'}</td>
                    </tr> 
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-100 text-center py-8 mt-8 rounded-xl text-xs text-gray-500">
          <div className="max-w-7xl mx-auto">
            <span>© SMART DATA 2025 • </span>
            <a href="#" className="hover:text-red-600 transition-colors">CGV / CGU</a> • 
            <a href="#" className="hover:text-red-600 transition-colors"> Vie privée & Confidentialité</a> • 
            <a href="#" className="hover:text-red-600 transition-colors"> Mentions Légales</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocieteDetails;