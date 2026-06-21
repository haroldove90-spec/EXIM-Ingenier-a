// Types for Exim Dashboard

export interface OrderService {
  id: string; // Sequential e.g. OS-1001
  title: string;
  clientName: string;
  clientAddress: string;
  date: string;
  assignedCrew: string[];
  status: "Pendiente" | "En Proceso" | "Pausado por Material" | "Finalizado";
  description: string;
  technicalNotes?: string;
  photoBefore?: string;
  photoAfter?: string;
  signature?: string; // Signature dataURL or text
  signatureName?: string;
  signatureDate?: string;
  equipmentId?: string;
}

export interface GanttPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number; // 0 to 100
  status: "No Iniciado" | "En Proceso" | "Completado" | "Atrasado";
}

export interface Project {
  id: string; // PRJ-2001
  name: string;
  clientName: string;
  type: "Industrial" | "Comercial" | "Residencial";
  description: string;
  startDate: string;
  endDate: string;
  ganttPhases: GanttPhase[];
  costBudget: number;
  costReal: number;
  contractors: string[]; // List of destajistas/contratistas
}

export interface QuoteConcept {
  id: string;
  description: string;
  qty: number;
  price: number;
  category: "Material" | "Mano de Obra" | "Viáticos";
}

export interface Quotation {
  id: string; // COT-3001
  clientName: string;
  dateCreated: string;
  validityDate: string; // Limit date
  status: "Enviada" | "Revisión" | "Aprobada" | "Rechazada";
  headerNotes?: string;
  concepts: QuoteConcept[];
  costMaterials: number;
  costLabor: number;
  costTravel: number; // Viáticos
  total: number;
  convertedTo?: "OS" | "Proyecto";
  convertedId?: string;
}

export interface PreventivePlan {
  id: string; // PREV-5001
  clientName: string;
  equipmentName: string; // e.g. "Chiller Carrier 30TR"
  equipmentLocation: string; // Plant or specific building area
  frequencyMonths: number; // 3, 6, 12
  lastServiceDate: string;
  nextServiceDate: string;
  status: "Al Corriente" | "Próximo Vencimiento" | "Vencido";
  policyCode: string;
}

export interface EquipmentHistory {
  id: string;
  equipmentName: string;
  clientName: string;
  date: string;
  type: string; // e.g. "Mantenimiento Preventivo" | "Cambio de Compresor"
  notes: string;
  technician: string;
}

export interface InventoryItem {
  id: string; // MAT-4001
  name: string;
  category: "Eléctrico" | "Aires Acondicionados" | "Consumibles" | "Herramientas" | "Epps";
  stock: number;
  minStock: number;
  unit: string; // "pzs", "mts", "lts"
  location: string; // e.g. "Estante A-3"
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: "Entrada" | "Salida";
  qty: number;
  date: string;
  recipient: string; // Technician or Project/OS ID
  reason: string;
}

export interface ToolAsset {
  id: string; // HER-6001
  name: string;
  code: string;
  resguardoUser: string; // Who holds it currently
  status: "Disponible" | "Asignado" | "Mantenimiento";
  dateAssigned?: string;
}

export interface ClientContact {
  name: string;
  phone: string;
  email: string;
  role: string;
}

export interface ServiceAddress {
  name: string; // e.g., "Planta Industrial Anacleto Canabal"
  address: string;
}

export interface Client {
  id: string;
  name: string;
  rfc: string;
  fiscalAddress: string;
  contacts: ClientContact[];
  serviceAddresses: ServiceAddress[];
  isProvider?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  rfc: string;
  category: string; // e.g., "Distribuidora Eléctrica", "Refacciones de Climas"
  phone: string;
  email: string;
  address: string;
}

export interface FinRecord {
  id: string; // FIN-7001
  type: "Anticipo" | "Estimación" | "Venta" | "Gasto Operativo";
  subType?: "Gasolina" | "Viáticos" | "Comida" | "Compra Pánico" | "Material";
  amount: number;
  date: string;
  status: "Pendiente" | "Cobrado" | "Pagado";
  associatedWith: string; // Client Name, OS-XXXX or PRJ-XXXX
  description: string;
  dueDate?: string; // For credit days (30, 60, 90 days)
  creditTerms?: 30 | 60 | 90;
}
