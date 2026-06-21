import React, { useState } from "react";
import {
  Users2,
  Plus,
  Phone,
  Mail,
  Locate,
  History,
  FileCheck2,
  FolderOpen,
  MapPin,
  Building,
  Briefcase
} from "lucide-react";
import { Client, Provider, OrderService, Project, Quotation } from "../types";

interface ContactsProps {
  clients: Client[];
  onUpdateClients: (clients: Client[]) => void;
  providers: Provider[];
  onUpdateProviders: (providers: Provider[]) => void;
  orders: OrderService[];
  projects: Project[];
  quotes: Quotation[];
}

export const ContactsModule: React.FC<ContactsProps> = ({
  clients,
  onUpdateClients,
  providers,
  onUpdateProviders,
  orders,
  projects,
  quotes,
}) => {
  const [activeTab, setActiveTabTab] = useState<"clients" | "providers">("clients");
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(providers[0] || null);
  
  // Adding forms states
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientRfc, setClientRfc] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cRole, setCRole] = useState("");

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    const newId = `CLI-${clients.length + 101}`;
    const newClient: Client = {
      id: newId,
      name: clientName,
      rfc: clientRfc || "XAXX010101000",
      fiscalAddress: clientAddress || "Villahermosa, Tabasco",
      contacts: cName ? [{ name: cName, phone: cPhone, email: cEmail, role: cRole }] : [],
      serviceAddresses: [{ name: "Sede Principal", address: clientAddress || "Villahermosa, Tabasco" }]
    };

    onUpdateClients([...clients, newClient]);
    setSelectedClient(newClient);
    setIsAddingContact(false);
    // Reset Form
    setClientName("");
    setClientRfc("");
    setClientAddress("");
    setCName("");
    setCPhone("");
    setCEmail("");
  };

  // Filter linked documents for this client
  const clientOrders = selectedClient
    ? orders.filter((o) => o.clientName === selectedClient.name)
    : [];

  const clientProjects = selectedClient
    ? projects.filter((p) => p.clientName === selectedClient.name)
    : [];

  const clientQuotes = selectedClient
    ? quotes.filter((q) => q.clientName === selectedClient.name)
    : [];

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Directorio CRM: Clientes y Proveedores</h1>
          <p className="text-sm text-gray-500">
            Ficha fiscal, múltiples sucursales de servicio, contactos clave e historial unificado de órdenes/proyectos.
          </p>
        </div>

        <button
          onClick={() => {
            if (activeTab === "providers") {
              const name = prompt("Nombre del Proveedor:");
              if (name) {
                const newProv: Provider = {
                  id: `PROV-${providers.length + 301}`,
                  name,
                  category: prompt("Categoría / Insumos que provee:") || "Material Eléctrico",
                  rfc: prompt("RFC Fiscal:") || "XAXX010101000",
                  phone: prompt("Teléfono:") || "993 310 0000",
                  email: prompt("E-mail:") || "proveedor@exim.com",
                  address: "Villahermosa, Tabasco"
                };
                onUpdateProviders([...providers, newProv]);
                setSelectedProvider(newProv);
              }
            } else {
              setIsAddingContact(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar {activeTab === "clients" ? "Nuevo Cliente" : "Nuevo Proveedor"}</span>
        </button>
      </div>

      {/* Add Client Modal */}
      {isAddingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-sans">Registrar Nuevo Cliente FSM</h2>
            
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Razón Social / Nombre *</label>
                  <input
                    type="text"
                    placeholder="Corporación, Comercio o Particular"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">RFC Fiscal</label>
                  <input
                    type="text"
                    placeholder="RFC de 12 o 13 caracteres"
                    value={clientRfc}
                    onChange={(e) => setClientRfc(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Domicilio Fiscal</label>
                <input
                  type="text"
                  placeholder="Calle, Número, Colonia, C.P. en Villahermosa"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5"
                />
              </div>

              {/* Subcontact field */}
              <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-slate-50/40 space-y-3">
                <span className="text-xs font-bold text-gray-700 block uppercase">Contacto Principal de Enlace</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre del Contacto"
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      className="w-full rounded-lg border border-gray-100 bg-white p-2"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Puesto / Rol (Ej. Compras)"
                      value={cRole}
                      onChange={(e) => setCRole(e.target.value)}
                      className="w-full rounded-lg border border-gray-100 bg-white p-2"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Celular / Teléfono"
                      value={cPhone}
                      onChange={(e) => setCPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-100 bg-white p-2"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-100 bg-white p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingContact(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Registrar Ficha Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selector Subtabs */}
      <div className="flex border-b border-gray-105">
        <button
          onClick={() => setActiveTabTab("clients")}
          className={`px-5 py-3 text-sm font-extrabold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "clients"
              ? "border-b-2 border-indigo-600 text-indigo-700"
              : "text-slate-550 hover:text-slate-900"
          }`}
        >
          <Users2 className="h-5 w-5" /> Directorio de Clientes (CRM)
        </button>
        <button
          onClick={() => setActiveTabTab("providers")}
          className={`px-5 py-3 text-sm font-extrabold -mb-px flex items-center gap-1.5 cursor-pointer ${
            activeTab === "providers"
              ? "border-b-2 border-indigo-600 text-indigo-700"
              : "text-slate-550 hover:text-slate-900"
          }`}
        >
          <Building className="h-5 w-5" /> Base de Datos de Proveedores
        </button>
      </div>

      {/* Main split view blocks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Directory search links */}
        <div className="space-y-3.5 lg:col-span-1">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
            {activeTab === "clients" ? "Fichas de Clientes" : "Distribución y Proveeduría"}
          </span>

          <div className="space-y-2.5">
            {activeTab === "clients"
              ? clients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedClient?.id === c.id
                        ? "border-blue-500 bg-blue-50/20 shadow-xs"
                        : "border-gray-105 bg-white hover:border-gray-250"
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-slate-400 block">{c.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{c.name}</h3>
                    <p className="text-xs text-slate-500 font-bold truncate mt-1">{c.fiscalAddress}</p>
                    {c.contacts.length > 0 && (
                      <span className="text-xs text-indigo-700 mt-2 block font-extrabold bg-indigo-50 border border-indigo-100 rounded px-2.5 py-0.5 w-fit">
                        Enlace: {c.contacts[0].name}
                      </span>
                    )}
                  </button>
                ))
              : providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedProvider?.id === p.id
                        ? "border-indigo-500 bg-indigo-50/20 shadow-xs"
                        : "border-gray-105 bg-white hover:border-gray-250"
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-slate-400 block">{p.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{p.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-700 font-extrabold px-2 py-0.5 rounded border border-slate-205 mt-2 inline-block">
                      {p.category}
                    </span>
                  </button>
                ))}
          </div>
        </div>

        {/* Right Side: Contact info profile + full histories */}
        <div className="lg:col-span-2">
          {activeTab === "clients" && selectedClient ? (
            <div className="glass-card p-5 space-y-6">
              {/* Header profile info */}
              <div className="border-b border-slate-100 pb-4">
                <span className="font-mono text-sm font-bold text-blue-600 block">{selectedClient.id}</span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedClient.name}</h2>
                <div className="mt-2 text-sm text-slate-550 font-sans font-semibold">
                  <span className="font-bold text-slate-700 font-sans">RFC:</span>{" "}
                  <span className="font-mono">{selectedClient.rfc}</span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  <span className="font-bold text-slate-705">Fiscal address:</span> {selectedClient.fiscalAddress}
                </div>
              </div>

              {/* Linked contacts info list */}
              <div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Contactos Clave de Enlace
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {selectedClient.contacts.map((contact, idx) => (
                    <div key={idx} className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2 text-sm">
                      <div>
                        <span className="font-bold text-slate-900 block">{contact.name}</span>
                        <span className="text-xs text-indigo-700 font-extrabold uppercase">{contact.role}</span>
                      </div>
                      <div className="space-y-1 text-slate-650 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multiple sites/service locations list */}
              <div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Múltiples Direcciones de Servicio Registradas
                </span>
                <div className="space-y-2 text-sm">
                  {selectedClient.serviceAddresses.map((addr, idx) => (
                    <div key={idx} className="rounded-lg p-3.5 bg-indigo-50/30 border border-indigo-150 flex items-start gap-2.5">
                      <MapPin className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 font-bold block text-sm">{addr.name}</strong>
                        <span className="text-slate-600 font-medium">{addr.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unified Client Historic Log */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <span className="text-sm font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                  Bitácora de Historial del Cliente (FSM + Licitaciones)
                </span>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Past quotes stats */}
                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 mb-2">
                      <FileCheck2 className="h-4 w-4 text-emerald-600" />
                      <span>Cotizaciones pasadas</span>
                    </div>
                    {clientQuotes.length > 0 ? (
                      <div className="space-y-1 text-xs">
                        {clientQuotes.map((q) => (
                          <div key={q.id} className="flex justify-between font-bold">
                            <span className="font-mono text-slate-500">{q.id}</span>
                            <span className="font-mono text-slate-800">${q.total.toLocaleString("es-MX")}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No hay propuestas previas</span>
                    )}
                  </div>

                  {/* Active Projects stats */}
                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 mb-2">
                      <FolderOpen className="h-4 w-4 text-amber-600" />
                      <span>Obras y Proyectos</span>
                    </div>
                    {clientProjects.length > 0 ? (
                      <div className="space-y-1 text-xs">
                        {clientProjects.map((p) => (
                          <div key={p.id} className="flex justify-between font-bold">
                            <span className="font-mono text-slate-500 font-bold uppercase">{p.id}</span>
                            <span className="truncate max-w-[80px] text-slate-700">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Sin obras activas en planta</span>
                    )}
                  </div>

                  {/* Field service tickets */}
                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 mb-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span>Órdenes de Servicio (OS)</span>
                    </div>
                    {clientOrders.length > 0 ? (
                      <div className="space-y-1 text-xs">
                        {clientOrders.map((o) => (
                          <div key={o.id} className="flex justify-between font-bold">
                            <span className="font-mono text-blue-600 font-bold">{o.id}</span>
                            <span
                              className={`text-xs px-1.5 py-0.2 rounded font-extrabold ${
                                o.status === "Finalizado" ? "text-green-700 bg-green-55 border border-green-200" : "text-slate-500 bg-slate-100 border border-slate-200"
                              }`}
                            >
                              {o.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No hay tickets de guardia</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "providers" && selectedProvider ? (
            <div className="glass-card p-5 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="font-mono text-sm font-bold text-indigo-600 block">{selectedProvider.id}</span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedProvider.name}</h2>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1.5 rounded-full border border-indigo-150 mt-2.5 inline-block uppercase">
                  Giro: {selectedProvider.category}
                </span>
              </div>

              {/* Contact de providers */}
              <div className="space-y-3.5 text-sm text-slate-700">
                <div>
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-xs">Identificación RFC</span>
                  <span className="font-extrabold text-slate-900 font-mono text-base">{selectedProvider.rfc}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-xs">Teléfono de Suministro</span>
                  <span className="font-extrabold text-slate-900 text-base">{selectedProvider.phone}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-xs">Correo de compras/pedidos</span>
                  <span className="font-extrabold text-indigo-700 text-base">{selectedProvider.email}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-xs">Dirección Comercial</span>
                  <span className="font-extrabold text-slate-800 text-sm leading-relaxed">{selectedProvider.address}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-400">
              <Users2 className="h-10 w-10 text-slate-300 mx-auto animate-pulse-slow" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">Detalle de Contacto</p>
              <p className="text-xs text-gray-400 mt-1">Registra o selecciona un contacto para desglosar la bitácora fiscal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
