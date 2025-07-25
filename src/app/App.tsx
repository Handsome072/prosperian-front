import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "@layouts/MainLayout";
import { SearchLayout } from "@layouts/SearchLayout";

import Entreprises from "@pages/Recherche/Entreprises";
import Contact from "@pages/Recherche/Contact";
import Lists from "@pages/Recherche/Lists";
import Export from "@pages/Recherche/Export";
import MySearches from "@pages/Recherche/MySearches";
import SocieteDetails from "@pages/Recherche/Societe/SocieteDetails";

import Enrichment from "@pages/Enrichissement";
import FileUploadResult from "@pages/Enrichissement/FileUploadResult";
import ProntoLeadsForm from "@pages/Enrichissement/ProntoLeadsForm";
/* import Surveillance   from "@pages/Surveillance";
import Veille         from "@pages/Veille"; */

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="recherche" replace />} />

        <Route path="recherche" element={<SearchLayout />}>
          <Route index element={<Entreprises />} />
          <Route path="entreprises" element={<Entreprises />} />
          <Route path="contact" element={<Contact />} />
          <Route path="listes" element={<Lists />} />
          <Route path="export" element={<Export />} />
          <Route path="mes-recherches" element={<MySearches />} />
        </Route>

        <Route path="recherche/societes/:id" element={<SocieteDetails />} />

        <Route path="enrichissement" element={<Enrichment />} />
        <Route path="enrichissement/pronto-leads" element={<ProntoLeadsForm />} />
        <Route path="file-upload-result" element={<FileUploadResult />} />
        {/* <Route path="surveillance"   element={<Surveillance />} />
        <Route path="veille"         element={<Veille />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
