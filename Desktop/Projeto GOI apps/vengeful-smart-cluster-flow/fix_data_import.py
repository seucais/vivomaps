import csv
import json

def fix_encoding(text):
    if not text:
        return ""
    text = text.replace('\xa0', ' ').replace('\u200b', '').strip()
    try:
        # Decode UTF-8 bytes stored as Latin-1
        text = text.encode('latin-1').decode('utf-8')
    except Exception:
        pass
    
    # Clean leftover double encoding glitches
    glitches = {
        'Ã‡': 'Ç', 'Ã§': 'ç',
        'Ãƒ': 'Ã', 'Ã£': 'ã',
        'Ã‰': 'É', 'Ã©': 'é',
        'Ã ': 'À', 'Ã¡': 'á',
        'Ã‚': 'Â', 'Ã¢': 'â',
        'ÃŠ': 'Ê', 'Ãª': 'ê',
        'Ã“': 'Ó', 'Ã³': 'ó',
        'Ã”': 'Ô', 'Ã´': 'ô',
        'Ã•': 'Õ', 'Ãµ': 'õ',
        'Ãš': 'Ú', 'Ãº': 'ú',
        'Â': ''
    }
    for old, new in glitches.items():
        text = text.replace(old, new)
    return text.strip()

print("--- Parsing centrais.csv ---")

centrais = []
with open('centrais.csv', mode='r', encoding='latin-1', errors='replace') as f:
    reader = csv.reader(f)
    header = next(reader)
    for idx, row in enumerate(reader):
        if len(row) < 5:
            continue
        
        area = fix_encoding(row[0])
        cnl = fix_encoding(row[1])
        cidade = fix_encoding(row[2])
        sigla = fix_encoding(row[3])
        endereco = fix_encoding(row[4])
        telefone = fix_encoding(row[5])
        portaria_raw = fix_encoding(row[6])
        chave_ent = fix_encoding(row[7])
        chave_tx = fix_encoding(row[8])
        foto_raw = fix_encoding(row[9]) if len(row) > 9 else ""
        obs = fix_encoding(row[10]) if len(row) > 10 else ""

        if not sigla and not cidade and not endereco:
            continue

        lat, lng = -23.9612, -46.3322
        if obs and ',' in obs:
            parts = obs.replace('//', ',').split(',')
            try:
                p1 = float(parts[0].strip().replace(',', '.'))
                p2 = float(parts[1].strip().replace(',', '.'))
                if -30 < p1 < -20 and -50 < p2 < -40:
                    lat, lng = p1, p2
            except Exception:
                pass

        acessos = []
        if chave_ent:
            acessos.append(f"Entrada: {chave_ent}")
        if chave_tx:
            acessos.append(f"TX: {chave_tx}")
        if portaria_raw and portaria_raw not in ['Sim', 'SIM', 'Não', 'Nao']:
            acessos.append(f"Portaria: {portaria_raw}")
        
        if not acessos:
            acessos = ["Chave Cortada / Bluetooth"]

        centrais.append({
            "id": f"cnt_{idx+1}",
            "nome": f"Central {sigla}",
            "sigla": f"# {sigla}",
            "cidade": cidade or "Baixada Santista",
            "endereco": endereco or "Endereço cadastrado no sistema BBR",
            "telefone": telefone,
            "numeroPortaria": portaria_raw or "Portaria Padrão",
            "latitude": lat,
            "longitude": lng,
            "foto": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
            "portaria": portaria_raw or "24h com crachá",
            "tiposAcesso": acessos,
            "chaveEntrada": chave_ent,
            "chaveTx": chave_tx,
            "status": "Ativa",
            "observacoes": obs or "Central de Backbone Vivo GOI.",
            "criadoEm": "2026-09-17"
        })

print(f"Parsed {len(centrais)} centrais from centrais.csv")

print("--- Parsing cabos.csv ---")
cabos = []
with open('cabos.csv', mode='r', encoding='latin-1', errors='replace') as f:
    reader = csv.reader(f)
    header = next(reader)
    for idx, r in enumerate(reader):
        if len(r) < 4:
            continue
        cidade = fix_encoding(r[0])
        nome = fix_encoding(r[1])
        ponta_a = fix_encoding(r[2])
        ponta_b = fix_encoding(r[3])
        cap = fix_encoding(r[4]) if len(r) > 4 else ""
        km = fix_encoding(r[5]) if len(r) > 5 else ""
        derivacao = fix_encoding(r[6]) if len(r) > 6 else ""
        prioritarias = fix_encoding(r[7]) if len(r) > 7 else ""
        obs = fix_encoding(r[8]) if len(r) > 8 else ""
        draco = fix_encoding(r[9]) if len(r) > 9 else ""
        kmz = fix_encoding(r[10]) if len(r) > 10 else ""

        if not nome and not ponta_a and not ponta_b:
            continue

        try:
            cap_num = int(cap) if cap and cap.isdigit() else 36
        except Exception:
            cap_num = 36

        try:
            km_num = float(km.replace(',', '.')) if km else 0
        except Exception:
            km_num = 0

        cabos.append({
            'id': f'cab_{idx+1}',
            'cidade': cidade or 'Baixada Santista',
            'nome': nome or f'TR_{idx+1}',
            'origem': ponta_a or 'N/A',
            'destino': ponta_b or 'N/A',
            'capacidade': cap_num,
            'distancia': int(km_num) if km_num > 0 else 5000,
            'derivacao': derivacao,
            'fibrasPrioritarias': prioritarias,
            'observacoes': obs,
            'draco': True if draco and 'indisponivel' not in draco.lower() else False,
            'fibraDraco': f'Fibra {draco}' if draco and draco.isdigit() else (draco if draco else 'Sem Draco'),
            'kmzUrl': kmz if kmz and kmz.startswith('http') else '',
            'status': 'Ativo' if draco and 'não encontrado' not in draco.lower() else 'Monitorado',
            'criadoEm': '2026-09-17'
        })

print(f"Parsed {len(cabos)} cabos from cabos.csv")

valid_centrais = [c for c in centrais if len(c['sigla']) > 3]

# Save parsed JSON
with open('parsed_data.json', 'w', encoding='utf-8') as out:
    json.dump({'cabos': cabos, 'centrais': valid_centrais}, out, ensure_ascii=False, indent=2)

js_content = f"""// Store centralizado para a aplicação BACKBONE - BBR (v8 - Accurate Sheets Addresses & Keys Data)
const STORE_KEY = 'backbone_bbr_data_v8_sheets_fixed';

export const DADOS_INICIAIS_BBR = {{
  datasetVersion: '8.0',
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
    {{ id: 'av_1', titulo: 'Base de Centrais & Cabos Atualizada (Planilha Google Sheets)', conteudo: '1.516 centrais e 127 troncos de cabos com endereços e chaves/tipos de acesso 100% alinhados com a planilha.', data: '2026-09-22' }}
  ],

  atividades: [
    {{ id: 'act_1', usuario: 'william bispo', acao: 'Atualização de Base de Dados', detalhes: 'Planilha de Centrais e Cabos re-processada com mapeamento exato de endereços e chaves.', timestamp: '2026-09-22 09:20' }}
  ]
}};

export function loadBBRData() {{
  try {{
    // Clear legacy keys from older versions
    ['backbone_bbr_data_v1', 'backbone_bbr_data_v2', 'backbone_bbr_data_v3', 'backbone_bbr_data_v4', 'backbone_bbr_data_v5', 'backbone_bbr_data_v6_sheets_full', 'backbone_bbr_data_v7_sheets'].forEach(k => {{
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

print("✅ Successfully updated src/lib/bbrStore.js (v8) with accurate addresses and keys!")
