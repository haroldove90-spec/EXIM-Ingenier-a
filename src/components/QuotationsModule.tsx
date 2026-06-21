import React, { useState } from "react";
import {
  FileText,
  Plus,
  RefreshCw,
  AlertTriangle,
  Send,
  Calendar,
  CheckCircle,
  HelpCircle,
  Trash2,
  ListPlus
} from "lucide-react";
import { Quotation, QuoteConcept, OrderService, Project } from "../types";

interface QuotationsProps {
  quotes: Quotation[];
  onUpdateQuotes: (quotes: Quotation[]) => void;
  orders: OrderService[];
  onUpdateOrders: (orders: OrderService[]) => void;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  clients: string[];
}

export const QuotationsModule: React.FC<QuotationsProps> = ({
  quotes,
  onUpdateQuotes,
  orders,
  onUpdateOrders,
  projects,
  onUpdateProjects,
  clients,
}) => {
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(quotes[0] || null);
  const [isAddingQuote, setIsAddingQuote] = useState(false);

  // New quote form states
  const [qClient, setQClient] = useState(clients[0] || "");
  const [qNotes, setQNotes] = useState("");
  const [qValidity, setQValidity] = useState("");
  const [concepts, setConcepts] = useState<Omit<QuoteConcept, "id">[]>([]);
  
  // Single concept adder fields
  const [conceptDesc, setConceptDesc] = useState("");
  const [conceptQty, setConceptQty] = useState(1);
  const [conceptPrice, setConceptPrice] = useState(0);
  const [conceptCat, setConceptCat] = useState<QuoteConcept["category"]>("Material");

  const addConceptToTempList = () => {
    if (!conceptDesc || conceptQty <= 0) return;
    setConcepts([
      ...concepts,
      {
        description: conceptDesc,
        qty: conceptQty,
        price: conceptPrice,
        category: conceptCat
      }
    ]);
    setConceptDesc("");
    setConceptQty(1);
    setConceptPrice(0);
  };

  const removeTempConcept = (idx: number) => {
    setConcepts(concepts.filter((_, i) => i !== idx));
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (concepts.length === 0) {
      alert("Debes agregar al menos un concepto desglosado.");
      return;
    }

    const lastNum = quotes.reduce((max, q) => {
      const num = parseInt(q.id.replace("COT-", ""), 10);
      return num > max ? num : max;
    }, 3000);

    const newId = `COT-${lastNum + 1}`;

    // Calculo de acumulados
    let mat = 0, lab = 0, trav = 0;
    const finalConcepts = concepts.map((c, i) => {
      const totalCost = c.qty * c.price;
      if (c.category === "Material") mat += totalCost;
      else if (c.category === "Mano de Obra") lab += totalCost;
      else if (c.category === "Viáticos") trav += totalCost;

      return {
        ...c,
        id: `concept-${i + 1}`,
      };
    });

    const newQuote: Quotation = {
      id: newId,
      clientName: qClient,
      dateCreated: new Date().toISOString().split("T")[0],
      validityDate: qValidity || "2026-07-01",
      status: "Enviada",
      headerNotes: qNotes,
      concepts: finalConcepts,
      costMaterials: mat,
      costLabor: lab,
      costTravel: trav,
      total: mat + lab + trav
    };

    onUpdateQuotes([newQuote, ...quotes]);
    setSelectedQuote(newQuote);
    setIsAddingQuote(false);
    // Reset
    setQNotes("");
    setQClient(clients[0] || "");
    setQValidity("");
    setConcepts([]);
  };

  // Convert Quotation to Field Service Order (OS)
  const handleConvertToOS = (quote: Quotation) => {
    if (quote.convertedTo) return;

    const lastNum = orders.reduce((max, o) => {
      const num = parseInt(o.id.replace("OS-", ""), 10);
      return num > max ? num : max;
    }, 1000);

    const newOSId = `OS-${lastNum + 1}`;
    
    // Create new order
    const newOS: OrderService = {
      id: newOSId,
      title: `Servicio derivado de COT: ${quote.id}`,
      clientName: quote.clientName,
      clientAddress: "Villahermosa, Tabasco (Dirección de Servicio)",
      date: new Date().toISOString().split("T")[0],
      assignedCrew: ["Por asignar"],
      status: "Pendiente",
      description: `${quote.headerNotes || ""}\n\nConceptos acordados:\n` + quote.concepts.map(c => `- [${c.qty} ${c.category}] ${c.description}`).join("\n")
    };

    // Update status and association in Quotation
    const updatedQuotes = quotes.map(q => {
      if (q.id === quote.id) {
        return {
          ...q,
          status: "Aprobada" as const,
          convertedTo: "OS" as const,
          convertedId: newOSId
        };
      }
      return q;
    });

    onUpdateOrders([newOS, ...orders]);
    onUpdateQuotes(updatedQuotes);
    setSelectedQuote({
      ...quote,
      status: "Aprobada",
      convertedTo: "OS",
      convertedId: newOSId
    });
    alert(`¡Conversión Exitosa! Se ha generado la Orden de Servicio ${newOSId} a partir de esta cotización.`);
  };

  // Convert Quotation to project (PRJ)
  const handleConvertToProject = (quote: Quotation) => {
    if (quote.convertedTo) return;

    const lastNum = projects.reduce((max, p) => {
      const num = parseInt(p.id.replace("PRJ-", ""), 10);
      return num > max ? num : max;
    }, 2000);

    const newProjId = `PRJ-${lastNum + 1}`;

    const startDate = new Date().toISOString().split("T")[0];
    const rawEndDate = new Date();
    rawEndDate.setDate(rawEndDate.getDate() + 30);
    const endDate = rawEndDate.toISOString().split("T")[0];

    const newProj: Project = {
      id: newProjId,
      name: `Obra derivada de COT ${quote.id}`,
      clientName: quote.clientName,
      type: quote.total > 150000 ? "Industrial" : "Comercial",
      description: quote.headerNotes || "Proyecto derivado de cotización formal.",
      startDate,
      endDate,
      costBudget: quote.total,
      costReal: 0,
      contractors: [],
      ganttPhases: [
        { id: "ph1", name: "Etapa 1: Planificación Técnica y Adquisiciones", startDate, endDate: startDate, progress: 0, status: "No Iniciado" },
        { id: "ph2", name: "Etapa 2: Tendido de Canalizaciones en Sitio", startDate, endDate, progress: 0, status: "No Iniciado" },
        { id: "ph3", name: "Etapa 3: Entrega y Certificados", startDate: endDate, endDate, progress: 0, status: "No Iniciado" }
      ]
    };

    // Update status and association in Quotation
    const updatedQuotes = quotes.map(q => {
      if (q.id === quote.id) {
        return {
          ...q,
          status: "Aprobada" as const,
          convertedTo: "Proyecto" as const,
          convertedId: newProjId
        };
      }
      return q;
    });

    onUpdateProjects([newProj, ...projects]);
    onUpdateQuotes(updatedQuotes);
    setSelectedQuote({
      ...quote,
      status: "Aprobada",
      convertedTo: "Proyecto",
      convertedId: newProjId
    });
    alert(`¡Conversión de Obra Exitosa! Se ha creado el proyecto ${newProjId} con un presupuesto asignado de $${quote.total.toLocaleString("es-MX")}.`);
  };

  const handleUpdateQuoteStatus = (id: string, status: Quotation["status"]) => {
    const updated = quotes.map((q) => {
      if (q.id === id) {
        return { ...q, status };
      }
      return q;
    });
    onUpdateQuotes(updated);
    if (selectedQuote?.id === id) {
      setSelectedQuote({ ...selectedQuote, status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cotizaciones, Presupuestos y Propuestas</h1>
          <p className="text-sm text-gray-500">
            Generación de propuestas detalladas por concepto, conversión automática de cotizaciones y alertas de precios.
          </p>
        </div>
        <button
          onClick={() => setIsAddingQuote(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Cotización</span>
        </button>
      </div>

      {/* Quote Adding Modal Overlay */}
      {isAddingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Generar Cotización Numerada</h2>
            
            <form onSubmit={handleCreateQuotation} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Cliente Solicitante *</label>
                  <select
                    value={qClient}
                    onChange={(e) => setQClient(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    {clients.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Vigencia Limite de Precios (Evita variación de materiales)</label>
                  <input
                    type="date"
                    value={qValidity}
                    onChange={(e) => setQValidity(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Notas Encabezado / Alcance Técnico</label>
                <textarea
                  rows={2}
                  placeholder="Propuesta económica para la planta de..."
                  value={qNotes}
                  onChange={(e) => setQNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Subform to add single concept */}
              <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-slate-50/50 space-y-3">
                <span className="text-xs font-bold text-gray-700 block uppercase">Agregar Concepto</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Descripción del concepto (Ej. Cableado THW Cal 10)"
                      value={conceptDesc}
                      onChange={(e) => setConceptDesc(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Cant."
                      value={conceptQty}
                      onChange={(e) => setConceptQty(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 p-2 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Precio Unit."
                      value={conceptPrice}
                      onChange={(e) => setConceptPrice(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 p-2 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <select
                      value={conceptCat}
                      onChange={(e) => setConceptCat(e.target.value as QuoteConcept["category"])}
                      className="w-full rounded-lg border border-gray-200 p-2 font-semibold text-slate-700"
                    >
                      <option value="Material">Material</option>
                      <option value="Mano de Obra">Mano de Obra</option>
                      <option value="Viáticos">Viáticos</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={addConceptToTempList}
                      className="w-full rounded-lg bg-slate-900 p-2 text-white hover:bg-slate-800 flex items-center justify-center font-bold"
                      title="Agregar concepto"
                    >
                      <ListPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Added Concepts lists preview */}
              {concepts.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 block tracking-wider uppercase mb-1">Desglose de Conceptos Registrados</span>
                  <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600 font-bold uppercase">
                        <tr>
                          <th className="px-3 py-2">Concepto</th>
                          <th className="px-3 py-2 text-right">Cant</th>
                          <th className="px-3 py-2 text-right">P. Unit</th>
                          <th className="px-3 py-2 text-right">Monto</th>
                          <th className="px-3 py-2">Clasificación</th>
                          <th className="px-3 py-2 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {concepts.map((c, i) => (
                          <tr key={i} className="text-gray-700">
                            <td className="px-3 py-2 max-w-xs truncate">{c.description}</td>
                            <td className="px-3 py-2 text-right font-mono">{c.qty}</td>
                            <td className="px-3 py-2 text-right font-mono">${c.price.toLocaleString("es-MX")}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold">${(c.qty * c.price).toLocaleString("es-MX")}</td>
                            <td className="px-3 py-2 pl-4">
                              <span className="text-[10px] rounded px-1.5 py-0.2 bg-gray-100 font-bold text-gray-600">
                                {c.category}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeTempConcept(i)}
                                className="text-rose-500 hover:text-rose-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingQuote(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Confirmar Propuesta Cotización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Quote listing */}
        <div className="space-y-3 lg:col-span-1">
          <span className="text-xs font-bold text-gray-400 uppercase block tracking-wider">Historial de Propuestas</span>
          <div className="space-y-2.5">
            {quotes.map((q) => {
              // Volatility alert checker: if validity date is earlier than 10-Jul-2026, warn potential metal/cooper/gases cost changes.
              const isNearExpiry = new Date(q.validityDate) <= new Date("2026-06-30");
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedQuote?.id === q.id
                      ? "border-emerald-500 bg-emerald-50/20 shadow-xs"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">{q.id}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        q.status === "Aprobada"
                          ? "bg-green-50 text-green-700"
                          : q.status === "Revision" || q.status === "Revisión"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 mt-2 line-clamp-1">{q.clientName}</h3>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-gray-400 font-semibold font-mono">
                    <span>${q.total.toLocaleString("es-MX")} MXN</span>
                  </div>

                  {isNearExpiry && q.status !== "Aprobada" && (
                    <div className="mt-2 flex items-center gap-1 text-[9px] text-amber-600 font-bold bg-amber-50 rounded px-1.5 py-0.5">
                      <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
                      <span>Volatilidad de costo: Próxima a expirar</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Quote Detail Area */}
        <div className="lg:col-span-2">
          {selectedQuote ? (
            <div className="glass-card p-5 space-y-6">
              {/* Quote details head */}
              <div className="flex flex-col justify-between border-b border-gray-50 pb-4 gap-3 sm:flex-row sm:items-center">
                <div>
                  <span className="text-xs font-bold text-indigo-600 font-mono">Folio Oficial: {selectedQuote.id}</span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedQuote.clientName}</p>
                  <span className="text-[10px] text-gray-400 font-medium">Creado: {selectedQuote.dateCreated}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleUpdateQuoteStatus(selectedQuote.id, e.target.value as Quotation["status"])}
                    className="rounded-lg border border-gray-200 bg-slate-50 p-1.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="Enviada">Enviada al Cliente</option>
                    <option value="Revisión">En Revisión técnica</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Rechazada">Rechazada</option>
                  </select>
                </div>
              </div>

              {/* Alert de vigencia y volatilidad */}
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 flex gap-3 text-xs text-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold">Advertencia de Caducidad de Precios</span>
                  <p className="mt-0.5 text-[11px] text-amber-700">
                    Vigente hasta el <strong className="font-mono">{selectedQuote.validityDate}</strong>. Debido a fluctuaciones drásticas en cobre, cobre galvanizado y consumibles de climatización en Villahermosa, se recomienda no autorizar conversiones pasada esta fecha sin re-cotizar.
                  </p>
                </div>
              </div>

              {/* Quote Concepts Table */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Presupuesto Desglosado</span>
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 font-semibold text-gray-600 uppercase">
                      <tr>
                        <th className="px-3 py-2.5">Concepto / Partida</th>
                        <th className="px-3 py-2.5 text-right">Cant</th>
                        <th className="px-3 py-2.5 text-right">Unitario</th>
                        <th className="px-3 py-2.5 text-right">Total</th>
                        <th className="px-3 py-2.5">Insumo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {selectedQuote.concepts.map((concept) => (
                        <tr key={concept.id} className="hover:bg-slate-50/40">
                          <td className="px-3 py-3 font-semibold text-gray-900">{concept.description}</td>
                          <td className="px-3 py-3 text-right font-mono">{concept.qty}</td>
                          <td className="px-3 py-3 text-right font-mono">${concept.price.toLocaleString("es-MX")}</td>
                          <td className="px-3 py-3 text-right font-mono font-bold">${(concept.qty * concept.price).toLocaleString("es-MX")}</td>
                          <td className="px-3 py-3 pl-4">
                            <span className="text-[10px] rounded px-1.5 py-0.2 bg-slate-100 text-slate-700 font-semibold">
                              {concept.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category sums split */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 font-mono text-xs">
                <div className="rounded-lg bg-gray-50 p-3 text-center border border-gray-100">
                  <span className="text-[10px] text-gray-400 block uppercase font-sans font-semibold">Materiales</span>
                  <span className="text-gray-800 font-bold">${selectedQuote.costMaterials.toLocaleString("es-MX")}</span>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center border border-gray-100">
                  <span className="text-[10px] text-gray-400 block uppercase font-sans font-semibold">Mano de Obra</span>
                  <span className="text-gray-800 font-bold">${selectedQuote.costLabor.toLocaleString("es-MX")}</span>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center border border-gray-100">
                  <span className="text-[10px] text-gray-400 block uppercase font-sans font-semibold">Viáticos / Campo</span>
                  <span className="text-gray-800 font-bold">${selectedQuote.costTravel.toLocaleString("es-MX")}</span>
                </div>
                <div className="rounded-lg bg-slate-900 p-3 text-center text-white">
                  <span className="text-[10px] text-slate-300 block uppercase font-sans font-semibold">Importe Total</span>
                  <span className="text-sm font-extrabold">${selectedQuote.total.toLocaleString("es-MX")}</span>
                </div>
              </div>

              {/* Conversion Actions Block */}
              <div className="border-t border-gray-100 pt-5 space-y-3 bg-slate-50/50 rounded-xl p-4 border">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <RefreshCw className="h-4 w-4 text-purple-600 animate-spin-slow" />
                  <span>Conversión Directa Automática</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Transforma esta propuesta económica aprobada en una orden de trabajo de campo o un proyecto civil con un solo clic.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedQuote.convertedTo ? (
                    <div className="flex-1 rounded-lg bg-emerald-50 border border-emerald-100 p-2 text-center text-xs font-bold text-emerald-700">
                      Convertida con éxito a {selectedQuote.convertedTo === "OS" ? "Orden de Servicio" : "Proyecto"}: {selectedQuote.convertedId}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleConvertToOS(selectedQuote)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 border border-slate-300 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Convertir a Orden de Servicio</span>
                      </button>
                      <button
                        onClick={() => handleConvertToProject(selectedQuote)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Convertir en Obra / Proyecto Activo</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-400">
              <FileText className="h-10 w-10 text-slate-300 mx-auto animate-pulse-slow" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">Detalles de la Propuesta</p>
              <p className="text-xs text-gray-400 mt-1">Sube la primera cotización para desglosar viáticos y poder convertir.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
