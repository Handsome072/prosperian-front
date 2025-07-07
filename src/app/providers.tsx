import React, { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "@entities/contexts/FilterContext";

type Props = { children: ReactNode };

export function Providers({ children }: Props) {
  return (
    <BrowserRouter>
      <FilterProvider>
        {children}
      </FilterProvider>
    </BrowserRouter>
  );
}
