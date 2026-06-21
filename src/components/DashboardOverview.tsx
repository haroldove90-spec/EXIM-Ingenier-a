import React from "react";
import {
  TrendingUp,
  Wrench,
  FolderOpen,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight
} from "lucide-react";
import { OrderService, Project, FinRecord, PreventivePlan } from "../types";

interface DashboardOverviewProps {
  orders: OrderService[];
  projects: Project[];
  finances: FinRecord[];
  preventives: PreventivePlan[];
  setActiveView: (view: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  orders,
  projects,
  finances,
  preventives,
  setActiveView,
}) => {
  // 1. Calculate General KPIs
  const totalOrders = orders.length;
  const finishedOrders = orders.filter((o) => o.status === "Finalizado").length;
  const techEfficiency = totalOrders > 0 ? Math.round((finishedOrders / totalOrders) * 100) : 0;

  const activeProjectsCount = projects.length;

  const pendingPreventiveCount = preventives.filter(
    (p) => p.status === "Vencido" || p.status === "Próximo Vencimiento"
  ).length;

  // 2. Financial Totals (Ingresos vs Egresos)
  const totalIncome = finances
    .filter((f) => f.type !== "Gasto Operativo" && f.status === "Cobrado")
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingIncome = finances
    .filter((f) => f.type !== "Gasto Operativo" && f.status === "Pendiente")
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpense = finances
    .filter((f) => f.type === "Gasto Operativo")
    .reduce((sum, f) => sum + f.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // 3. Project Profitability
  const projectStats = projects.map((p) => {
    const costReal = p.costReal;
    const profit = p.costBudget - costReal;
    const margin = p.costBudget > 0 ? Math.round((profit / p.costBudget) * 100) : 0;
    return {
      name: p.name,
      budget: p.costBudget,
      real: costReal,
      profit,
      margin,
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-slate-900/85 backdrop-blur border border-slate-700/60 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-slate-800/40 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido al Portal de EXIM Ingeniería</h1>
        <p className="mt-1 text-sm text-slate-300">
          Control general de obras, mantenimiento industrial, comercial y residencial en Villahermosa, Tabasco.
        </p>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Tech Efficiency */}
        <div className="glass-card glass-card-hover p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Eficiencia Técnica</span>
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{techEfficiency}%</span>
            <span className="text-xs font-semibold text-green-600">Servicios cerrados</span>
          </div>
          <p className="mt-2 text-xs text-stone-500 font-medium">
            {finishedOrders} de {totalOrders} órdenes completadas a tiempo
          </p>
        </div>

        {/* KPI 2: Active Projects */}
        <button
          onClick={() => setActiveView("projects")}
          className="text-left glass-card glass-card-hover p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Proyectos Activos</span>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-amber-600">
              <FolderOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{activeProjectsCount}</span>
            <span className="text-xs font-semibold text-stone-500">En desarrollo</span>
          </div>
          <p className="mt-2 text-xs text-blue-600 font-bold flex items-center gap-1">
            Ver cronograma Gantt <ArrowRight className="h-3 w-3" />
          </p>
        </button>

        {/* KPI 3: Preventive Alarms */}
        <button
          onClick={() => setActiveView("preventive")}
          className="text-left glass-card glass-card-hover p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mtos. Urgentes</span>
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{pendingPreventiveCount}</span>
            <span className="text-xs font-semibold text-rose-600 font-mono">Pronto/Vencidos</span>
          </div>
          <p className="mt-2 text-xs text-stone-500 font-medium">Pólizas de servicio preventivas por agendar</p>
        </button>

        {/* KPI 4: Net Profit */}
        <div className="glass-card glass-card-hover p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Flujo de Caja</span>
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${netBalance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-blue-600">MXN</span>
          </div>
          <p className="mt-2 text-xs text-stone-500 font-medium">Ingeso cobrado menos gastos de campo</p>
        </div>
      </div>

      {/* Visual Balance and Operational Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Balance Card Block */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 font-sans">Balance Financiero Rápido</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            <div className="rounded-xl bg-green-500/10 p-4 border border-green-500/15">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Ingresos Cobrados</span>
              <p className="mt-1 text-lg font-bold text-green-800 font-mono">
                ${totalIncome.toLocaleString("es-MX")}
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/15">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ingresos por Cobrar</span>
              <p className="mt-1 text-lg font-bold text-amber-800 font-mono">
                ${pendingIncome.toLocaleString("es-MX")}
              </p>
            </div>
            <div className="rounded-xl bg-rose-500/10 p-4 border border-rose-500/15">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Gastos de Campo</span>
              <p className="mt-1 text-lg font-bold text-rose-800 font-mono">
                ${totalExpense.toLocaleString("es-MX")}
              </p>
            </div>
          </div>

          {/* Visual Custom Chart for Income vs Expenses */}
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Distribución de Recursos</span>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Ingreso Cobrado ({Math.round(totalIncome > 0 ? (totalIncome / (totalIncome + totalExpense)) * 100 : 0)}%)</span>
                <span>${totalIncome.toLocaleString("es-MX")}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${totalIncome > 0 ? (totalIncome / (totalIncome + totalExpense)) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Gastos Operativos / Viáticos ({Math.round(totalIncome > 0 ? (totalExpense / (totalIncome + totalExpense)) * 100 : 0)}%)</span>
                <span>${totalExpense.toLocaleString("es-MX")}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${totalIncome > 0 ? (totalExpense / (totalIncome + totalExpense)) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Crew & Performance Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 font-sans">Rendimiento de Servicios</h2>
            <div className="space-y-3">
              {/* Stat list */}
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/50">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-slate-700 font-medium">Mantenimiento Finalizado</span>
                </div>
                <span className="font-bold text-gray-950">{orders.filter(o => o.status === "Finalizado").length}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/50">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-700 font-medium">Servicios en Campo Activos</span>
                </div>
                <span className="font-bold text-gray-950">{orders.filter(o => o.status === "En Proceso").length}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/50">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="text-slate-700 font-medium">Pausados por Material</span>
                </div>
                <span className="font-bold text-gray-950">{orders.filter(o => o.status === "Pausado por Material").length}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                  <span className="text-slate-700 font-medium">Órdenes Pendientes</span>
                </div>
                <span className="font-bold text-gray-950">{orders.filter(o => o.status === "Pendiente").length}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/40">
            <button
              onClick={() => setActiveView("fsm")}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 tracking-wider transition-all shadow-xs uppercase"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Administrar Ordenes de Servicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rentabilidad de Proyectos */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 font-sans">Rentabilidad por Proyecto</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3">Proyecto</th>
                <th className="px-4 py-3 text-right">Presupuesto</th>
                <th className="px-4 py-3 text-right">Gasto Real</th>
                <th className="px-4 py-3 text-right">Utilidad Escrita</th>
                <th className="px-4 py-3 text-right">Margen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projectStats.map((proj, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3.5 font-medium text-gray-900 max-w-xs truncate">{proj.name}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-gray-700">${proj.budget.toLocaleString("es-MX")}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-gray-700">${proj.real.toLocaleString("es-MX")}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-medium text-green-600">
                    +${proj.profit.toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                      {proj.margin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
