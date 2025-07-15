import { ProntoService } from './prontoService';
import { buildApiUrl } from '../config/api';

// Types pour l'exportation
export interface ExportData {
  leads: Array<{
    lead: {
      status: string;
      rejection_reasons: string[];
      first_name: string;
      last_name: string;
      gender: string | null;
      email: string | null;
      email_status: string | null;
      phone: Array<{
        number: string;
        status: string;
        provider: string;
        phone_type: string;
      }>;
      linkedin_url: string;
      profile_image_url: string;
      location: string;
      title: string;
      years_in_position: number;
      months_in_position: number;
      years_in_company: number;
      months_in_company: number;
    };
    company: {
      name: string;
      cleaned_name: string;
      website: string;
      location: string;
      industry: string;
      headquarters: {
        city: string;
        line1: string;
        country: string;
        postalCode: string;
        geographicArea: string;
      };
      description: string;
      linkedin_url: string;
      linkedin_id: string;
      employee_range: string;
      company_profile_picture: string;
    };
  }>;
}

export class ExportService {
  // Fonction pour récupérer les données complètes d'une recherche
  static async getCompleteSearchData(searchId: string): Promise<ExportData> {
    try {
      const data = await ProntoService.getSearchWithLeads(searchId);
      return data as ExportData;
    } catch (error) {
      console.error('Error fetching complete search data:', error);
      throw error;
    }
  }

  // Fonction pour convertir les données en format CSV
  static convertToCSV(data: ExportData): string {
    const headers = [
      // Données du lead
      'Lead Status',
      'Lead First Name',
      'Lead Last Name',
      'Lead Gender',
      'Lead Email',
      'Lead Email Status',
      'Lead Phone Numbers',
      'Lead LinkedIn URL',
      'Lead Profile Image URL',
      'Lead Location',
      'Lead Title',
      'Lead Years in Position',
      'Lead Months in Position',
      'Lead Years in Company',
      'Lead Months in Company',
      // Données de l'entreprise
      'Company Name',
      'Company Cleaned Name',
      'Company Website',
      'Company Location',
      'Company Industry',
      'Company City',
      'Company Address Line 1',
      'Company Country',
      'Company Postal Code',
      'Company Geographic Area',
      'Company Description',
      'Company LinkedIn URL',
      'Company LinkedIn ID',
      'Company Employee Range',
      'Company Profile Picture'
    ];

    const csvRows = [headers.join(',')];

    data.leads.forEach(leadData => {
      const row = [
        // Données du lead
        `"${leadData.lead.status || ''}"`,
        `"${leadData.lead.first_name || ''}"`,
        `"${leadData.lead.last_name || ''}"`,
        `"${leadData.lead.gender || ''}"`,
        `"${leadData.lead.email || ''}"`,
        `"${leadData.lead.email_status || ''}"`,
        `"${leadData.lead.phone?.map(p => p.number).join('; ') || ''}"`,
        `"${leadData.lead.linkedin_url || ''}"`,
        `"${leadData.lead.profile_image_url || ''}"`,
        `"${leadData.lead.location || ''}"`,
        `"${leadData.lead.title || ''}"`,
        leadData.lead.years_in_position || '',
        leadData.lead.months_in_position || '',
        leadData.lead.years_in_company || '',
        leadData.lead.months_in_company || '',
        // Données de l'entreprise
        `"${leadData.company.name || ''}"`,
        `"${leadData.company.cleaned_name || ''}"`,
        `"${leadData.company.website || ''}"`,
        `"${leadData.company.location || ''}"`,
        `"${leadData.company.industry || ''}"`,
        `"${leadData.company.headquarters?.city || ''}"`,
        `"${leadData.company.headquarters?.line1 || ''}"`,
        `"${leadData.company.headquarters?.country || ''}"`,
        `"${leadData.company.headquarters?.postalCode || ''}"`,
        `"${leadData.company.headquarters?.geographicArea || ''}"`,
        `"${leadData.company.description || ''}"`,
        `"${leadData.company.linkedin_url || ''}"`,
        `"${leadData.company.linkedin_id || ''}"`,
        `"${leadData.company.employee_range || ''}"`,
        `"${leadData.company.company_profile_picture || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // Fonction pour télécharger un fichier
  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Fonction pour envoyer le fichier exporté au backend
  static async uploadExportedFile(content: string, filename: string, mimeType: string) {
    try {
      const response = await fetch(buildApiUrl('/api/file'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          mimeType,
          content: btoa(unescape(encodeURIComponent(content))) // Encodage base64
        })
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier exporté');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur uploadExportedFile:', error);
    }
  }

  // Fonction principale d'exportation
  static async exportSearchData(searchId: string, filename: string) {
    try {
      // Récupérer les données complètes
      const data = await this.getCompleteSearchData(searchId);
      
      // Convertir en CSV
      const csvContent = this.convertToCSV(data);
      
      // Télécharger le fichier CSV
      this.downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
      
      // Pour l'export XLSX, nous utiliserons une bibliothèque externe
      // Pour l'instant, nous créons un fichier CSV avec extension .xlsx
      // TODO: Implémenter la vraie conversion XLSX avec une bibliothèque comme xlsx
      this.downloadFile(csvContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Fonction pour exporter les données sélectionnées depuis BusinessCard
  static async exportSelectedBusinesses(selectedBusinesses: any[], filename: string) {
    try {
      // Convertir les données BusinessCard en format d'export
      const exportData: ExportData = {
        leads: selectedBusinesses.map(business => ({
          lead: {
            status: 'QUALIFIED',
            rejection_reasons: [],
            first_name: business.lead?.first_name || '',
            last_name: business.lead?.last_name || '',
            gender: business.lead?.gender || null,
            email: business.lead?.email || business.email || null,
            email_status: business.lead?.email_status || null,
            phone: business.lead?.phone || (business.phone ? [{ number: business.phone, status: 'VALID', provider: '', phone_type: '' }] : []),
            linkedin_url: business.lead?.linkedin_url || business.linkedin || '',
            profile_image_url: business.lead?.profile_image_url || '',
            location: business.lead?.location || business.city || '',
            title: business.lead?.title || '',
            years_in_position: business.lead?.years_in_position || 0,
            months_in_position: business.lead?.months_in_position || 0,
            years_in_company: business.lead?.years_in_company || 0,
            months_in_company: business.lead?.months_in_company || 0
          },
          company: {
            name: business.name || business.company?.name || '',
            cleaned_name: business.company?.cleaned_name || business.name || '',
            website: business.website || business.company?.website || '',
            location: business.company?.location || business.city || '',
            industry: business.activity || business.company?.industry || '',
            headquarters: {
              city: business.city || business.company?.headquarters?.city || '',
              line1: business.address || business.company?.headquarters?.line1 || '',
              country: business.company?.headquarters?.country || 'France',
              postalCode: business.postalCode || business.company?.headquarters?.postalCode || '',
              geographicArea: business.company?.headquarters?.geographicArea || ''
            },
            description: business.description || business.company?.description || '',
            linkedin_url: business.company?.linkedin_url || '',
            linkedin_id: business.company?.linkedin_id || '',
            employee_range: business.employees || business.company?.employee_range || '',
            company_profile_picture: business.logo || business.company?.company_profile_picture || ''
          }
        }))
      };

      // Convertir en CSV
      const csvContent = this.convertToCSV(exportData);
      // Télécharger les fichiers
      this.downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
      this.downloadFile(csvContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      // Envoyer au backend (CSV)
      await this.uploadExportedFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
      // Envoyer au backend (XLSX, ici même contenu que CSV)
      await this.uploadExportedFile(csvContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return true;
    } catch (error) {
      console.error('Error exporting selected businesses:', error);
      throw error;
    }
  }
} 