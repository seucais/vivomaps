import { TOPOLOGIES } from './topologyData';

const LOCAL_STORAGE_KEY = 'vivo_topologia_centrais_v2';

// Cluster labels and descriptions
export const CLUSTER_METADATA = {
  all: { id: 'all', label: 'Todos os Clusters', key: 'all', color: '#6366f1' },
  guarulhos: { id: 'guarulhos', label: 'Guarulhos / Alto Tietê', key: 'guarulhos', color: '#8b5cf6' },
  leste: { id: 'leste', label: 'São Paulo — Zona Leste', key: 'leste', color: '#ec4899' },
  norte: { id: 'norte', label: 'São Paulo — Zona Norte', key: 'norte', color: '#3b82f6' },
  centro: { id: 'centro', label: 'São Paulo — Centro / Sul', key: 'centro', color: '#10b981' },
  santos: { id: 'santos', label: 'Baixada Santista / Santos', key: 'santos', color: '#f59e0b' },
  bertioga: { id: 'bertioga', label: 'Litoral Norte / Bertioga', key: 'bertioga', color: '#06b6d4' },
  ribeira: { id: 'ribeira', label: 'Vale do Ribeira', key: 'ribeira', color: '#84cc16' }
};

// Full names dictionary for central codes
const CENTRAL_NAMES = {
  // Guarulhos
  JA: "Central Jaçanã", PC: "Central Penha de França", AO: "Central Arujá",
  AE: "Central Aeroporto Cumbica", NA: "Central Nova Arujá", NB: "Central Nova Bonsucesso",
  VG: "Central Vila Galvão", GR: "Central Guarulhos Centro", MQ: "Central Mairiporã",
  CC: "Central Cumbica", DU: "Central Dutra", BO: "Central Bonsucesso",
  CN: "Central Cangaíba", PG: "Central Pimentas", VE: "Central Vilanova",
  IE: "Central Itaquera Leste", PE: "Central Penha", VU: "Central Vila Augusta",
  EM: "Central Ermelino Matarazzo", GZ: "Central Guaianases", UU: "Central Utinga",
  PD: "Central Pimentas Sul", CI: "Central Cidade Tiradentes", JI: "Central Jardim Aricanduva",
  IT: "Central Itaim Paulista", JP: "Central Jardim Pres. Dutra", SM: "Central São Miguel Paulista",
  IA: "Central Itaquaquecetuba", JL: "Central Jardim Helena", RB: "Central Ribeiro", 'IT*': "Central Itaim Secundária",

  // Leste & Centro
  VL: "Central Vila Formosa", NM: "Central Nogueira Martins", BR: "Central Brás",
  ST: "Central Santana", DT: "Central Dom João", VR: "Central Vila Recreio",
  PF: "Central Parada XV", LI: "Central Liberdade", SM: "Central São Mateus",
  PM: "Central Parque do Carmo", VP: "Central Vila Prudente", SS: "Central São Bernardo",
  TI: "Central Tatuapé", AM: "Central Anália Franco", AR: "Central Aricanduva",
  GU: "Central Guaratiba", SA: "Central Santo André", RR: "Central Rudge Ramos",
  JF: "Central Jabaquara", IG: "Central Ipiranga", PP: "Central Paraíso",
  SZ: "Central Souza", HA: "Central Haroldo", FO: "Central Freguesia do Ó",
  LM: "Central Limão", LZ: "Central Luz", TR: "Central Tremembé",
  IR: "Central Imirim", BS: "Central Brasilândia", NC: "Central Nova Cantareira",
  CV: "Central Casa Verde", CA: "Central Cachoeirinha", PL: "Central Pirituba",
  AN: "Central Anhanguera", SI: "Central Sírio", HG: "Central Higienópolis",
  BG: "Central Bela Vista", BC: "Central Bom Retiro", GWT: "Central Gateway SP",
  JD: "Central Jardins", PA: "Central Paulista", MO: "Central Mooca",
  AS: "Central Aclimação", PO: "Central Pinheiros", AD: "Central Andrade",
  IB: "Central Itaim Bibi", VM: "Central Vila Mariana", IP: "Central Ibirapuera",
  ZE: "Central Zero", VA: "Central Vila Andrade", UT: "Central Utinga Sul",
  AC: "Central Aclimação Sul", SD: "Central Saúde",

  // Santos & Bertioga & Ribeira
  'SPO.JB': "Hub Submarino Santos JB", DI: "Central Diadema", VF: "Central Vila Furlo",
  PQ: "Central Praia Grande", IM: "Central Imigrantes", IN: "Central Interlagos",
  JC: "Central José Menino", SJ: "Central São Vicente", VC: "Central Vicente de Carvalho",
  SA: "Central Saboó", CP: "Central Cubatão", SR: "Central Santa Rosa",
  JR: "Central Jurubatuba", PT: "Central Ponta da Praia", JV: "Central Jabaquara Veste",
  EN: "Central Enseada", WL: "Central Wilma", JM: "Central José Menino Leste",
  TWIS: "Central Twin Islands", SP: "Central São Pedro", SL: "Central São Lucas",
  CO: "Central Coqueiros", AV: "Central Aviação", TO: "Central Tupi",
  FB: "Central Forte Bertioga", BU: "Central Bertioga Urbana", BT: "Central Bertioga Centro",
  RL: "Central River Leste", PB: "Central Praia Branca", 'BTP.SP': "Gateway Ribeira SP",
  BA: "Central Barão de Antonina", SG: "Central São Gabriel", DC: "Central Doces",
  CG: "Central Campo Grande", 'JQP.SP': "Central Juquiá SP", SLO: "Central São Lourenço",
  RD: "Central Redenção", RM: "Central Ramos", MS: "Central Mossoró",
  IC: "Central Iporanga", BC: "Central Boiçucanga", SO: "Central Sete Barras",
  GT: "Central Guaraqueçaba", JG: "Central Registro Norte", SU: "Central Sul Vale"
};

// Generate default structured store data from TOPOLOGIES
export function getDefaultTopologyData() {
  const clusters = {};

  Object.keys(TOPOLOGIES).forEach((clusterKey) => {
    const raw = TOPOLOGIES[clusterKey];
    
    // Map nodes
    const nodes = raw.nodes.map((n, index) => {
      const code = n.id;
      const isHub = n.dark;
      const fullName = CENTRAL_NAMES[code] || `Central ${code}`;
      const status = index % 11 === 0 ? 'manutencao' : (index % 17 === 0 ? 'alerta' : 'operacional');
      const capacityGbps = isHub ? 400 : (index % 2 === 0 ? 100 : 40);
      
      return {
        id: `${clusterKey}-${code}`,
        code: code,
        name: fullName,
        cluster_key: clusterKey,
        x: n.x,
        y: n.y,
        dark: isHub,
        status: status, // 'operacional' | 'manutencao' | 'alerta' | 'desativado'
        capacidade_gbps: capacityGbps,
        portas_ativas: Math.floor(capacityGbps * 0.75),
        tecnico_responsavel: "Equipe de Operações " + CLUSTER_METADATA[clusterKey].label.split('/')[0]
      };
    });

    // Map links
    const links = raw.links.map(([fromCode, toCode], index) => {
      const linkId = `${clusterKey}-${fromCode}-${toCode}`;
      const isCritical = index % 5 === 0;
      const status = isCritical && index % 10 === 0 ? 'rompido' : (index % 7 === 0 ? 'degradado' : 'ativo');
      const dist = parseFloat(((index * 1.7 % 25) + 3.2).toFixed(1));
      const fiberType = isHubLink(raw.nodes, fromCode, toCode) ? "144 FO Monomodo (G.652.D)" : "48 FO Monomodo";

      return {
        id: linkId,
        from_code: fromCode,
        to_code: toCode,
        cluster_key: clusterKey,
        distancia_km: dist,
        tipo_cabo: fiberType,
        trajeto: index % 4 === 0 ? "Subterrâneo (Duto PVC)" : (index % 6 === 0 ? "Submarino / Ribeirinho" : "Aéreo em Postes"),
        status: status, // 'ativo' | 'degradado' | 'rompido'
        largura_banda: "100 Gbps"
      };
    });

    clusters[clusterKey] = {
      key: clusterKey,
      width: raw.width,
      height: raw.height,
      extra: raw.extra || '',
      nodes,
      links
    };
  });

  return clusters;
}

function isHubLink(nodes, fromCode, toCode) {
  const f = nodes.find(n => n.id === fromCode);
  const t = nodes.find(n => n.id === toCode);
  return f?.dark && t?.dark;
}

// Load data from localStorage or default
export function loadStoredTopology() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load stored topology data, using defaults:", e);
  }
  return getDefaultTopologyData();
}

// Save data to localStorage
export function saveStoredTopology(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save topology data:", e);
  }
}

// Clear localStorage and return defaults
export function resetTopologyData() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  return getDefaultTopologyData();
}
