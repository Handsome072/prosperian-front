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
            ? data.map((exp) => {
                const hasFiles = Array.isArray(exp.path) && exp.path.length > 0;
                const csvPath = hasFiles ? exp.path.find((p: string) => p.endsWith(".csv")) : null;
                const xlsxPath = hasFiles ? exp.path.find((p: string) => p.endsWith(".xlsx")) : null;
                return [
                  exp.type || "-", // Type
                  exp.file || "-", // Nom de fichier (sans extension)
                  hasFiles ? (
                    <span className="text-green-600 font-medium">Disponible</span>
                  ) : (
                    <span className="text-red-600 font-medium">Erreur</span>
                  ),
                  new Date(exp.created_at).toLocaleString("fr-FR"),
                  exp.ligne ?? "-",
                  <div className="flex gap-2">
                    {hasFiles && (
                      <button
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-xs"
                        onClick={() => {
                          if (csvPath) {
                            const link = document.createElement('a');
                            link.href = `${API_CONFIG.BASE_URL}${csvPath}`;
                            link.download = '';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                          if (xlsxPath) {
                            setTimeout(() => {
                              const link = document.createElement('a');
                              link.href = `${API_CONFIG.BASE_URL}${xlsxPath}`;
                              link.download = '';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }, 500); // petite pause pour éviter conflit navigateur
                          }
                        }}
                      >
                        Télécharger
                      </button>
                    )}
                  </div>
                ];
              })
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
        emptyMessage={loading ? "Chargement..." : "Vous n'avez pas encore réalisé un export."}
        onExportSelect={() => console.log("Export CSV")}
      />
    </div>
  );
};

export default Exports;