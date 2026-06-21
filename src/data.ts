// Sample Initial Data for Exim Dashboard in Villahermosa, Tabasco
import {
  OrderService,
  Project,
  Quotation,
  PreventivePlan,
  EquipmentHistory,
  InventoryItem,
  InventoryMovement,
  ToolAsset,
  Client,
  Provider,
  FinRecord
} from "./types";

export const initialClients: Client[] = [
  {
    id: "CLI-101",
    name: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna",
    rfc: "PME380607PE2",
    fiscalAddress: "Av. Paseo Tabasco 1201, Col. Tabasco 2000, Villahermosa, Tab.",
    contacts: [
      { name: "Ing. Arturo Mendoza", phone: "993 315 4220", email: "amendoza.pemex@pemex.com", role: "Superintendente de Mantenimiento" },
      { name: "Lic. Clara Rosales", phone: "993 315 4221", email: "crosales.pemex@pemex.com", role: "Compras y Suministros" }
    ],
    serviceAddresses: [
      { name: "Sector Samaria-Mecoacán", address: "Carretera Fed. Cárdenas-Coatzacoalcos KM 15, Cunduacán, Tabasco" },
      { name: "Oficinas Administrativas Pemex", address: "Av. Adolfo Ruiz Cortines s/n, Col. Lindavista, Villahermosa" }
    ]
  },
  {
    id: "CLI-102",
    name: "Plaza Altabrisa Villahermosa",
    rfc: "PAV110412AA3",
    fiscalAddress: "Periférico Carlos Pellicer Cámara 129, Col. Primero de Mayo, 86190, Villahermosa, Tab.",
    contacts: [
      { name: "Ing. Jorge Cruz Jiménez", phone: "993 186 5543", email: "jcruz@plazaaltabrisavillahermosa.com", role: "Gerente de Operaciones" }
    ],
    serviceAddresses: [
      { name: "Plaza Altabrisa Principal", address: "Periférico Carlos Pellicer Cámara 129, Col. Primero de Mayo, Villahermosa" }
    ]
  },
  {
    id: "CLI-103",
    name: "Clínica de Especialidades Médicas del Sureste",
    rfc: "CEMS940508TS4",
    fiscalAddress: "Av. Gregorio Méndez Magaña 1402, Col. Nueva Villahermosa, Villahermosa, Tab.",
    contacts: [
      { name: "Dra. Rebeca Trujillo", phone: "993 352 1100", email: "rtrujillo@especialidadessureste.com", role: "Directora Administrativa" }
    ],
    serviceAddresses: [
      { name: "Edificio de Consulta Externa", address: "Av. Gregorio Méndez Magaña 1402, Villahermosa" }
    ]
  },
  {
    id: "CLI-104",
    name: "Sra. María Elena Domínguez (Residencial)",
    rfc: "DOEM681215H82",
    fiscalAddress: "Fraccionamiento Club Campestre, Calle Tabachines Retorno 4, Casa 12, Villahermosa, Tab.",
    contacts: [
      { name: "María Elena Domínguez", phone: "993 250 9011", email: "m.elena.dom@gmail.com", role: "Propietaria" }
    ],
    serviceAddresses: [
      { name: "Residencia Campestre", address: "Calle Tabachines Retorno 4, Casa 12, Fracc. Club Campestre" }
    ]
  }
];

export const initialProviders: Provider[] = [
  {
    id: "PROV-301",
    name: "Distribuidora Eléctrica del Sureste S.A. de C.V.",
    rfc: "DES780415AA2",
    category: "Material Eléctrico y Canalización",
    phone: "993 314 5500",
    email: "ventas@electricadelsureste.com",
    address: "Av. Francisco I. Madero 908, Centro, Villahermosa, Tab."
  },
  {
    id: "PROV-302",
    name: "Refacciones y Climas de Tabasco",
    rfc: "RCT050821TT1",
    category: "Refacciones y Gases Refrigerantes",
    phone: "993 312 8090",
    email: "soporte@climastabasco.com",
    address: "Periférico Carlos Pellicer #410, Col. Tamulté, Villahermosa, Tab."
  },
  {
    id: "PROV-303",
    name: "Herramientas Profesionales de Villahermosa",
    rfc: "HPV1210103V2",
    category: "Herramientas de Medición y Soldadura",
    phone: "993 351 2040",
    email: "contacto@herramientasvhsa.com",
    address: "Carretera Villahermosa-Cárdenas KM 2.5, Col. Carrizal, Villahermosa"
  }
];

export const initialServiceOrders: OrderService[] = [
  {
    id: "OS-1001",
    title: "Mantenimiento Correctivo de Humidificadores y MiniSplits",
    clientName: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna",
    clientAddress: "Sector Samaria-Mecoacán, Carretera Fed. Cárdenas-Coatzacoalcos KM 15",
    date: "2026-06-18",
    assignedCrew: ["Ing. Carlos Ramos", "Téc. Samuel Priego"],
    status: "Finalizado",
    description: "Revisión general de minisplit de 2TR en sala de control de bombas. Presentaba goteo interno y bajo rendimiento de enfriamiento.",
    technicalNotes: "Se realizó limpieza profunda del serpentín evaporador y condensador con presurizadora. Se encontró obstrucción en la manguera de drenaje y se purgó. Adicionalmente, se recargó con 400g de gas refrigerante R-410A. El equipo quedó operando a 16.5°C de salida.",
    photoBefore: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400",
    photoAfter: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400",
    signature: "Arturo Mendoza - PEMEX Supervisor",
    signatureName: "Ing. Arturo Mendoza",
    signatureDate: "2026-06-18",
    equipmentId: "EQ-001"
  },
  {
    id: "OS-1002",
    title: "Revisión de Falla en Tablero de Transferencia S3",
    clientName: "Plaza Altabrisa Villahermosa",
    clientAddress: "Plaza Altabrisa Principal, Periférico Carlos Pellicer Cámara 129",
    date: "2026-06-20",
    assignedCrew: ["Ing. Carlos Ramos", "Aux. Juan Chablé"],
    status: "En Proceso",
    description: "El tablero de transferencia automática del generador de emergencias del área de cines no arranca automáticamente ante cortes de Comisión Federal de Electricidad (CFE).",
    technicalNotes: "Apertura de gabinete y revisión de relevadores de control. Se detectó bobina del contactor de transferencia principal dañada por sobretensión en la fase B."
  },
  {
    id: "OS-1003",
    title: "Mantenimiento Preventivo Bimestral de Chiller Carrier",
    clientName: "Clínica de Especialidades Médicas del Sureste",
    clientAddress: "Av. Gregorio Méndez Magaña 1402, Edificio de Consulta Externa",
    date: "2026-06-22",
    assignedCrew: ["Téc. Roberto Izquierdo", "Téc. Samuel Priego"],
    status: "Pendiente",
    description: "Servicio de rutina bimestral contratado bajo póliza. Limpieza de filtros, toma de parámetros eléctricos, revisión de presiones del sistema de climatización central chiller."
  },
  {
    id: "OS-1004",
    title: "Reubicación de Unidad Condensadora y Recarga",
    clientName: "Sra. María Elena Domínguez (Residencial)",
    clientAddress: "Calle Tabachines Retorno 4, Casa 12, Fracc. Club Campestre",
    date: "2026-06-15",
    assignedCrew: ["Aux. Juan Chablé"],
    status: "Pausado por Material",
    description: "Mover el condensador de minisplit inverter de 1.5TR del balcón del segundo piso hacia el área de azotea para reducir vibraciones de ruido en la recámara principal.",
    technicalNotes: "Se requiere un rollo adicional de tubería de cobre de 3/8' y 1/4' (aproximadamente 6 metros) que no venía contemplado inicialmente. En espera de salida del almacén."
  }
];

export const initialProjects: Project[] = [
  {
    id: "PRJ-2001",
    name: "Rediseño Eléctrico y Balanceo de Cargas - Nave Industrial Samaria",
    clientName: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna",
    type: "Industrial",
    description: "Modernización de la red eléctrica interna de la nave de almacenamiento de refacciones, incluyendo instalación de canalización galvanizada pared gruesa, cableado de calibres altos, balanceo de fases en subestación de 150 KVA y puesta a tierra.",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    costBudget: 380000.00,
    costReal: 245000.00,
    contractors: ["Grupo Obras Civiles de Tabasco", "Martínez Destajistas"],
    ganttPhases: [
      { id: "PH-1", name: "Estudio de Carga y Levantamiento", startDate: "2026-06-01", endDate: "2026-06-08", progress: 100, status: "Completado" },
      { id: "PH-2", name: "Canalización y Soportería Unicanal", startDate: "2026-06-09", endDate: "2026-06-23", progress: 90, status: "En Proceso" },
      { id: "PH-3", name: "Tendido de Cableado de Cobre y Conexión", startDate: "2026-06-24", endDate: "2026-07-05", progress: 0, status: "No Iniciado" },
      { id: "PH-4", name: "Pruebas de Aislamiento (Megger) y Entrega", startDate: "2026-07-06", endDate: "2026-07-15", progress: 0, status: "No Iniciado" }
    ]
  },
  {
    id: "PRJ-2002",
    name: "Instalación de Sistema de Climatización VRF (Flujo de Refrigerante Variable)",
    clientName: "Clínica de Especialidades Médicas del Sureste",
    type: "Comercial",
    description: "Sustitución de minisplits individuales antiguos por un sistema VRF ecológico de alta eficiencia de la marca Daikin para las nuevas 8 salas de hospitalización de ginecología.",
    startDate: "2026-06-10",
    endDate: "2026-07-10",
    costBudget: 520000.00,
    costReal: 410000.00,
    contractors: ["Taller Izquierdo Climas"],
    ganttPhases: [
      { id: "PH-10", name: "Desmontaje de Equipos Anteriores", startDate: "2026-06-10", endDate: "2026-06-14", progress: 100, status: "Completado" },
      { id: "PH-11", name: "Instalación de Tubería de Cobre Reforzada", startDate: "2026-06-15", endDate: "2026-06-22", progress: 85, status: "En Proceso" },
      { id: "PH-12", name: "Montaje de Evaporadoras y Condensador Central", startDate: "2026-06-23", endDate: "2026-07-02", progress: 10, status: "En Proceso" },
      { id: "PH-13", name: "Vacío, Carga de Gas R410 y Pruebas", startDate: "2026-07-03", endDate: "2026-07-10", progress: 0, status: "No Iniciado" }
    ]
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: "COT-3001",
    clientName: "Plaza Altabrisa Villahermosa",
    dateCreated: "2026-06-10",
    validityDate: "2026-06-30",
    status: "Revisión",
    headerNotes: "Propuesta para el mantenimiento preventivo anual a sus extractores industriales de aire en la zona de comida (Food Court).",
    convertedTo: undefined,
    concepts: [
      { id: "C-1", description: "Mantenimiento general de extractores centrífugos de 5 HP (Limpieza, engrase de baleros, alineación)", qty: 6, price: 4200.00, category: "Mano de Obra" },
      { id: "C-2", description: "Cambio de bandas dentadas tipo V de alta duración Gates", qty: 12, price: 450.00, category: "Material" },
      { id: "C-3", description: "Suministro de desengrasante dieléctrico de uso pesado Grado Industrial cilíndrico", qty: 3, price: 1800.00, category: "Material" },
      { id: "C-4", description: "Viáticos recurrentes y equipo de seguridad de alturas para personal técnico", qty: 1, price: 2000.00, category: "Viáticos" }
    ],
    costMaterials: 10800.00,
    costLabor: 25200.00,
    costTravel: 2000.00,
    total: 38000.00
  },
  {
    id: "COT-3002",
    clientName: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna",
    dateCreated: "2026-06-12",
    validityDate: "2026-07-12",
    status: "Aprobada",
    headerNotes: "Suministro e instalación de transformador de pedestal eléctrico trifásico de 75KVA para el área de laboratorios.",
    concepts: [
      { id: "C-11", description: "Transformador de pedestal trifásico 75 KVA Prolec 13200V / 220V - 127V Cobre", qty: 1, price: 175000.00, category: "Material" },
      { id: "C-12", description: "Mano de obra certificada con protocolo de seguridad Pemex clase 3 para conexión y pruebas", qty: 1, price: 45000.00, category: "Mano de Obra" },
      { id: "C-13", description: "Construcción de base de concreto armado con herrajes de anclaje", qty: 1, price: 18000.00, category: "Mano de Obra" },
      { id: "C-14", description: "Grúa industrial para maniobra de posicionamiento en sitio Tabasco", qty: 1, price: 12000.00, category: "Viáticos" }
    ],
    costMaterials: 175000.00,
    costLabor: 63000.00,
    costTravel: 12000.00,
    total: 250000.00,
    convertedTo: "Proyecto",
    convertedId: "PRJ-2001"
  },
  {
    id: "COT-3003",
    clientName: "Sra. María Elena Domínguez (Residencial)",
    dateCreated: "2026-06-20",
    validityDate: "2026-06-25", // Near to expire due to volatile equipment pricing
    status: "Enviada",
    headerNotes: "Venta e instalación de Minisplit Inverter Miracle 24,000 BTU, alta eficiencia.",
    concepts: [
      { id: "C-21", description: "Evaporadora + Condensadora Mirage Magnum 22, 2TR 220V marca Mirage", qty: 1, price: 16500.00, category: "Material" },
      { id: "C-22", description: "Kit de fijación, herrajes de soporte soldables y taquetes expansivos", qty: 1, price: 1200.00, category: "Material" },
      { id: "C-23", description: "Mano de obra de instalación básica a 3 metros de altura e interconexión", qty: 1, price: 2500.00, category: "Mano de Obra" }
    ],
    costMaterials: 17700.00,
    costLabor: 2500.00,
    costTravel: 0.00,
    total: 20200.00
  }
];

export const initialPreventivePlans: PreventivePlan[] = [
  {
    id: "PREV-5001",
    clientName: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna",
    equipmentName: "Aire Acondicionado Precisión Liebert 10TR (Site de Servidores)",
    equipmentLocation: "Edificio de Telecomunicaciones - Sala Principal",
    frequencyMonths: 3,
    lastServiceDate: "2026-03-15",
    nextServiceDate: "2026-06-15", // OVERDUE! Exceeded
    status: "Vencido",
    policyCode: "POL-PEMEX-092"
  },
  {
    id: "PREV-5002",
    clientName: "Clínica de Especialidades Médicas del Sureste",
    equipmentName: "Subestación Electromecánica 250 KVA (Gabinete principal y apartarrayos)",
    equipmentLocation: "Patio trasero de máquinas y transferencias",
    frequencyMonths: 12,
    lastServiceDate: "2025-07-20",
    nextServiceDate: "2026-07-20", // COMING SOON!
    status: "Próximo Vencimiento",
    policyCode: "POL-CLINICA-004"
  },
  {
    id: "PREV-5003",
    clientName: "Plaza Altabrisa Villahermosa",
    equipmentName: "U.M.A. (Unidad Manejadora de Aire) No. 4 Carrier de 15TR",
    equipmentLocation: "Azotea Ala Norte, arriba del Food Court",
    frequencyMonths: 6,
    lastServiceDate: "2026-05-10",
    nextServiceDate: "2026-11-10",
    status: "Al Corriente",
    policyCode: "POL-ALTA-018"
  },
  {
    id: "PREV-5004",
    clientName: "Sra. María Elena Domínguez (Residencial)",
    equipmentName: "Minisplit Carrier Inverter 1.5TR recámara secundaria",
    equipmentLocation: "Segundo nivel, ala derecha",
    frequencyMonths: 6,
    lastServiceDate: "2026-02-12",
    nextServiceDate: "2026-08-12",
    status: "Al Corriente",
    policyCode: "POL-DOMINGUEZ-1"
  }
];

export const initialEquipmentHistory: EquipmentHistory[] = [
  {
    id: "H-001",
    equipmentName: "Aire Acondicionado Precisión Liebert 10TR (Site de Servidores)",
    clientName: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna",
    date: "2026-03-15",
    type: "Póliza Mantenimiento Preventivo",
    notes: "Lavado de serpentines, limpieza de charola de condensados. Apriete de conexiones en compresor Copeland y confirmación de presiones (115 Psi Baja, 340 Psi Alta).",
    technician: "Ing. Carlos Ramos"
  },
  {
    id: "H-002",
    equipmentName: "Aire Acondicionado Precisión Liebert 10TR (Site de Servidores)",
    clientName: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna",
    date: "2026-04-02",
    type: "Reemplazo de Tarjeta de Control",
    notes: "Derivado de picos eléctricos de CFE, la tarjeta del microprocesador Liebert se quemó. Se instaló refacción nueva importada original y se calibraron sensores de humedad.",
    technician: "Ing. Carlos Ramos"
  },
  {
    id: "H-003",
    equipmentName: "U.M.A. (Unidad Manejadora de Aire) No. 4 Carrier de 15TR",
    clientName: "Plaza Altabrisa Villahermosa",
    date: "2026-05-10",
    type: "Preventivo Bimestral",
    notes: "Sustitución de juego de 3 filtros de aire tipo plisados de 20x20x2. Engrasado de rodamientos de ventilador principal. El consumo eléctrico del motor marca 23 Amperes en carga plena.",
    technician: "Téc. Roberto Izquierdo"
  }
];

export const initialInventoryItems: InventoryItem[] = [
  { id: "MAT-4001", name: "Cable de Cobre THW Calibre 10 AWG Iusa (mts)", category: "Eléctrico", stock: 350, minStock: 100, unit: "mts", location: "Estante A-1" },
  { id: "MAT-4002", name: "Cable de Cobre THW Calibre 8 AWG Condumex (mts)", category: "Eléctrico", stock: 120, minStock: 50, unit: "mts", location: "Estante A-1" },
  { id: "MAT-4003", name: "Gas Refrigerante DuPont R-410A (Boyas de 11.3 kg)", category: "Aires Acondicionados", stock: 4, minStock: 2, unit: "pzs", location: "Área de Químicos" },
  { id: "MAT-4004", name: "Gas Refrigerante Genetron R-22 (Boyas de 13.6 kg)", category: "Aires Acondicionados", stock: 1, minStock: 2, unit: "pzs", location: "Área de Químicos" }, // ALERTA REORDEN! Low stock
  { id: "MAT-4005", name: "Interruptor Termomagnético SquarD QO 1 Polo 20A", category: "Eléctrico", stock: 24, minStock: 10, unit: "pzs", location: "Gaveta B-2" },
  { id: "MAT-4006", name: "Filtro de Aire Plisado Merv 8 de 20x20x2", category: "Aires Acondicionados", stock: 45, minStock: 20, unit: "pzs", location: "Estante C-4" },
  { id: "MAT-4007", name: "Guante de Electricista de Baquelita Alta Tensión (EPP)", category: "Epps", stock: 6, minStock: 4, unit: "pzs", location: "Armario de Seguridad" }
];

export const initialInventoryMovements: InventoryMovement[] = [
  { id: "MOV-001", itemId: "MAT-4001", itemName: "Cable de Cobre THW Calibre 10 AWG Iusa (mts)", type: "Salida", qty: 80, date: "2026-06-18", recipient: "Ing. Carlos Ramos", reason: "Obra Nafe Pemex Samaria" },
  { id: "MOV-002", itemId: "MAT-4003", itemName: "Gas Refrigerante DuPont R-410A (Boyas de 11.3 kg)", type: "Salida", qty: 1, date: "2026-06-18", recipient: "Téc. Samuel Priego", reason: "Reparación OS-1001" },
  { id: "MOV-003", itemId: "MAT-4005", itemName: "Interruptor Termomagnético SquarD QO 1 Polo 20A", type: "Entrada", qty: 30, date: "2026-06-19", recipient: "Distribuidora Eléctrica Sureste", reason: "Abasto Almacén General" }
];

export const initialToolAssets: ToolAsset[] = [
  { id: "HER-6001", name: "Multímetro de Gancho Fluke 376 FC True-RMS", code: "EXIM-HER-01", resguardoUser: "Ing. Carlos Ramos", status: "Asignado", dateAssigned: "2026-01-10" },
  { id: "HER-6002", name: "Bomba de Vacío de Dos Etapas Robinair 8 CFM", code: "EXIM-HER-02", resguardoUser: "Téc. Roberto Izquierdo", status: "Asignado", dateAssigned: "2026-02-15" },
  { id: "HER-6003", name: "Juego de Manómetros Manifold Yellow Jacket para R410/R22", code: "EXIM-HER-03", resguardoUser: "Téc. Samuel Priego", status: "Asignado", dateAssigned: "2026-04-12" },
  { id: "HER-6004", name: "Planta Soldadora Inverter Lincoln Electric 200A", code: "EXIM-HER-04", resguardoUser: "Ninguno", status: "Disponible" },
  { id: "HER-6005", name: "Escalera de Tijera Fibra de Vidrio 12 Peldaños Werner", code: "EXIM-HER-05", resguardoUser: "Aux. Juan Chablé", status: "Asignado", dateAssigned: "2026-05-01" },
  { id: "HER-6006", name: "Medidor de Resistencia de Aislamiento (Megger) Fluke 1507", code: "EXIM-HER-06", resguardoUser: "Ninguno", status: "Mantenimiento" }
];

export const initialFinRecords: FinRecord[] = [
  { id: "FIN-7001", type: "Anticipo", amount: 152000.00, date: "2026-06-02", status: "Cobrado", associatedWith: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna", description: "Anticipo del 40% por Rediseño Eléctrico PRJ-2001" },
  { id: "FIN-7002", type: "Estimación", amount: 93000.00, date: "2026-06-16", status: "Pendiente", associatedWith: "Petróleos Mexicanos (Pemex) - Activo Samaria Luna", description: "Cobro por Estimación No. 1 de Obra Eléctrica PRJ-2001 (Canalizado al 90%)", dueDate: "2026-07-16", creditTerms: 30 },
  { id: "FIN-7003", type: "Venta", amount: 20200.00, date: "2026-06-20", status: "Cobrado", associatedWith: "Sra. María Elena Domínguez (Residencial)", description: "Pago total por adquisición e instalación de Minisplit Mirage M-22 COT-3003 (Residencial)" },
  { id: "FIN-7004", type: "Gasto Operativo", subType: "Gasolina", amount: 1800.00, date: "2026-06-18", status: "Pagado", associatedWith: "Unidad Nissan NP300 Placas VM-112", description: "Combustible y peaje de carretera Villahermosa-Cunduacán ida y vuelta Pemex" },
  { id: "FIN-7005", type: "Gasto Operativo", subType: "Compra Pánico", amount: 3200.00, date: "2026-06-19", status: "Pagado", associatedWith: "Plaza Altabrisa Tablero S3", description: "Compra de urgencia de bobina de contactor Schneider de repuesto en Eléctrica Sureste" },
  { id: "FIN-7006", type: "Gasto Operativo", subType: "Viáticos", amount: 1500.00, date: "2026-06-20", status: "Pagado", associatedWith: "Téc. Roberto Izquierdo / Téc. Samuel Priego", description: "Comida de campo y refrescos para cuadrilla en trabajos de doble jornada en clínica" }
];
