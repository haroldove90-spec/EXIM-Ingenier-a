import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Clock,
  Camera,
  Check,
  User,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  PenTool,
  RotateCcw
} from "lucide-react";
import { OrderService } from "../types";

interface FSMModuleProps {
  orders: OrderService[];
  onUpdateOrders: (orders: OrderService[]) => void;
  clients: string[];
}

export const FSMModule: React.FC<FSMModuleProps> = ({
  orders,
  onUpdateOrders,
  clients,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [selectedOrder, setSelectedOrder] = useState<OrderService | null>(null);
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  // New Order Form state
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState(clients[0] || "");
  const [newAddress, setNewAddress] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCrew, setNewCrew] = useState<string[]>([]);
  const [newDesc, setNewDesc] = useState("");

  const techOptions = [
    "Ing. Carlos Ramos",
    "Téc. Roberto Izquierdo",
    "Téc. Samuel Priego",
    "Aux. Juan Chablé"
  ];

  // Signature Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signerName, setSignerName] = useState("");

  // Calendar view state
  const [currentMonth, setCurrentMonth] = useState(new Date("2026-06-01"));

  // Start Drawing for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedOrder) return;
    // Real base64 url
    const dataUrl = canvas.toDataURL();
    
    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          signature: dataUrl,
          signatureName: signerName || "Cliente Conforme",
          signatureDate: new Date().toISOString().split("T")[0],
          status: "Finalizado" as const
        };
      }
      return o;
    });
    
    onUpdateOrders(updated);
    setSelectedOrder({
      ...selectedOrder,
      signature: dataUrl,
      signatureName: signerName || "Cliente Conforme",
      signatureDate: new Date().toISOString().split("T")[0],
      status: "Finalizado"
    });
    alert("Firma guardada correctamente. Estatus de orden actualizado a Finalizado.");
  };

  // Crew helpers
  const handleToggleTech = (tech: string) => {
    if (newCrew.includes(tech)) {
      setNewCrew(newCrew.filter(t => t !== tech));
    } else {
      setNewCrew([...newCrew, tech]);
    }
  };

  // Add work order
  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    // Numerical sequential generator OS-xxxx
    const lastNum = orders.reduce((max, o) => {
      const num = parseInt(o.id.replace("OS-", ""), 10);
      return num > max ? num : max;
    }, 1000);

    const newId = `OS-${lastNum + 1}`;
    const newOrder: OrderService = {
      id: newId,
      title: newTitle,
      clientName: newClient,
      clientAddress: newAddress || "S/N Dirección registrada",
      date: newDate,
      assignedCrew: newCrew.length > 0 ? newCrew : ["Por asignar"],
      status: "Pendiente",
      description: newDesc
    };

    onUpdateOrders([newOrder, ...orders]);
    setIsAddingOrder(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle("");
    setNewClient(clients[0] || "");
    setNewAddress("");
    setNewDate("");
    setNewCrew([]);
    setNewDesc("");
  };

  // Quick photo upload mock (before/after)
  const handlePhotoUpload = (field: "photoBefore" | "photoAfter") => {
    const mockPhotos = {
      photoBefore: [
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400"
      ],
      photoAfter: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400"
      ]
    };
    const randomUrl = mockPhotos[field][Math.floor(Math.random() * 2)];
    
    if (selectedOrder) {
      const updated = orders.map((o) => {
        if (o.id === selectedOrder.id) {
          return { ...o, [field]: randomUrl };
        }
        return o;
      });
      onUpdateOrders(updated);
      setSelectedOrder({ ...selectedOrder, [field]: randomUrl });
    }
  };

  const handleUpdateNotes = (notes: string) => {
    if (selectedOrder) {
      const updated = orders.map((o) => {
        if (o.id === selectedOrder.id) {
          return { ...o, technicalNotes: notes };
        }
        return o;
      });
      onUpdateOrders(updated);
      setSelectedOrder({ ...selectedOrder, technicalNotes: notes });
    }
  };

  const handleUpdateStatus = (status: OrderService["status"]) => {
    if (selectedOrder) {
      const updated = orders.map((o) => {
        if (o.id === selectedOrder.id) {
          return { ...o, status };
        }
        return o;
      });
      onUpdateOrders(updated);
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  // Calendar days generation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Padding for empty blocks before first day
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const calendarDays = getDaysInMonth(currentMonth);
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Todas" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Órdenes de Servicio en Campo (FSM)</h1>
          <p className="text-sm text-gray-500">
            Control de cuadrillas, reportes técnicos, evidencias fotográficas y firmas de conformidad.
          </p>
        </div>
        <button
          onClick={() => setIsAddingOrder(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Orden de Servicio</span>
        </button>
      </div>

      {/* Adding Order Form Modal / overlay */}
      {isAddingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Crear Orden de Servicio Sequencial</h2>
            <form onSubmit={handleAddOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Título del Trabajo *</label>
                <input
                  type="text"
                  placeholder="Ej. Cambio de baleros extractor #2 / Reparación Clima"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Cliente *</label>
                  <select
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {clients.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha programada *</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Dirección exacta</label>
                <input
                  type="text"
                  placeholder="Dirección del servicio"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Descripción del problema</label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre lo reportado por el cliente..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Asignar Cuadrilla / Técnicos</label>
                <div className="grid grid-cols-2 gap-2">
                  {techOptions.map((tech) => (
                    <label
                      key={tech}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                        newCrew.includes(tech)
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "border-gray-100 bg-gray-50/50 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newCrew.includes(tech)}
                        onChange={() => handleToggleTech(tech)}
                        className="hidden"
                      />
                      <span>{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingOrder(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Registrar OS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Operations Split View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/Middle Column: Lists and Filters */}
        <div className="space-y-4 lg:col-span-2">
          {/* Quick Filters */}
          <div className="flex flex-col gap-3 glass-card p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por OS, cliente o concepto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/40 bg-white/40 py-1.8 pl-9 pr-4 text-xs focus:bg-white/80 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
              {["Todas", "Pendiente", "En Proceso", "Pausado por Material", "Finalizado"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    statusFilter === status
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white/40 text-slate-600 hover:bg-white/70 border border-white/50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table / List layout */}
          <div className="glass-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                  <tr>
                    <th className="px-4 py-3.5">Código OS</th>
                    <th className="px-4 py-3.5">Título / Detalle</th>
                    <th className="px-4 py-3.5">Cliente</th>
                    <th className="px-4 py-3.5">Estatus</th>
                    <th className="px-4 py-3.5">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm text-slate-400">
                        No se encontraron órdenes de servicio.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50/50 ${
                          selectedOrder?.id === o.id ? "bg-blue-50/40 font-semibold text-slate-950" : ""
                        }`}
                      >
                        <td className="px-4 py-4 font-mono font-extrabold text-blue-600">{o.id}</td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-slate-900 line-clamp-1">{o.title}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>{o.assignedCrew.join(", ")}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-700 max-w-xs truncate">{o.clientName}</td>
                        <td className="px-4 py-4 text-xs">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                              o.status === "Finalizado"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : o.status === "En Proceso"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : o.status === "Pausado por Material"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-mono text-slate-500">{o.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agenda y Calendario de Citas */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Agenda y Calendario de Citas</h3>
                <p className="text-xs text-gray-400 font-medium">Programación de técnicos y evitar empalmes en Villahermosa</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="rounded bg-gray-50 p-1 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-bold text-gray-800 uppercase">
                  {currentMonth.toLocaleString("es-MX", { month: "long", year: "numeric" })}
                </span>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="rounded bg-gray-50 p-1 hover:bg-gray-100"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {weekDays.map((day) => (
                <div key={day} className="py-1 font-semibold text-gray-400">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="py-2.5" />;
                const dateString = day.toISOString().split("T")[0];
                const daysOrders = orders.filter((o) => o.date === dateString);
                const hasOrders = daysOrders.length > 0;
                
                return (
                  <div
                    key={dateString}
                    className={`relative rounded-lg py-2 cursor-pointer transition-colors hover:bg-blue-50/40 ${
                      hasOrders ? "bg-indigo-50/50 font-bold text-indigo-700" : "text-gray-700"
                    }`}
                    title={hasOrders ? daysOrders.map(o => `${o.id}: ${o.title}`).join(", ") : "Sin visitas"}
                  >
                    <span>{day.getDate()}</span>
                    {hasOrders && (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-gray-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-indigo-200" />
              <span>Visita Técnica Agendada</span>
            </div>
          </div>
        </div>

        {/* Right Column: Work Order Details Area */}
        <div className="glass-card p-5">
          {selectedOrder ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600">{selectedOrder.id}</span>
                  <h2 className="text-sm font-bold text-gray-900 mt-1">{selectedOrder.title}</h2>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(e.target.value as OrderService["status"])}
                  className="rounded-lg border border-gray-200 bg-slate-50 p-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Pausado por Material">Pausado</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>

              {/* Order Metadata */}
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium text-gray-400 block uppercase tracking-wider text-[10px]">Cliente</span>
                  <span className="font-semibold text-gray-900">{selectedOrder.clientName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400 block uppercase tracking-wider text-[10px]">Lugar / Sitio</span>
                  <span className="font-semibold text-gray-900">{selectedOrder.clientAddress}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400 block uppercase tracking-wider text-[10px]">Técnicos de Guardia</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.assignedCrew.join(", ")}</span>
                </div>
              </div>

              {/* Technical Description */}
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100">
                <span className="font-bold text-gray-800 block mb-1">Descripción Inicial:</span>
                <p>{selectedOrder.description}</p>
              </div>

              {/* Photo Evidence & Upload */}
              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-800 block mb-2">Evidencia Fotográfica</span>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex flex-col items-center justify-center text-center p-2">
                    {selectedOrder.photoBefore ? (
                      <img src={selectedOrder.photoBefore} alt="Antes" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload("photoBefore")}
                        className="text-[10px] font-semibold text-gray-400 flex flex-col items-center gap-1 hover:text-blue-500"
                      >
                        <Camera className="h-5 w-5 text-gray-400" />
                        <span>Subir Foto Antes</span>
                      </button>
                    )}
                    <span className="absolute bottom-1 left-1.5 rounded bg-black/60 px-1 py-0.5 text-[8px] text-white font-semibold uppercase tracking-wider">
                      Antes
                    </span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex flex-col items-center justify-center text-center p-2">
                    {selectedOrder.photoAfter ? (
                      <img src={selectedOrder.photoAfter} alt="Después" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <button
                        disabled={selectedOrder.status !== "En Proceso" && selectedOrder.status !== "Pausado por Material"}
                        onClick={() => handlePhotoUpload("photoAfter")}
                        className="text-[10px] font-semibold text-gray-400 flex flex-col items-center gap-1 disabled:opacity-50 hover:text-blue-500"
                      >
                        <Camera className="h-5 w-5 text-gray-400" />
                        <span>Subir Foto Después</span>
                      </button>
                    )}
                    <span className="absolute bottom-1 left-1.5 rounded bg-black/60 px-1 py-0.5 text-[8px] text-white font-semibold uppercase tracking-wider">
                      Después
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Notes Field */}
              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-800 block mb-1">Notas Técnicas del Reporte</span>
                <textarea
                  rows={3}
                  value={selectedOrder.technicalNotes || ""}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  placeholder="Escribe el diagnóstico final, materiales ocupados, etc..."
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-slate-400 focus:outline-none"
                />
              </div>

              {/* Digital Signature conformity */}
              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-800 block mb-2">Firma Digital del Cliente / Supervisor</span>
                
                {selectedOrder.signature ? (
                  <div className="rounded-lg bg-green-50/50 p-2.5 border border-green-100 text-center flex flex-col items-center justify-center">
                    <FileCheck className="h-7 w-7 text-green-600 mb-1" />
                    <span className="text-[11px] text-green-700 font-bold">Servicio firmado de conformidad</span>
                    <span className="text-[10px] text-gray-400 mt-1">Por: {selectedOrder.signatureName}</span>
                    <span className="text-[9px] text-gray-400">Fecha: {selectedOrder.signatureDate}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre del supervisor/cliente"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-2">
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        width={280}
                        height={100}
                        className="w-full h-24 bg-white rounded border border-gray-100 cursor-crosshair touch-none"
                        title="Dibuja tu firma con el ratón o el dedo"
                      />
                      <div className="mt-2 flex justify-between items-center px-1 text-[10px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><PenTool className="h-3 w-3" /> Firma aquí</span>
                        <div className="flex gap-2">
                          <button
                            onClick={clearSignature}
                            className="flex items-center gap-1 text-rose-500 hover:text-rose-600"
                          >
                            <RotateCcw className="h-3 w-3" /> Limpiar
                          </button>
                          <button
                            onClick={saveSignature}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-extrabold"
                          >
                            <Check className="h-3 w-3" /> Aceptar Firma
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Clock className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Detalles del Servicio</p>
              <p className="text-[11px] text-gray-400 mt-1">Selecciona una orden de servicio de la lista para ver, capturar evidencia o registrar firmas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
