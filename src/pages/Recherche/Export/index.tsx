import React from "react";
import SectionCard from "@shared/components/SectionCard/SectionCard";
import SectionTableCard from "@shared/components/SectionCard/SectionTableCard";
import { buildApiUrl, API_CONFIG } from "../../../config/api";

const Exports: React.FC = () => {
  const columns = ["Type", "Nom de fichier", "Statut", "Crée le", "#lignes", "Action"];
  const [items, setItems] = React.useState<React.ReactNode[][]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchExports = async () => {
      setLoading(true);
      try {
        const res = await fetch(buildApiUrl("/api/file/export"));
        const data = await res.json();
        setItems(
          Array.isArray(data)
            ? data.map((exp) => [
                exp.type || "-", // Type
                exp.file || "-", // Nom de fichier (avec extension)
                exp.path ? (
                  <span className="text-green-600 font-medium">Disponible</span>
                ) : (
                  <span className="text-red-600 font-medium">Erreur</span>
                ),
                new Date(exp.created_at).toLocaleString("fr-FR"),
                exp.ligne ?? "-",
                <div className="flex gap-2">
                  {exp.path && (
                    <button
                      className="inline-flex items-center bg-gradient-to-r from-orange-400 to-[#E95C41] hover:opacity-90 text-white font-medium py-3 px-6 rounded-full"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `${API_CONFIG.BASE_URL}${exp.path}`;
                        link.download = '';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Télécharger
                    </button>
                  )}
                </div>
              ])
            : []
        );
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExports();
  }, []);

  return (
    <div className={`mx-auto p-3 ${!loading && items.length !== 0 ? "w-full max-w-none" : ""}`}>
      {!loading && items.length === 0 && (
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
      )}
      <SectionTableCard
        title="Mes exports"
        columns={columns}
        items={items}
        emptyMessage={loading ? "Chargement..." : "Vous n'avez pas encore réalisé un export."}
        onExportSelect={() => console.log("Export CSV")}
      />
    </div>
  );
};

export default Exports;