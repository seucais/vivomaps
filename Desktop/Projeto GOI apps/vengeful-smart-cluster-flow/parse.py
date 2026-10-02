import csv
import json

def fix_encoding(text):
    if not text:
        return ""
    text = text.strip()
    # Replace broken UTF-8 byte patterns from double encoding
    replacements = {
        'Ã‡': 'Ç', 'Ã§': 'ç',
        'Ãƒ': 'Ã', 'Ã£': 'ã',
        'Ã‰': 'É', 'Ã©': 'é',
        'Ã ': 'À', 'Ã¡': 'á',
        'Ã‚': 'Â', 'Ã¢': 'â',
        'ÃŠ': 'Ê', 'Ãª': 'ê',
        'Ã': 'Í', 'Ã­': 'í',
        'Ã“': 'Ó', 'Ã³': 'ó',
        'Ã”': 'Ô', 'Ã´': 'ô',
        'Ã•': 'Õ', 'Ãµ': 'õ',
        'Ãš': 'Ú', 'Ãº': 'ú',
        'Â': ''
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

cabos = []
with open('cabos.csv', mode='r', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    for idx, r in enumerate(reader):
        cidade = fix_encoding(r.get('CIDADE'))
        nome = fix_encoding(r.get('CABO'))
        ponta_a = fix_encoding(r.get('PONTA A'))
        ponta_b = fix_encoding(r.get('PONTA B'))
        cap = fix_encoding(r.get('CAP'))
        km = fix_encoding(r.get('KM'))
        derivacao = fix_encoding(r.get('DERIVACAO'))
        prioritarias = fix_encoding(r.get('PRIORITARIAS'))
        obs = fix_encoding(r.get('OBSERVACAO'))
        draco = fix_encoding(r.get('DRACO'))
        kmz = fix_encoding(r.get('KMZ'))

        if not nome and not ponta_a and not ponta_b:
            continue

        try:
            cap_num = int(cap) if cap and cap.isdigit() else 36
        except:
            cap_num = 36

        try:
            km_num = float(km.replace(',', '.')) if km else 0
        except:
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

print(f'Parsed {len(cabos)} cabos')

centrais = []
with open('centrais.csv', mode='r', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    for idx, r in enumerate(reader):
        cidade = fix_encoding(r.get('CIDADE'))
        sigla = fix_encoding(r.get('SIGLA'))
        endereco = fix_encoding(r.get('ENDEREÇO') or r.get('ENDEREÃ‡O'))
        telefone = fix_encoding(r.get('TELEFONE'))
        portaria_ass = fix_encoding(r.get('PORT. ASS.'))
        chave_ent = fix_encoding(r.get('CHAVE_ ENT'))
        chave_tx = fix_encoding(r.get('CHAVE _TX'))
        obs = fix_encoding(r.get('OBS'))

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
            except:
                pass

        acessos = []
        if chave_ent:
            acessos.append(f'Entrada: {chave_ent}')
        if chave_tx:
            acessos.append(f'TX: {chave_tx}')
        if not acessos:
            acessos = ['Chave Cortada / Bluetooth']

        centrais.append({
            'id': f'cnt_{idx+1}',
            'nome': f'Central {sigla}',
            'sigla': f'# {sigla}',
            'cidade': cidade or 'Baixada Santista',
            'endereco': endereco or 'Endereço cadastrado no sistema BBR',
            'telefone': telefone,
            'numeroPortaria': portaria_ass or 'Portaria Padrão',
            'latitude': lat,
            'longitude': lng,
            'foto': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
            'portaria': portaria_ass or '24h com crachá',
            'tiposAcesso': acessos,
            'chaveEntrada': chave_ent,
            'chaveTx': chave_tx,
            'status': 'Ativa',
            'observacoes': obs or 'Central de Backbone Vivo GOI.',
            'criadoEm': '2026-09-17'
        })

print(f'Parsed {len(centrais)} centrais')

with open('parsed_data.json', 'w', encoding='utf-8') as out:
    json.dump({'cabos': cabos, 'centrais': centrais}, out, ensure_ascii=False, indent=2)
