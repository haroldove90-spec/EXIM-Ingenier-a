import React, { useState } from "react";
import {
  Package,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  AlertOctagon,
  Wrench,
  Search,
  User,
  History,
  RotateCcw
} from "lucide-react";
import { InventoryItem, InventoryMovement, ToolAsset } from "../types";

interface InventoryProps {
  items: InventoryItem[];
  onUpdateItems: (items: InventoryItem[]) => void;
  movements: InventoryMovement[];
  onUpdateMovements: (movements: InventoryMovement[]) => void;
  tools: ToolAsset[];
  onUpdateTools: (tools: ToolAsset[]) => void;
}

export const InventoryModule: React.FC<InventoryProps> = ({
  items,
  onUpdateItems,
  movements,
  onUpdateMovements,
  tools,
  onUpdateTools,
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "movements" | "tools">("catalog");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemCategoryFilter, setItemCategoryFilter] = useState("Todos");

  // Item form states
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCat, setItemCat] = useState<InventoryItem["category"]>("Eléctrico");
  const [itemStock, setItemStock] = useState(0);
  const [itemMin, setItemMin] = useState(5);
  const [itemUnit, setItemUnit] = useState("pzs");
  const [itemLoc, setItemLoc] = useState("");

  // Movement Form States
  const [isAddingMovement, setIsAddingMovement] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || "");
  const [moveType, setMoveType] = useState<"Entrada" | "Salida">("Salida");
  const [moveQty, setMoveQty] = useState(1);
  const [moveRecipient, setMoveRecipient] = useState("");
  const [moveReason, setMoveReason] = useState("");

  // Tool assigning states
  const [assigningToolId, setAssigningToolId] = useState<string | null>(null);
  const [assigneeName, setAssigneeName] = useState("");

  const techOptions = [
    "Ing. Carlos Ramos",
    "Téc. Roberto Izquierdo",
    "Téc. Samuel Priego",
    "Aux. Juan Chablé",
    "Ninguno"
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    const lastNum = items.reduce((max, item) => {
      const num = parseInt(item.id.replace("MAT-", ""), 10);
      return num > max ? num : max;
    }, 4000);

    const newId = `MAT-${lastNum + 1}`;
    const newItem: InventoryItem = {
      id: newId,
      name: itemName,
      category: itemCat,
      stock: Number(itemStock) || 0,
      minStock: Number(itemMin) || 0,
      unit: itemUnit,
      location: itemLoc || "Almacén Central"
    };

    onUpdateItems([newItem, ...items]);
    setIsAddingItem(false);
    setItemName("");
    setItemStock(0);
    setItemMin(5);
    setItemLoc("");
  };

  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.id === selectedItemId);
    if (!item) return;

    if (moveType === "Salida" && item.stock < moveQty) {
      alert(`Error de existencias: No puedes dar salida a ${moveQty} unidades de '${item.name}', ya que solo cuentas con ${item.stock} en catálogo.`);
      return;
    }

    const calculatedStock = moveType === "Entrada" ? item.stock + moveQty : item.stock - moveQty;

    // 1. Update Catalog stock
    const updatedItems = items.map((i) => {
      if (i.id === item.id) {
        return { ...i, stock: calculatedStock };
      }
      return i;
    });

    // 2. Register double ledger detail
    const newMove: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      itemId: item.id,
      itemName: item.name,
      type: moveType,
      qty: moveQty,
      date: new Date().toISOString().split("T")[0],
      recipient: moveRecipient || "Encargado de almacén",
      reason: moveReason || "Suministro general"
    };

    onUpdateItems(updatedItems);
    onUpdateMovements([newMove, ...movements]);
    setIsAddingMovement(false);
    // Reset fields
    setMoveQty(1);
    setMoveRecipient("");
    setMoveReason("");
    alert(`Existencias actualizadas. El artículo '${item.name}' cuenta ahora con ${calculatedStock} ${item.unit}.`);
  };

  const handleAssignTool = (toolId: string) => {
    if (!assigneeName) return;

    const updatedTools = tools.map((t) => {
      if (t.id === toolId) {
        return {
          ...t,
          resguardoUser: assigneeName,
          status: assigneeName === "Ninguno" ? ("Disponible" as const) : ("Asignado" as const),
          dateAssigned: assigneeName === "Ninguno" ? undefined : new Date().toISOString().split("T")[0]
        };
      }
      return t;
    });

    onUpdateTools(updatedTools);
    setAssigningToolId(null);
    setAssigneeName("");
    alert("Resguardo de herramienta actualizado.");
  };

  // Stock alarm checker
  const lowStockItems = items.filter((i) => i.stock <= i.minStock);

  // Filters
  const filteredCatalog = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = itemCategoryFilter === "Todos" || i.category === itemCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Almacén de Materiales, Refacciones y Herramientas</h1>
          <p className="text-sm text-gray-500">
            Catálogo de existencias de climatización, salidas de obra, control de resguardos de multímetros y soldadoras.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === "tools" ? (
            <button
              onClick={() => {
                // Prepopulate
                const name = prompt("Escribe el nombre de la herramienta nueva (Ej. Soldadora Inverter 250A):");
                if (name) {
                  const lastNum = tools.length + 6000;
                  const newTool: ToolAsset = {
                    id: `HER-${lastNum + 1}`,
                    name,
                    code: `EXIM-HER-${tools.length + 1}`,
                    resguardoUser: "Ninguno",
                    status: "Disponible"
                  };
                  onUpdateTools([...tools, newTool]);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" /> Registrar Activo Fijo
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsAddingMovement(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-gray-750 hover:bg-slate-50"
              >
                <ArrowDownLeft className="h-4 w-4 text-emerald-500" /> Registrar Movimiento
              </button>
              <button
                onClick={() => setIsAddingItem(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Añadir Material
              </button>
            </>
          )}
        </div>
      </div>

      {/* Item Addition Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Añadir Insumo o Refacción al Catálogo</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nombre Comercial del Material *</label>
                <input
                  type="text"
                  placeholder="Ej. Boya Gas Genetron R-22"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Categoría</label>
                  <select
                    value={itemCat}
                    onChange={(e) => setItemCat(e.target.value as InventoryItem["category"])}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs"
                  >
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Aires Acondicionados">Aires Acondicionados</option>
                    <option value="Consumibles">Consumibles</option>
                    <option value="Tools">Herramientas</option>
                    <option value="Epps">EPP Seguridad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Unidad de Medida</label>
                  <select
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs"
                  >
                    <option value="pzs">Piezas (pzs)</option>
                    <option value="mts">Metros (mts)</option>
                    <option value="lts">Litros (lts)</option>
                    <option value="kg">Kilogramos (kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Stock Inicial *</label>
                  <input
                    type="number"
                    value={itemStock}
                    onChange={(e) => setItemStock(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    value={itemMin}
                    onChange={(e) => setItemMin(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Ubicación Estante Almacén</label>
                <input
                  type="text"
                  placeholder="Ej. Estante C-1"
                  value={itemLoc}
                  onChange={(e) => setItemLoc(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Guardar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Ledger Registration Modal */}
      {isAddingMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Registrar Entrada / Salida de Mercancías</h2>
            
            <form onSubmit={handleAddMovement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1 font-sans">Selecciona Artículo del Catálogo</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:border-blue-500 font-sans"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>{i.id} - {i.name} ({i.stock} {i.unit} disp)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tipo de Movimiento</label>
                  <select
                    value={moveType}
                    onChange={(e) => setMoveType(e.target.value as "Entrada" | "Salida")}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs font-semibold"
                  >
                    <option value="Salida">📤 Salida (Hacia Obra / OS)</option>
                    <option value="Entrada font-bold">📥 Entrada (Compra / Proveedor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Cantidad del Concepto</label>
                  <input
                    type="number"
                    min="1"
                    value={moveQty}
                    onChange={(e) => setMoveQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Técnico que Solicitó / Recibió</label>
                <input
                  type="text"
                  placeholder="Ej. Ing. Carlos Ramos / Compras Eléctricas"
                  value={moveRecipient}
                  onChange={(e) => setMoveRecipient(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Destino / Razón o Referencia de Obra</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Obra Eléctrica Bodega PEMEX OS-1001"
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingMovement(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Confirmar Ajuste Almacén
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock warning notification block if low critical items exist */}
      {lowStockItems.length > 0 && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
            <AlertOctagon className="h-5 w-5 text-rose-500 shrink-0" />
            <span>Alerta de Reorden: Los siguientes insumos se encuentran por debajo del stock mínimo</span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {lowStockItems.map((i) => (
              <span
                key={i.id}
                className="rounded-lg bg-white border border-rose-100 px-2.5 py-1 text-[11px] font-semibold text-gray-800 flex items-center gap-1"
              >
                <span className="text-rose-600 font-bold font-mono">{i.id}</span>
                <span>{i.name}</span>
                <span className="text-red-600 bg-red-50 rounded px-1.5 py-0.2 font-mono ml-1 font-bold">
                  {i.stock} {i.unit} de {i.minStock} min
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Subtabs of Almacén */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`px-4 py-2.5 text-xs font-bold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "catalog"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package className="h-4 w-4" /> Catálogo de Materiales
        </button>
        <button
          onClick={() => setActiveTab("movements")}
          className={`px-4 py-2.5 text-xs font-bold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "movements"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <History className="h-4 w-4" /> Libro de Movimientos
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`px-4 py-2.5 text-xs font-bold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "tools"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Wrench className="h-4 w-4" /> Resguardo de Herramientas
        </button>
      </div>

      {/* Catalog Render Panel */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 glass-card p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por código de insumo o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/40 bg-white/40 py-1.8 pl-9 pr-4 text-xs focus:bg-white/80 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
              {["Todos", "Eléctrico", "Aires Acondicionados", "Consumibles", "Epps"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setItemCategoryFilter(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    itemCategoryFilter === cat ? "bg-slate-900 text-white shadow-xs" : "bg-white/40 text-slate-600 hover:bg-white/70 border border-white/50"
                  }`}
                >
                  {cat === "Todos" ? "Todos los rubros" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 font-bold uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">ID Material</th>
                    <th className="px-4 py-3">Nombre comercial del Insumo</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3 text-right">Stock Disponible</th>
                    <th className="px-4 py-3 text-right">Ubicación Física</th>
                    <th className="px-4 py-3">Condición</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {filteredCatalog.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-sans">No se encontraron materiales en catálogo.</td>
                    </tr>
                  ) : (
                    filteredCatalog.map((item) => {
                      const isLow = item.stock <= item.minStock;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3.5 font-mono font-bold text-indigo-600">{item.id}</td>
                          <td className="px-4 py-3.5 font-bold text-gray-950">{item.name}</td>
                          <td className="px-4 py-3.5 text-stone-500">{item.category}</td>
                          <td className="px-4 py-3.5 text-right font-mono text-gray-900">
                            <span className={`font-bold ${isLow ? "text-rose-600" : "text-gray-800"}`}>
                              {item.stock}
                            </span>{" "}
                            {item.unit}
                          </td>
                          <td className="px-4 py-3.5 text-right text-stone-500">{item.location}</td>
                          <td className="px-4 py-3.5 font-semibold">
                            {isLow ? (
                              <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-extrabold uppercase text-rose-700">
                                Abasto Urgente
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                                Estable
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Movements Tab Render */}
      {activeTab === "movements" && (
        <div className="glass-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 font-bold uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3">Folio ID</th>
                  <th className="px-4 py-3">Concepto/Material</th>
                  <th className="px-4 py-3 text-center">Tipo</th>
                  <th className="px-4 py-3 text-right">Cant</th>
                  <th className="px-4 py-3">Responsable Técnico</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 max-w-xs">Referencia / Aplicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {movements.map((move) => (
                  <tr key={move.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3.5 font-mono text-indigo-600 font-bold">{move.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900">{move.itemName}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold uppercase text-[9px] ${
                          move.type === "Entrada" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {move.type === "Entrada" ? (
                          <ArrowDownLeft className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span>{move.type}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-900">{move.qty}</td>
                    <td className="px-4 py-3.5 font-semibold text-stone-700">{move.recipient}</td>
                    <td className="px-4 py-3.5 font-mono text-stone-400">{move.date}</td>
                    <td className="px-4 py-3.5 italic text-gray-500 max-w-xs truncate">{move.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tools assignments panel */}
      {activeTab === "tools" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="glass-card glass-card-hover p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-400">{tool.code}</span>
                  <h3 className="text-xs font-bold text-gray-900 mt-0.5">{tool.name}</h3>
                </div>
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    tool.status === "Disponible"
                      ? "bg-green-50 text-green-700"
                      : tool.status === "Mantenimiento"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {tool.status}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 block font-semibold uppercase">Resguardo de Custodia</span>
                  <span className="font-bold text-gray-800">{tool.resguardoUser}</span>
                  {tool.dateAssigned && (
                    <span className="text-[10px] text-gray-400 block mt-0.2">Desde: {tool.dateAssigned}</span>
                  )}
                </div>
              </div>

              {/* Quick Custody reassignment action */}
              <div className="pt-2 border-t border-gray-50">
                {assigningToolId === tool.id ? (
                  <div className="space-y-2">
                    <select
                      value={assigneeName}
                      onChange={(e) => setAssigneeName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-1.5 text-xs text-gray-700 focus:outline-none"
                    >
                      <option value="">Selecciona Custodio</option>
                      {techOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setAssigningToolId(null)}
                        className="rounded px-2.5 py-1 text-[10px] font-semibold text-gray-500 hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleAssignTool(tool.id)}
                        className="rounded bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-indigo-700"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAssigningToolId(tool.id);
                      setAssigneeName(tool.resguardoUser || "");
                    }}
                    className="w-full text-center py-1 rounded bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                    <span>Cambiar Custodia / Devolución</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
