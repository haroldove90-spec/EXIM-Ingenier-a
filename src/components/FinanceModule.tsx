import React, { useState } from "react";
import {
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CalendarDays,
  FileCheck2,
  Filter,
  CheckCircle,
  AlertTriangle,
  Receipt
} from "lucide-react";
import { FinRecord } from "../types";

interface FinanceProps {
  finances: FinRecord[];
  onUpdateFinances: (finances: FinRecord[]) => void;
  clients: string[];
}

export const FinanceModule: React.FC<FinanceProps> = ({
  finances,
  onUpdateFinances,
  clients,
}) => {
  const [activeTab, setActiveTabTab] = useState<"all" | "cxc" | "expenses">("all");
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  // New Record form state
  const [fType, setFType] = useState<FinRecord["type"]>("Anticipo");
  const [fSubType, setFSubType] = useState<FinRecord["subType"]>("Material");
  const [fAmount, setFAmount] = useState(0);
  const [fAssociated, setFAssociated] = useState(clients[0] || "");
  const [fDesc, setFDesc] = useState("");
  const [fTerms, setFTerms] = useState<number>(30);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (fAmount <= 0) return;

    const lastNum = finances.reduce((max, f) => {
      const num = parseInt(f.id.replace("FIN-", ""), 10);
      return num > max ? num : max;
    }, 7000);

    const newId = `FIN-${lastNum + 1}`;
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    // Calculate due date if account receivable has credit terms
    let dueDateString: string | undefined;
    if (fType === "Estimación" || fType === "Venta") {
      const due = new Date();
      due.setDate(due.getDate() + Number(fTerms));
      dueDateString = due.toISOString().split("T")[0];
    }

    const newRec: FinRecord = {
      id: newId,
      type: fType,
      subType: fType === "Gasto Operativo" ? fSubType : undefined,
      amount: Number(fAmount),
      date: todayString,
      status: fType === "Gasto Operativo" ? "Pagado" : "Pendiente",
      associatedWith: fAssociated,
      description: fDesc || `${fType} de obra`,
      dueDate: dueDateString,
      creditTerms: (fType === "Estimación" || fType === "Venta") ? (fTerms as 30|60|90) : undefined
    };

    onUpdateFinances([newRec, ...finances]);
    setIsAddingRecord(false);
    // Reset Form
    setFAmount(0);
    setFDesc("");
    alert("Transacción financiera almacenada correctamente.");
  };

  const handleMarkAsCollected = (id: string) => {
    const updated = finances.map((f) => {
      if (f.id === id) {
        return { ...f, status: "Cobrado" as const };
      }
      return f;
    });
    onUpdateFinances(updated);
    alert("La factura / estimación se ha marcado como COBRADA en flujo.");
  };

  // Financial calculations
  const collectedIncome = finances
    .filter((f) => f.type !== "Gasto Operativo" && f.status === "Cobrado")
    .reduce((sum, f) => sum + f.amount, 0);

  const outstandingReceivable = finances
    .filter((f) => f.type !== "Gasto Operativo" && f.status === "Pendiente")
    .reduce((sum, f) => sum + f.amount, 0);

  const companyExpenses = finances
    .filter((f) => f.type === "Gasto Operativo")
    .reduce((sum, f) => sum + f.amount, 0);

  // Filter listings based on sub-tabs
  const filteredRecords = finances.filter((f) => {
    if (activeTab === "all") return true;
    if (activeTab === "cxc") return f.type !== "Gasto Operativo" && f.status === "Pendiente";
    if (activeTab === "expenses") return f.type === "Gasto Operativo";
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Administración y Finanzas Obras EXIM</h1>
          <p className="text-sm text-gray-500">
            Control de anticipos, estimaciones de avance, monitoreo de saldos por cobrar (plazos 30/60/90 días) y bitácora de gastos operativos.
          </p>
        </div>

        <button
          onClick={() => setIsAddingRecord(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Transacción / Gasto</span>
        </button>
      </div>

      {/* Expense or Income Adding Modal overlay */}
      {isAddingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nueva Transacción de Flujo de Caja</h2>
            
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tipo Movimiento</label>
                  <select
                    value={fType}
                    onChange={(e) => setFType(e.target.value as FinRecord["type"])}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs font-semibold"
                  >
                    <option value="Anticipo font-bold">💎 Anticipo Obra</option>
                    <option value="Estimación">📈 Estimación Avance</option>
                    <option value="Venta">🛒 Venta Directa</option>
                    <option value="Gasto Operativo">🛑 Gasto en Campo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Monto MXN *</label>
                  <input
                    type="number"
                    value={fAmount}
                    onChange={(e) => setFAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {fType === "Gasto Operativo" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Concepto Gasto Campo</label>
                  <select
                    value={fSubType}
                    onChange={(e) => setFSubType(e.target.value as FinRecord["subType"])}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs"
                  >
                    <option value="Gasolina">⛽ Gasolina Pick-ups</option>
                    <option value="Viáticos">✈️ Peajes y Viáticos</option>
                    <option value="Comida">🍖 Comidas de Cuadrilla</option>
                    <option value="Compra Pánico">🛠️ Compra de Pánico (Urgencia)</option>
                    <option value="Material">📦 Adquisición de Refacciones</option>
                  </select>
                </div>
              ) : (fType === "Estimación" || fType === "Venta") ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Términos de Crédito Facturación</label>
                  <select
                    value={fTerms}
                    onChange={(e) => setFTerms(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs font-semibold"
                  >
                    <option value={30}>30 Días de Crédito comercial</option>
                    <option value={60}>60 Días de Crédito comercial</option>
                    <option value={90}>90 Días de Crédito contractual</option>
                  </select>
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Entidad Relacionada (Cliente / Unidad)</label>
                <input
                  type="text"
                  placeholder="Ej. PEMEX Luna / Pick-up Nissan Placa VN-112"
                  value={fAssociated}
                  onChange={(e) => setFAssociated(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Descripción del Concepto</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Suministro complementario de cables, gas, etc..."
                  value={fDesc}
                  onChange={(e) => setFDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingRecord(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Registrar en Flujo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Financial Overview stats strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card glass-card-hover p-5 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm text-slate-600 font-extrabold block uppercase tracking-wider">Anticipos e Ingresos Cobrados</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1.5 block">
              ${collectedIncome.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg bg-green-500/10 border border-green-500/25 p-3 text-green-600 font-bold">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm text-slate-600 font-extrabold block uppercase tracking-wider">Cuentas por Cobrar (cxC)</span>
            <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1.5 block">
              ${outstandingReceivable.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 p-3 text-amber-600 font-bold">
            <AlertTriangle className="h-6 w-6 animate-pulse-slow" />
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm text-slate-600 font-extrabold block uppercase tracking-wider">Egresos / Gastos Operativos de Cuadrilla</span>
            <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1.5 block">
              ${companyExpenses.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 p-3 text-rose-600 font-bold">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Sub tabs filtering ledger */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTabTab("all")}
          className={`px-4 py-3 text-sm font-bold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "all"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Receipt className="h-4 w-4" /> Todas las Operaciones
        </button>
        <button
          onClick={() => setActiveTabTab("cxc")}
          className={`px-4 py-3 text-sm font-bold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "cxc"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <CalendarDays className="h-4 w-4" /> Cuentas por Cobrar (cxC Activas)
        </button>
        <button
          onClick={() => setActiveTabTab("expenses")}
          className={`px-4 py-3 text-sm font-bold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "expenses"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Filter className="h-4 w-4" /> Gastos de Campo y Caja Chica
        </button>
      </div>

      {/* LEDGER TABULATION LISTING */}
      <div className="glass-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 font-extrabold uppercase text-slate-700 tracking-wider text-xs sm:text-sm">
              <tr>
                <th className="px-4 py-3.5">ID Movimiento</th>
                <th className="px-4 py-3.5">Tipo</th>
                <th className="px-4 py-3.5 text-right">Importe</th>
                <th className="px-4 py-3.5">Asociado / Proyecto</th>
                <th className="px-4 py-3.5">Descripción</th>
                <th className="px-4 py-3.5">Fecha</th>
                
                {activeTab === "cxc" ? (
                  <>
                    <th className="px-4 py-3.5">Vencimiento</th>
                    <th className="px-4 py-3.5">Plazo</th>
                    <th className="px-4 py-3.5 text-center">Gestión</th>
                  </>
                ) : (
                  <th className="px-4 py-3.5">Estatus</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-450 font-sans">No se encontraron cobros o gastos registrados.</td>
                </tr>
              ) : (
                filteredRecords.map((fin) => {
                  const isOverdue = fin.dueDate && new Date(fin.dueDate) < new Date();
                  return (
                    <tr key={fin.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4 font-mono font-bold text-indigo-600">{fin.id}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 font-sans font-bold text-xs ${
                            fin.type === "Gasto Operativo"
                              ? "bg-rose-100/70 text-rose-700 border border-rose-200"
                              : fin.type === "Anticipo"
                              ? "bg-emerald-100/70 text-emerald-700 border border-emerald-200"
                              : "bg-blue-100/70 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {fin.type} {fin.subType ? `(${fin.subType})` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-slate-900">
                        ${fin.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 max-w-xs truncate text-stone-800 font-bold">{fin.associatedWith}</td>
                      <td className="px-4 py-4 font-bold text-slate-800 max-w-[200px] truncate">{fin.description}</td>
                      <td className="px-4 py-4 font-mono text-slate-500">{fin.date}</td>

                      {activeTab === "cxc" ? (
                        <>
                          <td className="px-4 py-4 font-mono font-bold text-rose-700">{fin.dueDate}</td>
                          <td className="px-4 py-4">
                            <span className="rounded bg-yellow-100 font-bold text-xs text-yellow-850 px-2 py-0.5 border border-yellow-200">
                              {fin.creditTerms} Días d/c
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleMarkAsCollected(fin.id)}
                              className="rounded bg-slate-900 border border-slate-750 font-bold text-xs text-white px-2.5 py-1 hover:bg-slate-800 cursor-pointer transition-all"
                            >
                              Registrar Pago Recibido
                            </button>
                          </td>
                        </>
                      ) : (
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase border ${
                              fin.status === "Cobrado" || fin.status === "Pagado"
                                ? "bg-green-100/70 border-green-200 text-green-700"
                                : "bg-yellow-100/70 border-yellow-250 text-yellow-700"
                            }`}
                          >
                            {fin.status}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
