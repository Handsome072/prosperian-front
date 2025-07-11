import React, { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "@contexts/FilterContext";
import { SearchLayoutProvider } from "@contexts/SearchLayoutContext";

type Props = { children: ReactNode };

export function Providers({ children }: Props) {
  return (
    <BrowserRouter>
      <SearchLayoutProvider>
        <FilterProvider>{children}</FilterProvider>
      </SearchLayoutProvider>
    </BrowserRouter>
  );
}
