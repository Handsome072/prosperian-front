import SectionCard from "@shared/components/SectionCard/SectionCard";
import SectionTableCard from "@shared/components/SectionCard/SectionTableCard";

const Exports: React.FC = () => {
  const columns = ["Type", "Nom de fichier", "Statut", "Crée le", "#lignes"];
  const items: React.ReactNode[][] = [];

  return (
    <div className="mx-auto p-3">
      <SectionCard
        mainTitle="Gérez vos exports en toute simplicité !"
        subTitle="Avec le service d'export, vous pouvez :"
        items={[
          "Exporter les données d'entreprises et/ou de contacts en quelques clics",
          "Appliquer un repoussoir de contacts ou d'entreprises",
          "Prévisualiser vos résultats avant de confirmer votre achat",
          "Paramétrer des champs additionnels dans votre format d'export",
        ]}
        remark={
          <>
            Pour mieux comprendre notre <strong>service d'export</strong>, nous vous recommandons de jeter un œil à nos{" "}
            <a href="/tutoriels" className="underline font-medium">
              tutoriels
            </a>{" "}
            !
          </>
        }
        buttonText="Lancer une recherche"
        onButtonClick={() => {}}
      />
      <SectionTableCard
        title="Mes exports"
        columns={columns}
        items={items}
        emptyMessage="Vous n'avez pas encore réalisé un export."
        onExportSelect={() => console.log("Export CSV")}
      />
    </div>
  );
};

export default Exports;