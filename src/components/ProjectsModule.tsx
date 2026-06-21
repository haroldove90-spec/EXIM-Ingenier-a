import React, { useState } from "react";
import {
  Users,
  Plus,
  TrendingDown,
  TrendingUp,
  FolderLock,
  ChevronDown,
  Calendar,
  AlertCircle,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import { Project, GanttPhase } from "../types";

interface ProjectsProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  clients: string[];
}

export const ProjectsModule: React.FC<ProjectsProps> = ({
  projects,
  onUpdateProjects,
  clients,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newClient, setNewClient] = useState(clients[0] || "");
  const [newType, setNewType] = useState<Project["type"]>("Industrial");
  const [newDesc, setNewDesc] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newBudget, setNewBudget] = useState(0);
  const [newContractorText, setNewContractorText] = useState("");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newStart || !newEnd) return;

    const lastNum = projects.reduce((max, p) => {
      const num = parseInt(p.id.replace("PRJ-", ""), 10);
      return num > max ? num : max;
    }, 2000);

    const newId = `PRJ-${lastNum + 1}`;
    
    // Split contractors
    const contractorsList = newContractorText
      ? newContractorText.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    // Prepopulate generic Gantt stages based on standard works
    const defaultPhases: GanttPhase[] = [
      { id: "p1", name: "Levantamiento e Ingeniería de Detalle", startDate: newStart, endDate: newStart, progress: 100, status: "Completado" },
      { id: "p2", name: "Etapa de Canalización y Preparación", startDate: newStart, endDate: newEnd, progress: 15, status: "En Proceso" },
      { id: "p3", name: "Tendido de conductores / Equipamiento", startDate: newEnd, endDate: newEnd, progress: 0, status: "No Iniciado" },
      { id: "p4", name: "Pruebas Generales y Acta Entrega", startDate: newEnd, endDate: newEnd, progress: 0, status: "No Iniciado" }
    ];

    const newProject: Project = {
      id: newId,
      name: newName,
      clientName: newClient,
      type: newType,
      description: newDesc,
      startDate: newStart,
      endDate: newEnd,
      costBudget: Number(newBudget) || 0,
      costReal: 0,
      contractors: contractorsList,
      ganttPhases: defaultPhases,
    };

    const updatedList = [newProject, ...projects];
    onUpdateProjects(updatedList);
    setSelectedProject(newProject);
    setIsAddingProject(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName("");
    setNewClient(clients[0] || "");
    setNewType("Industrial");
    setNewDesc("");
    setNewStart("");
    setNewEnd("");
    setNewBudget(0);
    setNewContractorText("");
  };

  const handleUpdatePhaseProgress = (phaseId: string, progress: number) => {
    if (!selectedProject) return;

    const updatedPhases = selectedProject.ganttPhases.map((phase) => {
      if (phase.id === phaseId) {
        let status: GanttPhase["status"] = "No Iniciado";
        if (progress === 100) status = "Completado";
        else if (progress > 0) status = "En Proceso";
        return { ...phase, progress, status };
      }
      return phase;
    });

    const updatedProj = { ...selectedProject, ganttPhases: updatedPhases };
    const updatedList = projects.map((p) => (p.id === selectedProject.id ? updatedProj : p));
    
    onUpdateProjects(updatedList);
    setSelectedProject(updatedProj);
  };

  const handleUpdateRealCost = (amount: number) => {
    if (!selectedProject) return;
    const updatedProj = { ...selectedProject, costReal: Number(amount) || 0 };
    const updatedList = projects.map((p) => (p.id === selectedProject.id ? updatedProj : p));
    onUpdateProjects(updatedList);
    setSelectedProject(updatedProj);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestión de Proyectos de Obras y Climatización</h1>
          <p className="text-sm text-gray-500">
            Control de etapas por cronograma Gantt, presupuestos vs costo real y asignación de contratistas.
          </p>
        </div>
        <button
          onClick={() => setIsAddingProject(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Obra / Proyecto</span>
        </button>
      </div>

      {/* Project Adding Modal overlay */}
      {isAddingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nueva Obra o Proyecto de Diseño</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nombre del Proyecto *</label>
                <input
                  type="text"
                  placeholder="Ej. Obra Eléctrica Trifásica Bodegas Pemex"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Clasificación Mercado</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Project["type"])}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Industrial">🚫 Industrial (Alta Tensión / Plantas)</option>
                    <option value="Comercial">🏢 Comercial (VRF / Locales)</option>
                    <option value="Residencial">🏡 Residencial (Campestre / Climas)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha de Inicio *</label>
                  <input
                    type="date"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha Límite Entrega *</label>
                  <input
                    type="date"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Presupuesto Inicial ($ MXN)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Contratistas (Separados por Coma)</label>
                  <input
                    type="text"
                    placeholder="Ej. Grupo Tabasco, Martínez Destajistas"
                    value={newContractorText}
                    onChange={(e) => setNewContractorText(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Descripción de Alcances y Obras</label>
                <textarea
                  rows={3}
                  placeholder="Detalla alcances del diseño original o memorias de cálculo..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Registrar Obra Nueva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Structural Grid split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Hand Project Selector */}
        <div className="space-y-3.5 lg:col-span-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Portafolio de Obras</span>
          <div className="space-y-2.5">
            {projects.map((p) => {
              const profit = p.costBudget - p.costReal;
              const margin = p.costBudget > 0 ? Math.round((profit / p.costBudget) * 100) : 0;
              const isOverBudget = p.costReal > p.costBudget;
              
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`w-full text-left rounded-xl p-4 transition-all border ${
                    selectedProject?.id === p.id
                      ? "border-amber-500 bg-amber-500/10 shadow-xs"
                      : "border-white/40 bg-white/60 hover:bg-white/80 hover:border-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gray-500">{p.id}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        p.type === "Industrial"
                          ? "bg-rose-50 text-rose-700"
                          : p.type === "Comercial"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {p.type}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 mt-2 line-clamp-1">{p.name}</h3>
                  <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">{p.clientName}</p>

                  <div className="mt-3.5 flex justify-between items-center text-[10px] border-t border-gray-50 pt-2 text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" /> {p.endDate}
                    </span>
                    <span className={`font-semibold ${isOverBudget ? "text-rose-600" : "text-emerald-600"}`}>
                      {isOverBudget ? "Sobre Presupuesto" : `M: ${margin}% u`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Gantt Chart and Detailed Cost Sheet */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProject ? (
            <div className="glass-card p-5 space-y-6">
              {/* Project Head Section */}
              <div className="flex flex-col justify-between border-b border-gray-50 pb-4 gap-2 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 font-mono">{selectedProject.id}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 rounded-full px-2 py-0.2 font-semibold">
                      Mercado {selectedProject.type}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mt-1">{selectedProject.name}</h2>
                  <p className="text-xs text-gray-400 font-medium">{selectedProject.clientName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Periodo de Obra</span>
                  <span className="text-xs font-bold text-gray-800">
                    {selectedProject.startDate} al {selectedProject.endDate}
                  </span>
                </div>
              </div>

              {/* Cost Control block */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider text-gray-400">
                  Control Financiero de la Obra (Presupuestado vs Real)
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Monto Presupuestado</span>
                    <span className="text-base font-extrabold text-blue-700 font-mono">
                      ${selectedProject.costBudget.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Costo Real Acumulado</span>
                    <input
                      type="number"
                      value={selectedProject.costReal}
                      onChange={(e) => handleUpdateRealCost(Number(e.target.value))}
                      className="w-full text-base font-extrabold text-gray-800 font-mono bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className={`rounded-lg p-4 border ${
                    selectedProject.costReal > selectedProject.costBudget
                      ? "bg-rose-50 border-rose-100 text-rose-800"
                      : "bg-emerald-50 border-emerald-100 text-emerald-800"
                  }`}>
                    <span className="text-[10px] font-bold block uppercase">Diferencia Utilidad</span>
                    <div className="flex items-center gap-1">
                      {selectedProject.costReal > selectedProject.costBudget ? (
                        <TrendingUp className="h-4 w-4 text-rose-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                      )}
                      <span className="text-base font-extrabold font-mono">
                        ${(selectedProject.costBudget - selectedProject.costReal).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar of standard Budget */}
                {selectedProject.costBudget > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-bold">
                      <span>Presupuesto Consumido</span>
                      <span className={selectedProject.costReal > selectedProject.costBudget ? "text-rose-600" : "text-emerald-600"}>
                        {Math.round((selectedProject.costReal / selectedProject.costBudget) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          selectedProject.costReal > selectedProject.costBudget ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min((selectedProject.costReal / selectedProject.costBudget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Gantt / Cronograma Diagram */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-gray-400">
                    Cronograma de Etapas e Hitos (Gantt)
                  </h3>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" /> Desliza para actualizar avance
                  </span>
                </div>

                <div className="space-y-4 rounded-xl border border-gray-100 p-4 bg-slate-50/50">
                  {selectedProject.ganttPhases.map((phase) => (
                    <div key={phase.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                      {/* Phase Name */}
                      <div className="md:col-span-4">
                        <span className="font-semibold text-gray-800 line-clamp-2">{phase.name}</span>
                        <div className="text-[10px] text-gray-400">
                          {phase.startDate} al {phase.endDate}
                        </div>
                      </div>

                      {/* Timeline bar / percentage drag */}
                      <div className="md:col-span-5 flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={phase.progress}
                          onChange={(e) => handleUpdatePhaseProgress(phase.id, parseInt(e.target.value, 10))}
                          className="w-full accent-emerald-500 cursor-ew-resize h-1.5 bg-gray-200 rounded-lg appearance-auto"
                        />
                        <span className="font-mono text-semibold w-10 text-right text-gray-700">
                          {phase.progress}%
                        </span>
                      </div>

                      {/* Status indicator badge */}
                      <div className="md:col-span-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            phase.status === "Completado"
                              ? "bg-green-50 text-green-700"
                              : phase.status === "En Proceso"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {phase.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contractors Block */}
              <div className="border-t border-gray-50 pt-4">
                <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>Contratistas y Destajistas Asignados</span>
                </h3>
                {selectedProject.contractors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.contractors.map((cont, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                      >
                        {cont}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">No hay subcontratistas externos o destajistas asociados temporalmente.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400 shadow-xs">
              <FolderLock className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">Detalle de Proyecto</p>
              <p className="text-xs text-gray-400 mt-1">Registra la primera obra para visualizar el Gantt e ingresos de obra.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
