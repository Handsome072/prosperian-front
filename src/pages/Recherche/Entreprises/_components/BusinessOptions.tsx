import React, { useState } from "react";
import {
  Filter,
  Download,
  Plus,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as LayoutList,
} from "lucide-react";
import { Business } from "@entities/Business";

export interface BusinessOptionsProps {
  businesses: Business[];
  currentPage: number;
  itemsPerPage: number;
  start: number;
  end: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  // pass in the real handlers later:
  onSelectAll?: () => void;
  onExport?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  onSortChange?: (sortKey: string) => void;
}

const BusinessOptions: React.FC<BusinessOptionsProps> = ({
  businesses,
  currentPage,
  itemsPerPage,
  start,
  end,
  onPageChange,
  onItemsPerPageChange,
  onSelectAll = () => {},
  onExport = () => {},
  onAdd = () => {},
  onDelete = () => {},
  onSortChange = () => {},
}) => {
  const [layout, setLayout] = useState<"list" | "grid">("grid");
  const [sortKey, setSortKey] = useState("Pertinence");
  const handleSort = () => {
    const next = sortKey === "Pertinence" ? "Date" : "Pertinence";
    setSortKey(next);
    onSortChange(next);
  };

  const totalItems = businesses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      {/* Top row: left buttons / right filters + layout toggles */}
      <div
        className="flex flex-col justify-between items-center
                spec-lg:flex-row spec-lg:justify-between spec-lg:items-center
                w-full"
      >
        {/* 1st group: always justify-between below spec-lg, normal at spec-lg+ */}
        <div
          className="flex justify-between items-center space-x-2
                  w-full spec-lg:w-auto mb-3 spec-lg:mb-0"
        >
          <button
            onClick={onSelectAll}
            className="flex items-center border border-gray-300 rounded-md px-3 py-2 
                 hover:bg-gray-100 transition"
          >
            <Filter className="w-4 h-4 mr-2 text-gray-600" />
            <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
          </button>
          <button
            onClick={onExport}
            className="flex items-center bg-[#E95C41] hover:bg-orange-600 text-white 
                 rounded-md px-3 py-2 transition"
          >
            <Download className="w-4 h-4 md:mr-2" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center border border-gray-300 rounded-md px-3 py-2 
                 hover:bg-gray-100 transition"
          >
            <Plus className="w-4 h-4 md:mr-2 text-gray-600" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center border border-gray-300 rounded-md px-3 py-2 
                 hover:bg-gray-100 transition"
          >
            <Trash2 className="w-4 h-4 md:mr-2 text-gray-600" />
            <span className="hidden sm:inline">Supprimer</span>
          </button>
        </div>

        {/* 2nd group: full‑width below spec-lg */}
        <div className="flex items-center space-x-2 w-full spec-lg:w-auto">
          {/* First button grows to 80% below spec-lg, auto at spec-lg+ */}
          <button
            onClick={handleSort}
            className="flex-grow basis-4/5 spec-lg:flex-grow-0 spec-lg:basis-auto
                 flex items-center border border-gray-300 rounded-md px-3 py-2
                 hover:bg-gray-100 transition"
          >
            Trier : {sortKey}
          </button>

          {/* Push the last two all the way to the right */}
          <button
            onClick={() => setLayout("list")}
            className={`ml-auto p-2 border rounded-md transition ${
              layout === "list" ? "bg-[#E95C41] text-white" : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            <LayoutList className="w-5 h-5" />
          </button>

          <button
            onClick={() => setLayout("grid")}
            className={`p-2 border rounded-md transition ${
              layout === "grid" ? "bg-[#E95C41] text-white" : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/*  Page-size selector */}
      {/* <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(+e.target.value)}
        className="border px-2 py-1 rounded mb-3 md:mb-0"
      >
        {[5, 10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n} par page
          </option>
        ))}
      </select> */}
      {/* Pagination below, right-aligned */}
      <div className="flex justify-end items-center mt-3 space-x-2 text-gray-700">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm">
          {start}–{end} sur {totalItems}
        </span>
        <button onClick={handleNextPage} disabled={end >= totalItems} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BusinessOptions;
