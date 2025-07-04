// src/components/Header.tsx
import React, { useState } from "react";
import { Search, Sun, BookOpen, MessageCircle, User, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-3">
        {/* First Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo + Main links (desktop only) */}
          <div className="flex flex-row items-center gap-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                COMP<span className="text-orange-500">ANYX</span>
              </span>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <MenuNavLinks />
            </div>
          </div>

          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Right‑side icons + button (desktop only) */}
          <div className="hidden lg:flex items-center space-x-4">
            <IconButtons />
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-4 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex space-x-8">
            <NavLink href="#" active>
              Entreprises
            </NavLink>
            <NavLink href="#">Contacts</NavLink>
            <NavLink href="#">Listes</NavLink>
            <NavLink href="#">Exports</NavLink>
            <NavLink href="#">Mes Recherches</NavLink>
          </div>
          <div className="w-full lg:w-auto max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Je recherche une entreprise, un dirigeant..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setDrawerOpen(false)} />}

      {/* Drawer panel */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 flex justify-between items-center">
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <nav className="flex flex-col items-center space-y-6 mt-8">
          {/* duplicate  MenuNavLinks + Icons + Button */}
          <MenuNavLinks vertical />
          <IconButtons vertical />
        </nav>
      </aside>
    </header>
  );
};

// you can pull these into their own files if you like:
const MenuNavLinks: React.FC<{ vertical?: boolean }> = ({ vertical }) => (
  <div className={vertical ? "flex flex-col items-center space-y-4" : "flex items-center space-x-8"}>
    <nav className={vertical ? "flex flex-col items-center space-y-4" : "flex items-center space-x-6"}>
      {["Recherche", "Enrichissement", "Surveillance", "Veille"].map((label) => (
        <a
          key={label}
          href="#"
          className={`${
            label === "Recherche" ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
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
    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
      <Sun className="w-5 h-5" />
    </button>
    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
      <BookOpen className="w-5 h-5" />
    </button>
    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
      <MessageCircle className="w-5 h-5" />
    </button>
    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
      <User className="w-4 h-4" />
      <span>Se connecter</span>
    </button>
  </div>
);

const NavLink: React.FC<{ href: string; active?: boolean; children: React.ReactNode }> = ({
  href,
  active,
  children,
}) => (
  <a
    href={href}
    className={`${
      active ? "text-orange-500 border-b-2 border-orange-500 pb-2" : "text-gray-600 hover:text-gray-900 pb-2"
    } transition-colors`}
  >
    {children}
  </a>
);
