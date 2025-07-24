import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import axios from 'axios';

const FileUploadResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state?.file as File | undefined;

  const [columns, setColumns] = useState({
    lead_first_name: '',
    lead_last_name: '',
    company_name: '',
    company_domain: '',
    lead_profile_linkedin_url: '',
  });
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [fileData, setFileData] = useState<any[]>([]);
  const [enrichmentType, setEnrichmentType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (file) {
      const parseFile = async () => {
        try {
          if (file.name.endsWith('.csv')) {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              complete: (result) => {
                const headers = Object.keys(result.data[0] || {}).filter(header => header && typeof header === 'string');
                setFileColumns(headers);
                // Ensure only data rows are stored, excluding any header-like rows
                setFileData(result.data.filter(row => Object.values(row).some(val => val !== headers.find(h => h === val))));
              },
              error: (error) => {
                console.error('Error parsing CSV:', error);
                setFileColumns([]);
                setFileData([]);
              },
            });
          } else if (file.name.endsWith('.xlsx')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const firstSheet = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheet];
              const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              const headers = (json[0] as string[]).filter(header => header && typeof header === 'string');
              const rows = XLSX.utils.sheet_to_json(worksheet, { header: headers });
              setFileColumns(headers);
              // Ensure only data rows are stored, excluding any header-like rows
              setFileData(rows.filter(row => Object.values(row).some(val => val !== headers.find(h => h === val))));
            };
            reader.onerror = () => {
              console.error('Error reading XLSX file');
              setFileColumns([]);
              setFileData([]);
            };
            reader.readAsArrayBuffer(file);
          }
        } catch (error) {
          console.error('Error processing file:', error);
          setFileColumns([]);
          setFileData([]);
        }
      };
      parseFile();
    }
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setColumns(prev => ({ ...prev, [name]: value }));
  };

  const handleEnrichmentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEnrichmentType(e.target.value);
  };

  const handleEnrichment = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Mapping des données du fichier vers le format API
      const contacts = fileData.map(row => ({
        firstname: row[columns.lead_first_name] || '',
        lastname: row[columns.lead_last_name] || '',
        company_name: row[columns.company_name] || '',
        linkedin_url: row[columns.lead_profile_linkedin_url] || '',
        domain: row[columns.company_domain] || ''
      }));
      // Préparation du type d'enrichissement
      let enrichment_type: string[] = [];
      if (enrichmentType === 'email et phone') {
        enrichment_type = ['email', 'phone'];
      } else if (enrichmentType) {
        enrichment_type = [enrichmentType];
      }
      // Log du payload envoyé
      console.log('POST /api/pronto/enrichments/contacts/bulk', { contacts, enrichment_type });
      // Appel API
      const response = await axios.post('/api/pronto/enrichments/contacts/bulk', {
        contacts,
        enrichment_type
      });
      console.log('Réponse API /api/pronto/enrichments/contacts/bulk', response.data);
      setResult(response.data);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de l’enrichissement');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewData = (columnKey: string) => {
    if (!columnKey || !fileData.length) return '—';
    const selectedColumn = columns[columnKey as keyof typeof columns];
    if (!selectedColumn) return '—';

    // Collect all non-empty values from the selected column, excluding the header
    const values = fileData
      .map(row => row[selectedColumn])
      .filter(value => value != null && value.toString().trim() !== '' && value !== selectedColumn)
      .map(value => value.toString());

    if (values.length === 0) return '—';

    const maxPreview = 5;
    let displayValues: string[];
    if (values.length > maxPreview) {
      displayValues = [...values.slice(0, maxPreview - 1), '...'];
    } else {
      displayValues = values;
    }

    // Format as line-by-line with indentation
    const formattedValues = displayValues.map(value => `    ${value},`).join('\n');
    return <pre className="text-sm text-gray-400">[&#10;{formattedValues}&#10;]</pre>;
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full mx-auto">
        <p className="text-lg text-red-600">
          Aucun fichier n'a été téléchargé.{' '}
          <button onClick={() => navigate('/enrichissement')} className="text-[#E95C41] font-medium underline ml-2">
            Retour
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
        <button onClick={() => navigate('/enrichissement')} className="text-red-600 font-medium mb-6">
          ✕ Abandonner
        </button>
        <h2 className="text-xl font-bold text-[#E95C41] mb-4">Société</h2>
        <div className="mb-6">
          <label className="text-gray-700 text-sm font-medium block mb-2">Type d’enrichissement</label>
          <select
            name="enrichment_type"
            value={enrichmentType}
            onChange={handleEnrichmentTypeChange}
            className="border rounded px-2 py-1 w-full max-w-xs"
          >
            <option value="">Pas de type configuré</option>
            <option value="email">email</option>
            <option value="phone">phone</option>
            <option value="email et phone">email et phone</option>
          </select>
        </div>
        <table className="w-full text-left">
          <thead className="text-gray-600 text-sm">
            <tr className="">
              <th className="">Colonne Societeinfo</th>
              <th className="">Colonne de fichier importé</th>
              <th className="">Aperçu des données</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[
              { label: 'Lead first name', key: 'lead_first_name' },
              { label: 'Lead last name', key: 'lead_last_name' },
              { label: 'Company name', key: 'company_name' },
              { label: 'Company domain', key: 'company_domain' },
              { label: 'Lead profile LinkedIn URL', key: 'lead_profile_linkedin_url' },
            ].map(col => (
              <tr key={col.key} className="my-5">
                <td className="py-4">{col.label}</td>
                <td className="py-4">
                  <select
                    name={col.key}
                    value={columns[col.key as keyof typeof columns]}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">Pas de colonne configurée</option>
                    {fileColumns.map((column, index) => (
                      <option key={index} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4">{getPreviewData(col.key)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-orange-50 text-sm text-orange-700 p-4 mt-6 rounded-md">
          <span className="font-medium">
            Pour mieux comprendre notre <strong>service d’enrichissement</strong>
          </span>
          , nous vous recommandons de jeter un œil à nos{' '}
          <a href="#" className="underline">
            tutoriels
          </a>{' '}
          !
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="bg-gradient-to-r from-orange-400 to-[#E95C41] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90"
            onClick={handleEnrichment}
            disabled={loading}
          >
            {loading ? 'Enrichissement en cours...' : 'Lancer l’enrichissement'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Mes enrichissements</h3>
        <div className="flex justify-between items-center text-sm mb-4">
          <div className="font-medium">Exporter en CSV</div>
          <select className="border px-2 py-1 rounded">
            <option>Exporter en CSV</option>
          </select>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-600 my-8">
              <th className="py-16">TYPE</th>
              <th className="py-16">NOM DE FICHIER</th>
              <th className="py-16">STATUT</th>
              <th className="py-16"># LIGNES</th>
              <th className="py-16">CRÉÉ LE</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="my-8">
              <td className="py-16">📄</td>
              <td className="py-16">{file.name}</td>
              <td className="py-16 text-yellow-600 font-semibold">En configuration</td>
              <td className="py-16">{fileData.length}</td>
              <td className="py-16">{new Date().toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#0E0F47] text-white p-6 rounded-2xl mt-8 max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <p className="text-base font-semibold mb-2">
            Besoin d’échanger sur vos projets d’enrichissement de données ?
          </p>
          <p className="text-sm">
            Enrichissement complexe, automatisation de l’enrichissement dans votre CRM, mise à jour ou détection
            automatisée d’opportunité. Tout est possible, parlons-en !
          </p>
        </div>
        <button className="bg-[#E95C41] mt-4 md:mt-0 text-white px-6 py-3 rounded-full font-medium hover:opacity-90">
          Parler à un expert
        </button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">Enrichissement terminé ! {result.successful || result.total_processed} contacts enrichis.</div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}
      {/* Modal de succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative flex flex-col items-center">
            <button
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowSuccessModal(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <svg width="40" height="40" fill="none"><circle cx="20" cy="20" r="20" fill="#22C55E" fillOpacity="0.15"/><path d="M13 21l5 5 9-9" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Enrichissement terminé !</h2>
              <p className="text-gray-700 text-center mb-4">{fileData.length} contacts enrichis avec succès.</p>
              <button
                className="mt-2 px-6 py-2 bg-gradient-to-r from-orange-400 to-[#E95C41] text-white rounded-full font-semibold hover:opacity-90"
                onClick={() => setShowSuccessModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadResult;