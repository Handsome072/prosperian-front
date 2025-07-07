import React, { useState } from "react";
import { Sun, BookOpen, MessageCircle, User, Menu, X } from "lucide-react";


export const MainTopbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="p-0">
        {/* First Navigation */}
        <div className="flex items-center justify-between main-topbar p-2">
          {/* Logo + Main links (desktop only) */}
          <div className="flex flex-row items-center gap-10">
            <div className="flex items-center space-x-2 ps-2">
              <span className="text-xl font-bold text-white">
                PROSPER<span className="text-[#E95C41]">IAN</span>
              </span>
            </div>
            <div className="hidden lg:flex items-center space-x-8 text-white">
              <MenuNavLinks />
            </div>
          </div>

          {/* Hamburger (mobile only) */}
          <button className="lg:hidden p-2 text-white" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>

          {/* Right‑side icons + button (desktop only) */}
          <div className="hidden lg:flex items-center space-x-4">
            <IconButtons />
          </div>
        </div>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setDrawerOpen(false)} />}

      {/* Drawer panel */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-64 main-topbar shadow-lg z-50
          transform transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 flex justify-end items-center">
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <nav className="flex flex-col items-center space-y-6 mt-8">
          <MenuNavLinks vertical />
          <IconButtons vertical />
        </nav>
      </aside>
    </header>
  );
};

const MenuNavLinks: React.FC<{ vertical?: boolean }> = ({ vertical }) => (
  <div className={vertical ? "flex flex-col items-center space-y-4" : "flex items-center space-x-8"}>
    <nav className={vertical ? "flex flex-col items-center space-y-4" : "flex items-center space-x-6"}>
      {["Recherche", "Enrichissement", "Surveillance", "Veille"].map((label) => (
        <a
          key={label}
          href="#"
          className={`${
            label === "Recherche" ? "text-[#E95C41]" : "text-white hover:text-[#E95C41] active:text-[#E95C41]"
          } transition-colors`}
        >
          {label}
        </a>
      ))}
    </nav>
  </div>
);

const IconButtons: React.FC<{ vertical?: boolean }> = ({ vertical }) => (
  <div className={vertical ? "flex flex-col items-center space-y-4" : "flex items-center space-x-4"}>
    <button className="p-2 text-white hover:text-[#E95C41] transition-colors">
      <Sun className="w-5 h-5" />
    </button>
    <button className="p-2 text-white hover:text-[#E95C41] transition-colors">
      <BookOpen className="w-5 h-5" />
    </button>
    <button className="p-2 text-white hover:text-[#E95C41] transition-colors">
      <MessageCircle className="w-5 h-5" />
    </button>
    <button className="bg-[#E95C41] hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
      <User className="w-4 h-4" />
      <span>Se connecter</span>
    </button>
  </div>
);