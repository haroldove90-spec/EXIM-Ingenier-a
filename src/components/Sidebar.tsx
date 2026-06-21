import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  FileSpreadsheet,
  CalendarDays,
  Package,
  Users2,
  DollarSign,
  ChevronLeft,
  Settings,
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  setOpen,
  activeView,
  setActiveView,
}) => {
  const menuItems = [
    { id: "overview", label: "Inicio y Tablero", icon: LayoutDashboard, color: "text-indigo-600 hover:text-indigo-700 bg-indigo-50" },
    { id: "fsm", label: "Operaciones en Campo (FSM)", icon: ClipboardList, color: "text-sky-600 bg-sky-50" },
    { id: "projects", label: "Gestión de Proyectos", icon: FolderKanban, color: "text-amber-600 bg-amber-50" },
    { id: "quotes", label: "Cotizaciones y Presupuestos", icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50" },
    { id: "preventive", label: "Mantenimiento Planificado", icon: CalendarDays, color: "text-rose-600 bg-rose-50" },
    { id: "inventory", label: "Inventarios y Almacén", icon: Package, color: "text-violet-600 bg-violet-50" },
    { id: "contacts", label: "Directorio CRM", icon: Users2, color: "text-teal-600 bg-teal-50" },
    { id: "finance", label: "Administración y Finanzas", icon: DollarSign, color: "text-cyan-600 bg-cyan-50" },
  ];

  return (
    <>
      {/* Mobile structural overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 top-16 z-35 flex w-72 flex-col justify-between glass-sidebar transition-transform duration-300 ease-in-out lg:static lg:h-[calc(100vh-64px)] ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1.5" id="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`side-menu-${item.id}`}
                  onClick={() => {
                    setActiveView(item.id);
                    // On mobile, auto close sidebar on menu click
                    if (window.innerWidth < 1024) {
                      setOpen(false);
                    }
                  }}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-white/60 text-blue-700 shadow-xs border-l-4 border-blue-600"
                      : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
                  }`}
                  title={item.label}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-800"}`} />
                  <span className={`truncate duration-200 ${!open && "lg:hidden"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-slate-200/40 ${!open && "lg:hidden"}`}>
          <div className="bg-white/40 rounded-xl p-3 border border-white/60 shadow-xs">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Villahermosa, Tab</p>
            <p className="text-xs text-slate-700 leading-normal font-semibold">Sistema central de ingeniería y climatización.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
