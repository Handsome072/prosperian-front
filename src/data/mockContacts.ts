import { MockContacts } from "../entities/Contact"; // Ajuste le chemin selon ton projet

export const mockContacts: MockContacts = {
  contacts: [
    {
      role: "Président du directoire",
      entreprise: "TRICOTAGE DES VOSGES",
      subrole: "",
    },
    {
      role: "Mandataire / Direction Générale",
      subrole: "Président du conseil de surveillance | Directeur a...",
      entreprise: "TRICOTAGE DES VOSGES",
    },
    {
      role: "Directeur / Commerce",
      subrole: "Directeur régional des ventes",
      entreprise: "TRICOTAGE DES VOSGES",
    },
    {
      role: "Directeur / Commerce",
      subrole: "Directeur commercial",
      entreprise: "TRICOTAGE DES VOSGES",
    },
    {
      role: "Directeur",
      subrole: "Directeur de production",
      entreprise: "TRICOTAGE DES VOSGES",
    },
  ],
  postes: [
    { label: "Direction G...", value: 1.5 },
    { label: "Commerce", value: 1 },
    { label: "Informatique", value: 0.4914 },
    { label: "Administration", value: 0.4382 },
    { label: "Ressources...", value: 0.3789 },
    { label: "Production", value: 0.3308 },
    { label: "Marketing", value: 0.3194 },
    { label: "Autre", value: 0.1729 },
    { label: "Achats", value: 0.1596 },
    { label: "Autre", value: 0.1586 },
  ],
  niveaux: [
    { label: "Collaborateur", value: 4.7 },
    { label: "Responsable", value: 3.0 },
  ],
  headerStats: {
    totalContacts: "11 658 710",
    totalEntreprises: "1 180 176",
    contactsDirects: {
      avecEmail: "6 284 828",
      avecLinkedIn: "11 329 086",
    },
    contactsGeneriques: {
      avecTelephone: "562 841",
    },
  },
};
