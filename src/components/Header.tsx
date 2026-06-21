import React from "react";
import { Menu, User, MapPin } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
}) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between glass-header px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Toggle button */}
        <button
          id="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-white/50 hover:text-gray-900 focus:outline-none transition-colors"
          title="Alternar menú"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Company Logo and Info */}
        <div className="flex items-center gap-2.5">
          <img
            src="https://exim.com.mx/wp-content/uploads/2023/01/Logo-Exim-png-2-1-e1695846816440.png"
            alt="Exim Logo"
            className="h-9 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-bold tracking-tight text-gray-900">
              EXIM INGENIERÍA
            </span>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
              <MapPin className="h-3 w-3 text-red-500" />
              <span>Villahermosa, Tabasco</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tab indicator and user badge */}
      <div className="flex items-center gap-4">
        <div className="hidden rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xs px-3 py-1 text-xs font-bold text-blue-700 sm:inline-block">
          Módulo: {activeTab}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/40 backdrop-blur-xs px-3 py-1.5 border border-white/60 shadow-xs">
          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white shadow-xs">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-gray-800 hidden sm:inline">
            Admin EXIM
          </span>
        </div>
      </div>
    </header>
  );
};
