import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  AlertTriangle,
  History,
  ShieldCheck,
  CheckCircle,
  FileClock,
  Briefcase
} from "lucide-react";
import { PreventivePlan, EquipmentHistory, OrderService } from "../types";

interface PreventiveProps {
  plans: PreventivePlan[];
  onUpdatePlans: (plans: PreventivePlan[]) => void;
  equipmentHistory: EquipmentHistory[];
  onUpdateHistory: (history: EquipmentHistory[]) => void;
  orders: OrderService[];
  onUpdateOrders: (orders: OrderService[]) => void;
  clients: string[];
}

export const PreventiveModule: React.FC<PreventiveProps> = ({
  plans,
  onUpdatePlans,
  equipmentHistory,
  onUpdateHistory,
  orders,
  onUpdateOrders,
  clients,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PreventivePlan | null>(plans[0] || null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);

  // Form states
  const [pClient, setPClient] = useState(clients[0] || "");
  const [pEquipment, setPEquipment] = useState("");
  const [pLocation, setPLocation] = useState("");
  const [pFrequency, setPFrequency] = useState<number>(6);
  const [pLastDate, setPLastDate] = useState("");
  const [pPolicy, setPPolicy] = useState("");

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pEquipment || !pLastDate) return;

    // Calculate next service date based on frequency
    const lastDateObj = new Date(pLastDate);
    lastDateObj.setMonth(lastDateObj.getMonth() + Number(pFrequency));
    const nextDate = lastDateObj.toISOString().split("T")[0];

    const lastNum = plans.reduce((max, p) => {
      const num = parseInt(p.id.replace("PREV-", ""), 10);
      return num > max ? num : max;
    }, 5000);

    const newId = `PREV-${lastNum + 1}`;

    const newPlan: PreventivePlan = {
      id: newId,
      clientName: pClient,
      equipmentName: pEquipment,
      equipmentLocation: pLocation || "Área General",
      frequencyMonths: Number(pFrequency),
      lastServiceDate: pLastDate,
      nextServiceDate: nextDate,
      status: "Al Corriente",
      policyCode: pPolicy || `POL-EXIM-${lastNum + 1}`
    };

    const updated = [newPlan, ...plans];
    onUpdatePlans(updated);
    setSelectedPlan(newPlan);
    setIsAddingPlan(false);
    // Reset
    setPEquipment("");
    setPLocation("");
    setPPolicy("");
    setPLastDate("");
  };

  // Convert a preventive plan that is OVERDUE or COMING to a new live Field Work Order (OS)
  const handleScheduleMaintenanceVisits = (plan: PreventivePlan) => {
    const lastNum = orders.reduce((max, o) => {
      const num = parseInt(o.id.replace("OS-", ""), 10);
      return num > max ? num : max;
    }, 1000);

    const newOSId = `OS-${lastNum + 1}`;
    const today = new Date().toISOString().split("T")[0];

    const newOS: OrderService = {
      id: newOSId,
      title: `Preventivo programado: ${plan.equipmentName}`,
      clientName: plan.clientName,
      clientAddress: plan.equipmentLocation,
      date: plan.nextServiceDate,
      assignedCrew: ["Por asignar"],
      status: "Pendiente",
      description: `Mantenimiento preventivo cíclico de póliza activa ${plan.policyCode}.\nEquipo: ${plan.equipmentName}.\nFrecuencia del contrato: cada ${plan.frequencyMonths} meses.\nLugar de montaje: ${plan.equipmentLocation}.`
    };

    onUpdateOrders([newOS, ...orders]);
    
    // Add event log in equipment history
    const newHistoryEvent: EquipmentHistory = {
      id: `H-ADD-${Date.now()}`,
      equipmentName: plan.equipmentName,
      clientName: plan.clientName,
      date: today,
      type: "Mantenimiento Preventivo Programado",
      notes: `Orden de servicio ${newOSId} levantada para ejecución en campo el ${plan.nextServiceDate}.`,
      technician: "Sistema Autoprogramable EXIM"
    };

    onUpdateHistory([newHistoryEvent, ...equipmentHistory]);

    // Update plan service logs
    const updatedPlans = plans.map((p) => {
      if (p.id === plan.id) {
        // Mock updating the service dates post scheduling
        const nextDateObj = new Date(plan.nextServiceDate);
        nextDateObj.setMonth(nextDateObj.getMonth() + plan.frequencyMonths);
        return {
          ...p,
          lastServiceDate: plan.nextServiceDate,
          nextServiceDate: nextDateObj.toISOString().split("T")[0],
          status: "Al Corriente" as const
        };
      }
      return p;
    });

    onUpdatePlans(updatedPlans);
    if (selectedPlan?.id === plan.id) {
      const nextDateObj = new Date(plan.nextServiceDate);
      nextDateObj.setMonth(nextDateObj.getMonth() + plan.frequencyMonths);
      setSelectedPlan({
        ...plan,
        lastServiceDate: plan.nextServiceDate,
        nextServiceDate: nextDateObj.toISOString().split("T")[0],
        status: "Al Corriente"
      });
    }

    alert(`¡Visita Agendada! Se ha levantado la orden ${newOSId} para el ${plan.nextServiceDate}. El plan de mantenimiento se ha reiniciado.`);
  };

  // Find equipment history filtered
  const filteredHistory = selectedPlan
    ? equipmentHistory.filter((h) => h.equipmentName === selectedPlan.equipmentName)
    : [];

  // Urgent alerts for top bar
  const urgentPlans = plans.filter((p) => p.status === "Vencido" || p.status === "Próximo Vencimiento");

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Planes de Mantenimiento Preventivo</h1>
          <p className="text-sm text-gray-500">
            Administración de pólizas de servicio recurrente (3, 6, 12 meses), alertas de vencimiento e historial por activo.
          </p>
        </div>
        <button
          onClick={() => setIsAddingPlan(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ver / Agregar Póliza de Equipo</span>
        </button>
      </div>

      {/* Add Plan Modal */}
      {isAddingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nueva Póliza de Mantenimiento Programado</h2>
            
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Cliente Asociado *</label>
                <select
                  value={pClient}
                  onChange={(e) => setPClient(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                >
                  {clients.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nombre o TAG del Equipo *</label>
                  <input
                    type="text"
                    placeholder="Ej. U.M.A. No. 4 Carrier / Chiller Recíproco"
                    value={pEquipment}
                    onChange={(e) => setPEquipment(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Código de Póliza / Contratación</label>
                  <input
                    type="text"
                    placeholder="Ej. POL-ALTA-120"
                    value={pPolicy}
                    onChange={(e) => setPPolicy(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Frecuencia Rutina</label>
                  <select
                    value={pFrequency}
                    onChange={(e) => setPFrequency(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value={3}>Trimestral (Cada 3 meses)</option>
                    <option value={6}>Semestral (Cada 6 meses)</option>
                    <option value={12}>Anual (Cada 12 meses)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha de Último Servicio *</label>
                  <input
                    type="date"
                    value={pLastDate}
                    onChange={(e) => setPLastDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Lugar Físico de Montaje</label>
                <input
                  type="text"
                  placeholder="Ej. Cuarto de máquinas planta alta"
                  value={pLocation}
                  onChange={(e) => setPLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingPlan(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Crear Póliza Programada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Admin Actionable Alerts Section of upcoming dates */}
      {urgentPlans.length > 0 && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-extrabold text-rose-900 border-b border-rose-100/50 pb-2">
            <AlertTriangle className="h-5.5 w-5.5 text-rose-500 shrink-0" />
            <span>Alertas del Administrador: Servicios Preventivos Próximos o Vencidos</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {urgentPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-lg bg-white p-3.5 border border-rose-100 flex items-center justify-between text-xs hover:border-rose-300 shadow-xs"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-rose-600">{plan.id} ({plan.status})</span>
                  <p className="font-extrabold text-slate-900 mt-1 text-sm">{plan.equipmentName}</p>
                  <p className="text-xs text-slate-500 font-bold truncate max-w-xs">{plan.clientName}</p>
                  <p className="text-xs text-rose-800 font-extrabold mt-1">Próxima Visita: {plan.nextServiceDate}</p>
                </div>
                <button
                  onClick={() => handleScheduleMaintenanceVisits(plan)}
                  className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                  Agendar Visita
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Structural row splits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Hand: Plans catalog list */}
        <div className="space-y-3.5 lg:col-span-1">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block">Equipamiento Bajo Póliza</span>
          <div className="space-y-2.5">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  selectedPlan?.id === p.id
                    ? "border-rose-450 bg-rose-50/20 shadow-xs"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">{p.id}</span>
                  <span className="text-xs font-extrabold bg-rose-100 text-rose-700 border border-rose-150 rounded px-2 py-0.5">
                    {p.policyCode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">{p.equipmentName}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-bold truncate">{p.clientName}</p>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-slate-600 font-semibold font-sans">
                  <span>Ciclo: {p.frequencyMonths} meses</span>
                  <span
                    className={`font-extrabold ${
                      p.status === "Al Corriente"
                        ? "text-emerald-600"
                        : p.status === "Vencido"
                        ? "text-rose-600"
                        : "text-amber-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Hand: Plan details and full equipment history log */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPlan ? (
            <div className="glass-card p-5 space-y-6">
              {/* Plan Head section info */}
              <div className="flex flex-col justify-between border-b border-gray-50 pb-4 gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-rose-600">{selectedPlan.id}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-700 bg-emerald-100 border border-emerald-200 rounded px-2.5 py-0.5 font-bold uppercase">
                      Póliza Vigente
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{selectedPlan.equipmentName}</h2>
                  <p className="text-sm text-slate-550 font-bold">{selectedPlan.clientName}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-bold uppercase">Rutinas de Servicio</span>
                  <span className="text-sm font-extrabold text-slate-800">Cada {selectedPlan.frequencyMonths} Meses</span>
                </div>
              </div>

              {/* Action and date cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50/60 p-4 border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase mb-1">Último Mantenimiento</span>
                    <span className="font-bold font-mono text-gray-800">{selectedPlan.lastServiceDate}</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                
                <div className="rounded-lg bg-slate-50/60 p-4 border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase mb-1">Próximo Vencimiento</span>
                    <span className="font-bold font-mono text-gray-800">{selectedPlan.nextServiceDate}</span>
                  </div>
                  {selectedPlan.status === "Vencido" ? (
                    <button
                      onClick={() => handleScheduleMaintenanceVisits(selectedPlan)}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-rose-700"
                    >
                      Agendar Ya
                    </button>
                  ) : (
                    <CalendarDays className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>

              {/* Equipment log feed */}
              <div>
                <dt className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3 md:mb-4 flex items-center gap-1">
                  <History className="h-4 w-4 text-gray-400" />
                  <span>Historial del Equipo / Activo Industrial</span>
                </dt>

                {filteredHistory.length > 0 ? (
                  <div className="relative border-l-2 border-slate-100 pl-4 space-y-5">
                    {filteredHistory.map((hist) => (
                      <div key={hist.id} className="relative text-xs">
                        {/* Dot indicator */}
                        <span className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-indigo-500" />
                        
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-mono text-[10px] text-gray-400">{hist.date}</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                            {hist.type}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600 font-medium">{hist.notes}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                          <Briefcase className="h-3 w-3" />
                          <span>Técnico a cargo: {hist.technician}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
                    <FileClock className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                    <span>No hay bitácora de intervenciones previas registrada para este activo.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-400">
              <CalendarDays className="h-10 w-10 text-slate-300 mx-auto animate-pulse-slow" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">Detalle de Póliza</p>
              <p className="text-xs text-gray-400 mt-1">Registra la primera póliza preventiva para dar seguimiento a los mantenimientos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
