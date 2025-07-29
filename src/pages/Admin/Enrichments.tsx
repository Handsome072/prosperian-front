import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import enrichmentService, { Enrichment, LeadEnrich } from '../../services/enrichmentService';

const AdminEnrichments: React.FC = () => {
  const { user } = useAuth();
  const [enrichments, setEnrichments] = useState<Enrichment[]>([]);
  const [selectedEnrichment, setSelectedEnrichment] = useState<Enrichment | null>(null);
  const [leads, setLeads] = useState<LeadEnrich[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    fetchEnrichments();
  }, [currentPage, statusFilter]);

  const fetchEnrichments = async () => {
    try {
      setLoading(true);
      const response = await enrichmentService.getEnrichments(currentPage, 10, statusFilter);
      setEnrichments(response.enrichments || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Erreur lors du chargement des enrichments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (enrichmentId: string) => {
    try {
      setLoadingLeads(true);
      const response = await enrichmentService.getLeadsEnrich(enrichmentId, 1, 100);
      setLeads(response.leads || []);
    } catch (error) {
      console.error('Erreur lors du chargement des leads:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleViewLeads = async (enrichment: Enrichment) => {
    setSelectedEnrichment(enrichment);
    await fetchLeads(enrichment.id);
  };

  const handleValidateEnrichment = async (enrichment: Enrichment) => {
    setSelectedEnrichment(enrichment);
    setShowValidationModal(true);
  };

  const confirmValidation = async () => {
    if (!selectedEnrichment) return;

    try {
      setValidating(true);
      await enrichmentService.updateEnrichment(selectedEnrichment.id, {
        status: 'Terminé'
      });
      
      // Rafraîchir la liste
      await fetchEnrichments();
      setShowValidationModal(false);
      setSelectedEnrichment(null);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setValidating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'En cours': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'Terminé': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'Échec': { color: 'bg-red-100 text-red-800', icon: '❌' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['En cours'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Enrichments</h1>
            <p className="text-gray-600 mt-2">Validez et gérez les enrichments des utilisateurs</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Échec">Échec</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des Enrichments */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Enrichments</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrichments.map((enrichment) => (
                  <tr key={enrichment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{enrichment.name}</div>
                        {enrichment.description && (
                          <div className="text-sm text-gray-500">{enrichment.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{enrichment.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enrichment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enrichment.date_created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewLeads(enrichment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir Leads
                        </button>
                        {enrichment.status === 'En cours' && (
                          <button
                            onClick={() => handleValidateEnrichment(enrichment)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Valider
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de validation */}
      {showValidationModal && selectedEnrichment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Valider l'enrichment
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir valider l'enrichment "{selectedEnrichment.name}" ?
              Cette action changera le statut à "Terminé".
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={confirmValidation}
                disabled={validating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {validating ? 'Validation...' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal des leads */}
      {selectedEnrichment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Leads de "{selectedEnrichment.name}"
                </h3>
                <button
                  onClick={() => setSelectedEnrichment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingLeads ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Nom
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Entreprise
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Domaine
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          LinkedIn
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {lead.firstname} {lead.lastname}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {lead.company_name || '—'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {lead.domain || '—'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {lead.linkedin_url ? (
                              <a
                                href={lead.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Voir profil
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(lead.date_creation).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnrichments; 