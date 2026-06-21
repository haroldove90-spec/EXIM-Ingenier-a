import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardOverview } from "./components/DashboardOverview";
import { FSMModule } from "./components/FSMModule";
import { ProjectsModule } from "./components/ProjectsModule";
import { QuotationsModule } from "./components/QuotationsModule";
import { PreventiveModule } from "./components/PreventiveModule";
import { InventoryModule } from "./components/InventoryModule";
import { ContactsModule } from "./components/ContactsModule";
import { FinanceModule } from "./components/FinanceModule";

import {
  initialClients,
  initialProviders,
  initialServiceOrders,
  initialProjects,
  initialQuotations,
  initialPreventivePlans,
  initialEquipmentHistory,
  initialInventoryItems,
  initialInventoryMovements,
  initialToolAssets,
  initialFinRecords,
} from "./data";

import {
  Client,
  Provider,
  OrderService,
  Project,
  Quotation,
  PreventivePlan,
  EquipmentHistory,
  InventoryItem,
  InventoryMovement,
  ToolAsset,
  FinRecord,
} from "./types";

export default function App() {
  // Sidebar open/collapse state (default open on desktop)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Current active sub-view module
  const [activeView, setActiveView] = useState("overview");

  // CRM Clients and Providers state
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem("exim_clients");
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem("exim_providers");
    return saved ? JSON.parse(saved) : initialProviders;
  });

  // FSM Work Orders State
  const [orders, setOrders] = useState<OrderService[]>(() => {
    const saved = localStorage.getItem("exim_orders");
    return saved ? JSON.parse(saved) : initialServiceOrders;
  });

  // PM Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("exim_projects");
    return saved ? JSON.parse(saved) : initialProjects;
  });

  // Quotations and Estimates state
  const [quotes, setQuotes] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem("exim_quotes");
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  // Planned preventives policies state
  const [plans, setPlans] = useState<PreventivePlan[]>(() => {
    const saved = localStorage.getItem("exim_plans");
    return saved ? JSON.parse(saved) : initialPreventivePlans;
  });

  const [equipmentHistory, setEquipmentHistory] = useState<EquipmentHistory[]>(() => {
    const saved = localStorage.getItem("exim_eq_history");
    return saved ? JSON.parse(saved) : initialEquipmentHistory;
  });

  // Warehouse stocks state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("exim_inventory_items");
    return saved ? JSON.parse(saved) : initialInventoryItems;
  });

  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem("exim_inventory_movements");
    return saved ? JSON.parse(saved) : initialInventoryMovements;
  });

  const [toolAssets, setToolAssets] = useState<ToolAsset[]>(() => {
    const saved = localStorage.getItem("exim_tools");
    return saved ? JSON.parse(saved) : initialToolAssets;
  });

  // Financial accounting state
  const [finRecords, setFinRecords] = useState<FinRecord[]>(() => {
    const saved = localStorage.getItem("exim_finances");
    return saved ? JSON.parse(saved) : initialFinRecords;
  });

  // Sync state to local storage on changes
  useEffect(() => {
    localStorage.setItem("exim_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("exim_providers", JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem("exim_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("exim_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("exim_quotes", JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem("exim_plans", JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem("exim_eq_history", JSON.stringify(equipmentHistory));
  }, [equipmentHistory]);

  useEffect(() => {
    localStorage.setItem("exim_inventory_items", JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem("exim_inventory_movements", JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);

  useEffect(() => {
    localStorage.setItem("exim_tools", JSON.stringify(toolAssets));
  }, [toolAssets]);

  useEffect(() => {
    localStorage.setItem("exim_finances", JSON.stringify(finRecords));
  }, [finRecords]);

  // Handle collapsible layout and default close on small tablets or screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map of client names for dropdown selectors
  const clientNames = clients.map((c) => c.name);

  // Active Tab/Module render matching
  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return (
          <DashboardOverview
            orders={orders}
            projects={projects}
            finances={finRecords}
            preventives={plans}
            setActiveView={setActiveView}
          />
        );
      case "fsm":
        return (
          <FSMModule
            orders={orders}
            onUpdateOrders={setOrders}
            clients={clientNames}
          />
        );
      case "projects":
        return (
          <ProjectsModule
            projects={projects}
            onUpdateProjects={setProjects}
            clients={clientNames}
          />
        );
      case "quotes":
        return (
          <QuotationsModule
            quotes={quotes}
            onUpdateQuotes={setQuotes}
            orders={orders}
            onUpdateOrders={setOrders}
            projects={projects}
            onUpdateProjects={setProjects}
            clients={clientNames}
          />
        );
      case "preventive":
        return (
          <PreventiveModule
            plans={plans}
            onUpdatePlans={setPlans}
            equipmentHistory={equipmentHistory}
            onUpdateHistory={setEquipmentHistory}
            orders={orders}
            onUpdateOrders={setOrders}
            clients={clientNames}
          />
        );
      case "inventory":
        return (
          <InventoryModule
            items={inventoryItems}
            onUpdateItems={setInventoryItems}
            movements={inventoryMovements}
            onUpdateMovements={setInventoryMovements}
            tools={toolAssets}
            onUpdateTools={setToolAssets}
          />
        );
      case "contacts":
        return (
          <ContactsModule
            clients={clients}
            onUpdateClients={setClients}
            providers={providers}
            onUpdateProviders={setProviders}
            orders={orders}
            projects={projects}
            quotes={quotes}
          />
        );
      case "finance":
        return (
          <FinanceModule
            finances={finRecords}
            onUpdateFinances={setFinRecords}
            clients={clientNames}
          />
        );
      default:
        return (
          <div className="flex h-64 items-center justify-center text-xs text-gray-400 uppercase font-bold tracking-wider">
            Módulo en desarrollo
          </div>
        );
    }
  };

  const getActiveTabLabel = () => {
    switch (activeView) {
      case "overview": return "Inicio y Tablero";
      case "fsm": return "Operaciones en Campo (FSM)";
      case "projects": return "Obras y Proyectos";
      case "quotes": return "Cotizaciones";
      case "preventive": return "Mantenimiento Preventivo";
      case "inventory": return "Almacén e Inventarios";
      case "contacts": return "Directorio CRM Clientes";
      case "finance": return "Finanzas y Contabilidad";
      default: return "";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent font-sans" id="app-root-container">
      {/* Top Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={getActiveTabLabel()}
      />

      <div className="flex flex-1">
        {/* Left collapsable Navigation Bar */}
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        {/* Prime Workspace Content */}
        <main
          className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8"
          style={{ maxWidth: "100%" }}
        >
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
