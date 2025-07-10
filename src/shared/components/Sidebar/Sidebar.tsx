import React from "react";
import { FiltersPanel, FiltersPanelProps } from "./FiltersPanel";

export const Sidebar: React.FC<FiltersPanelProps> = (props) => (
  <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
    <FiltersPanel {...props} />
  </div>
);
