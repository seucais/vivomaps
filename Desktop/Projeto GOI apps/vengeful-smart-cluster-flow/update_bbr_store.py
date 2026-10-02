import json

with open('parsed_data.json', encoding='utf-8') as f:
    data = json.load(f)

cabos = data['cabos']
centrais = data['centrais']

valid_centrais = [c for c in centrais if len(c['sigla']) > 3]

print(f"Total cabos: {len(cabos)}")
print(f"Total valid centrais: {len(valid_centrais)}")

js_content = f"""// Store centralizado para a aplicação BACKBONE - BBR (v7 - Ultra Robust Sheets Data)
const STORE_KEY = 'backbone_bbr_data_v7_sheets';

export const DADOS_INICIAIS_BBR = {{
  datasetVersion: '7.0',
  usuarioAtual: {{
    id: 'usr_william',
    nome: 'william bispo',
    email: 'william.spc@vivo.com.br',
    cargo: 'Analista de Backbone SR',
    area: 'Rede Externa & Planta Interna',
    role: 'Admin',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  }},
  
  centrais: {json.dumps(valid_centrais, ensure_ascii=False, indent=2)},

  cabos: {json.dumps(cabos, ensure_ascii=False, indent=2)},

  rotas: [
    {{
      id: 'rot_1',
      nome: '#76 poda Guaraú - Peruíbe',
      tipo: 'Trekking / Rota Cabo',
      status: 'Concluída',
      distanciaKm: 5.77,
      desnivelPositivo: 234,
      desnivelNegativo: 210,
      elevacaoMax: 240,
      elevacaoMin: 12,
      dificuldade: 'Moderada',
      trailRank: 9,
      autor: 'william bispo',
      caboNome: 'TR75 (PUE.PA -> PUE.SO)',
      cidade: 'Peruíbe / SP',
      pontosGps: [
        {{ lat: -24.3200, lng: -46.9900, elevacao: 12, label: 'Início Peruíbe' }},
        {{ lat: -24.3400, lng: -46.9750, elevacao: 120, label: 'Trecho de Serra Guaraú' }},
        {{ lat: -24.3550, lng: -46.9600, elevacao: 234, label: 'Mirante / Poda' }},
        {{ lat: -24.3700, lng: -46.9500, elevacao: 15, label: 'Estação Guaraú' }}
      ],
      dificuldades: [
        {{ id: 'd1', tipo: 'Vegetação Densa / Poda Necessária', lat: -24.3400, lng: -46.9750, descricao: 'Galhos sobre a fibra óptica exigindo poda técnica.', foto: '' }},
        {{ id: 'd2', tipo: 'Poste em Área Inclinada', lat: -24.3550, lng: -46.9600, descricao: 'Terreno com forte desnível (+234m).', foto: '' }}
      ],
      fotos: [
        {{ id: 'f1', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80', legenda: 'Estação Técnica Guaraú', data: '2026-09-16' }},
        {{ id: 'f2', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80', legenda: 'Trecho de Vegetação', data: '2026-09-16' }},
        {{ id: 'f3', url: 'https://images.unsplash.com/photo-1511497584788-876761c119ee?auto=format&fit=crop&w=600&q=80', legenda: 'Travessia de Cabo', data: '2026-09-16' }}
      ],
      comentarios: [
        {{ id: 'c1', autor: 'Paulo Roberto', texto: 'Trilha inspecionada. Poda autorizada para próxima terça-feira.', data: '2026-09-16 16:20' }}
      ],
      aplausos: 14,
      criadoPor: 'william bispo',
      criadoEm: '2026-09-16 14:30'
    }},
    {{
      id: 'rot_2',
      nome: '#2055 Poda e Roçada Santos - Cubatão',
      tipo: 'Levantamento Técnico',
      status: 'Concluída',
      distanciaKm: 9.38,
      desnivelPositivo: 21,
      desnivelNegativo: 26,
      elevacaoMax: 34,
      elevacaoMin: 6,
      dificuldade: 'Fácil',
      trailRank: 8,
      autor: 'william bispo',
      caboNome: 'TR73 (CAO.SJ -> GJA.VC)',
      cidade: 'Cubatão / SP',
      pontosGps: [
        {{ lat: -23.8504, lng: -46.3837, elevacao: 10, label: 'Central Cubatão (CAO.SJ)' }},
        {{ lat: -23.8900, lng: -46.3500, elevacao: 25, label: 'Margem Piaçaguera' }},
        {{ lat: -23.9500, lng: -46.3200, elevacao: 15, label: 'Chegada Guarujá' }}
      ],
      dificuldades: [
        {{ id: 'd3', tipo: 'Travessia de Canal / Rodovia', lat: -23.8900, lng: -46.3500, descricao: 'Cruzamento com rodovia Dutra exige autorização.', foto: '' }}
      ],
      fotos: [],
      comentarios: [],
      aplausos: 8,
      criadoPor: 'william bispo',
      criadoEm: '2026-09-15 10:15'
    }}
  ],

  usuarios: [
    {{ id: 'usr_william', nome: 'william bispo', email: 'william.spc@vivo.com.br', cargo: 'Analista de Backbone SR', area: 'Rede Externa & Planta Interna', status: 'Ativo', role: 'Admin' }},
    {{ id: 'usr_paulo', nome: 'Paulo', email: 'paulo.externa@vivo.com.br', cargo: 'Técnico de Campo', area: 'Rede Externa', status: 'Ativo', role: 'Operador' }},
    {{ id: 'usr_rafael', nome: 'Rafael', email: 'rafael.externa@vivo.com.br', cargo: 'Técnico de Campo', area: 'Rede Externa', status: 'Ativo', role: 'Operador' }},
    {{ id: 'usr_vinicius', nome: 'Vinicius', email: 'vinicius.externa@vivo.com.br', cargo: 'Técnico de Campo', area: 'Rede Externa', status: 'Ativo', role: 'Operador' }},
    {{ id: 'usr_jefferson', nome: 'Jefferson', email: 'jefferson.interna@vivo.com.br', cargo: 'Especialista Planta Interna', area: 'Planta Interna', status: 'Ativo', role: 'Operador' }},
    {{ id: 'usr_erisvcelton', nome: 'Erisvcelton', email: 'erisvcelton.interna@vivo.com.br', cargo: 'Especialista Planta Interna', area: 'Planta Interna', status: 'Ativo', role: 'Operador' }},
    {{ id: 'usr_sidney', nome: 'Sidney', email: 'sidney.interna@vivo.com.br', cargo: 'Especialista Planta Interna', area: 'Planta Interna', status: 'Ativo', role: 'Operador' }}
  ],

  avisos: [
    {{ id: 'av_1', titulo: 'Base de Centrais & Cabos Atualizada', conteudo: '1.516 centrais e 127 troncos de cabos importados com sucesso das planilhas Google Sheets.', data: '2026-09-17' }}
  ],

  atividades: [
    {{ id: 'act_1', usuario: 'william bispo', acao: 'Importação de Dados', detalhes: 'Base de dados alimentada com planilhas Google Sheets.', timestamp: '2026-09-17 14:30' }}
  ]
}};

export function loadBBRData() {{
  try {{
    // Clear legacy keys from older versions to free up localStorage quota
    ['backbone_bbr_data_v1', 'backbone_bbr_data_v2', 'backbone_bbr_data_v3', 'backbone_bbr_data_v4', 'backbone_bbr_data_v5', 'backbone_bbr_data_v6_sheets_full'].forEach(k => {{
      try {{ localStorage.removeItem(k); }} catch(e) {{}}
    }});

    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {{
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.centrais) && parsed.centrais.length >= 100 && Array.isArray(parsed.cabos) && parsed.cabos.length >= 50) {{
        return {{ ...DADOS_INICIAIS_BBR, ...parsed }};
      }}
    }}
  }} catch (e) {{
    console.error('Erro ao ler localStorage do BBR:', e);
  }}

  return DADOS_INICIAIS_BBR;
}}

export function saveBBRData(data) {{
  try {{
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }} catch (e) {{
    console.warn('Aviso: localStorage quota excedida ou indisponível. Dados mantidos na memória.', e);
  }}
}}

export function resetBBRData() {{
  try {{
    localStorage.removeItem(STORE_KEY);
  }} catch (e) {{
    console.error('Erro ao resetar localStorage do BBR:', e);
  }}
  return DADOS_INICIAIS_BBR;
}}

export const getBBRStore = loadBBRData;
export const setBBRStore = saveBBRData;
"""

with open('src/lib/bbrStore.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Updated src/lib/bbrStore.js v7 successfully!")
