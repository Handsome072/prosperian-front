import SectionEnrichmentCard from "@shared/components/SectionCard/SectionEnrichmentCard";
import SectionTableCard from "@shared/components/SectionCard/SectionTableCard";

const Enrichment: React.FC = () => {
  const columns = ["Type", "Nom de fichier", "Statut", "#lignes", "Crée le"];
  const items: React.ReactNode[][] = [];

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
  };

  const handleSignUp = () => {
    console.log("Sign Up clicked!");
  };

  const handleConnect = () => {
    console.log("Connect clicked!");
  };

  const features = [
    "SIRENISER votre fichier d'entreprises",
    "Ajouter des champs ou les mettre à jour",
    "Rechercher des contacts sur une liste d'entreprise",
    "Générer des emails sur une liste de contacts",
  ];

  const remarkContent = (
    <>
      Pour mieux comprendre notre <span className="font-bold">service d'enrichissement</span>, nous vous recommandons de
      jeter un œil à nos{" "}
      <a href="#" className="text-[#E95C41] font-bold underline">
        tutoriels
      </a>
      !
    </>
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="mx-auto p-3">
        <SectionEnrichmentCard
          mainTitle="Enrichissez facilement vos fichiers en données d'entreprises ou de contacts"
          items={features}
          remark={remarkContent}
          onFileUpload={handleFileUpload}
          onSignUpClick={handleSignUp}
          onConnectClick={handleConnect}
        />
        <SectionTableCard
          title="Mes enrichissements"
          columns={columns}
          items={items}
          emptyMessage="Vous n'avez pas encore réalisé un enrichissement."
          onExportSelect={() => console.log("Export CSV")}
        />
      </div>
    </div>
  );
};

export default Enrichment;
