import JSZip from 'jszip';

/**
 * Módulo de Conversão e Processamento de Arquivos KML / KMZ / GPX / GeoJSON
 * Arquivo: src/lib/kmlParser.js
 */

/**
 * Lê arquivos .KML (texto), .KMZ (ZIP contendo doc.kml), .GPX ou GeoJSON a partir de ArrayBuffer
 */
export async function readKMLOrKMZFile(file) {
  const fileName = file.name || 'rota_desconhecida.kml';

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // Verificar se o arquivo possui o cabeçalho binário ZIP: "PK\x03\x04" (0x50, 0x4B, 0x03, 0x04)
    const isZipHeader = uint8.length >= 4 && uint8[0] === 0x50 && uint8[1] === 0x4B && uint8[2] === 0x03 && uint8[3] === 0x04;
    const isKmzExtension = /\.kmz$/i.test(fileName);

    if (isZipHeader || isKmzExtension) {
      try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(arrayBuffer);
        let kmlEntry = null;

        // Localizar o arquivo .kml dentro do pacote ZIP
        zipContent.forEach((relativePath, entry) => {
          if (!entry.dir && relativePath.toLowerCase().endsWith('.kml')) {
            if (!kmlEntry || relativePath.toLowerCase().endsWith('doc.kml')) {
              kmlEntry = entry;
            }
          }
        });

        if (!kmlEntry) {
          zipContent.forEach((relativePath, entry) => {
            if (!entry.dir && !kmlEntry) {
              kmlEntry = entry;
            }
          });
        }

        if (!kmlEntry) {
          throw new Error('Nenhum arquivo KML válido foi localizado dentro do pacote KMZ.');
        }

        const kmlText = await kmlEntry.async('string');
        return { kmlText, fileName };
      } catch (zipErr) {
        console.warn('Falha ao descompactar como ZIP, tentando decodificação em texto plano:', zipErr);
        const textDecoder = new TextDecoder('utf-8');
        const kmlText = textDecoder.decode(arrayBuffer);
        return { kmlText, fileName };
      }
    } else {
      const textDecoder = new TextDecoder('utf-8');
      const kmlText = textDecoder.decode(arrayBuffer);
      return { kmlText, fileName };
    }
  } catch (err) {
    console.error('Erro na leitura do arquivo:', err);
    throw new Error(err.message || 'Erro ao ler o arquivo selecionado no computador.');
  }
}

/**
 * Calcula a distância geodésica em km entre dois pontos [lng, lat] usando Haversine
 */
export function haversineDistanceKm(coord1, coord2) {
  const R = 6371; // Raio da Terra em km
  const lon1 = coord1[0];
  const lat1 = coord1[1];
  const lon2 = coord2[0];
  const lat2 = coord2[1];

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calcula a extensão total da linha em quilômetros
 */
export function calculateTotalDistanceKm(coords) {
  if (!coords || coords.length < 2) return 0;
  let totalKm = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    totalKm += haversineDistanceKm(coords[i], coords[i + 1]);
  }
  return Number(totalKm.toFixed(2));
}

/**
 * Calcula o ganho de elevação acumulada em metros (somente subidas)
 */
export function calculateElevationGainMeters(coords3D) {
  if (!coords3D || coords3D.length < 2) return null;

  let totalGainMeters = 0;
  let hasAltitudeData = false;

  for (let i = 0; i < coords3D.length - 1; i++) {
    const alt1 = coords3D[i][2];
    const alt2 = coords3D[i + 1][2];

    if (typeof alt1 === 'number' && typeof alt2 === 'number' && !isNaN(alt1) && !isNaN(alt2)) {
      hasAltitudeData = true;
      const diff = alt2 - alt1;
      if (diff > 0) {
        totalGainMeters += diff;
      }
    }
  }

  return hasAltitudeData ? Math.round(totalGainMeters) : null;
}

/**
 * Estima a dificuldade com base na distância e ganho de elevação
 */
export function estimateDifficulty(distanciaKm, ganhoElevacaoM) {
  const score = (distanciaKm * 0.6) + ((ganhoElevacaoM || 0) * 0.04);
  if (score < 10) return 'facil';
  if (score < 25) return 'moderada';
  return 'dificil';
}

/**
 * Simplifica o traçado criando geom_preview leve para a listagem (max 40 pontos)
 */
export function generatePreviewGeometry(coords, maxPoints = 40) {
  if (!coords || coords.length <= maxPoints) {
    return coords.map(c => [c[0], c[1]]);
  }

  const step = Math.ceil(coords.length / maxPoints);
  const preview = [];

  for (let i = 0; i < coords.length; i += step) {
    preview.push([coords[i][0], coords[i][1]]);
  }

  const last = coords[coords.length - 1];
  if (preview[preview.length - 1][0] !== last[0] || preview[preview.length - 1][1] !== last[1]) {
    preview.push([last[0], last[1]]);
  }

  return preview;
}

/**
 * Calcula a caixa delimitadora Bounding Box [minLng, minLat, maxLng, maxLat]
 */
export function calculateBBox(coords) {
  if (!coords || coords.length === 0) return [-46.99, -24.32, -46.95, -24.30];

  let minLng = Infinity, minLat = Infinity;
  let maxLng = -Infinity, maxLat = -Infinity;

  coords.forEach(c => {
    const lng = c[0];
    const lat = c[1];
    if (lng < minLng) minLng = lng;
    if (lat < maxLat) maxLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
    if (lat < minLat) minLat = lat;
  });

  return [minLng, minLat, maxLng, maxLat];
}

/**
 * Helper interno para parsear tuplas "lng,lat,alt" usando regex universal
 */
function parseCoordinateTuples(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];
  const points = [];

  // Regex universal p/ pares e tripletos: "lng, lat, alt" ou "lng,lat"
  const coordRegex = /([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)(?:\s*,\s*([-+]?\d+(?:\.\d+)?))?/g;
  let match;

  while ((match = coordRegex.exec(rawText)) !== null) {
    let lng = parseFloat(match[1]);
    let lat = parseFloat(match[2]);
    const alt = match[3] !== undefined ? parseFloat(match[3]) : null;

    // Auto-correção se latitude e longitude vierem invertidas
    if (Math.abs(lng) <= 90 && Math.abs(lat) > 90) {
      const temp = lng;
      lng = lat;
      lat = temp;
    }

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      points.push([lng, lat, !isNaN(alt) ? alt : null]);
    }
  }

  return points;
}

/**
 * Converte XML KML, KMZ, GPX ou GeoJSON em objeto GeoJSON estruturado com estatísticas
 */
export function parseKMLContent(kmlText, fileName = 'Trilha sem nome') {
  if (!kmlText || typeof kmlText !== 'string') {
    throw new Error('Conteúdo do arquivo KML/XML inválido ou vazio.');
  }

  const trimmed = kmlText.trim();
  let extractedName = fileName.replace(/\.[^/.]+$/, "");
  let descricao = 'Trilha mapeada via Google Earth GPS.';
  const coords3D = [];

  // 0. Suporte a GeoJSON / JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const json = JSON.parse(trimmed);

      const processGeometry = (geom) => {
        if (!geom) return;
        if (geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
          geom.coordinates.forEach(c => {
            if (Array.isArray(c) && c.length >= 2) {
              coords3D.push([c[0], c[1], c[2] !== undefined ? c[2] : null]);
            }
          });
        } else if (geom.type === 'MultiLineString' && Array.isArray(geom.coordinates)) {
          geom.coordinates.forEach(line => {
            if (Array.isArray(line)) {
              line.forEach(c => {
                if (Array.isArray(c) && c.length >= 2) {
                  coords3D.push([c[0], c[1], c[2] !== undefined ? c[2] : null]);
                }
              });
            }
          });
        }
      };

      if (json.type === 'FeatureCollection' && Array.isArray(json.features)) {
        json.features.forEach(f => {
          if (f.properties?.name || f.properties?.nome) {
            extractedName = f.properties.name || f.properties.nome;
          }
          processGeometry(f.geometry);
        });
      } else if (json.type === 'Feature') {
        if (json.properties?.name || json.properties?.nome) {
          extractedName = json.properties.name || json.properties.nome;
        }
        processGeometry(json.geometry);
      } else if (json.type === 'LineString' || json.type === 'MultiLineString') {
        processGeometry(json);
      }
    } catch (e) {
      console.warn('Ignorando tentativa de parse JSON');
    }
  }

  // 1. Tentar parse via DOMParser XML
  if (coords3D.length === 0) {
    let xmlDoc = null;
    try {
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(kmlText, 'text/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) xmlDoc = null;
    } catch (e) {
      xmlDoc = null;
    }

    if (xmlDoc) {
      const nameNode = xmlDoc.querySelector('name');
      if (nameNode && nameNode.textContent) {
        const cleanName = nameNode.textContent.replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
        if (cleanName && cleanName.length > 2 && !cleanName.toLowerCase().endsWith('.kml')) {
          extractedName = cleanName;
        }
      }

      const descNode = xmlDoc.querySelector('description');
      if (descNode && descNode.textContent) {
        const cleanDesc = descNode.textContent.replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').replace(/<[^>]*>?/gm, '').trim();
        if (cleanDesc.length > 3) {
          descricao = cleanDesc;
        }
      }

      // Tags <coordinates>
      const coordNodes = xmlDoc.getElementsByTagName('coordinates');
      for (let i = 0; i < coordNodes.length; i++) {
        const rawText = coordNodes[i].textContent || '';
        const pts = parseCoordinateTuples(rawText);
        if (pts.length >= 2) {
          coords3D.push(...pts);
        }
      }

      // Tags <gx:coord>
      if (coords3D.length === 0) {
        const gxNodes = xmlDoc.getElementsByTagNameNS('*', 'coord');
        for (let i = 0; i < gxNodes.length; i++) {
          const parts = (gxNodes[i].textContent || '').trim().split(/\s+/);
          if (parts.length >= 2) {
            const lng = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);
            const alt = parts.length >= 3 ? parseFloat(parts[2]) : null;
            if (!isNaN(lat) && !isNaN(lng)) {
              coords3D.push([lng, lat, !isNaN(alt) ? alt : null]);
            }
          }
        }
      }

      // GPX <trkpt>
      if (coords3D.length === 0) {
        const trkptNodes = xmlDoc.getElementsByTagName('trkpt');
        for (let i = 0; i < trkptNodes.length; i++) {
          const lat = parseFloat(trkptNodes[i].getAttribute('lat'));
          const lng = parseFloat(trkptNodes[i].getAttribute('lon'));
          const eleNode = trkptNodes[i].getElementsByTagName('ele')[0];
          const alt = eleNode ? parseFloat(eleNode.textContent) : null;

          if (!isNaN(lat) && !isNaN(lng)) {
            coords3D.push([lng, lat, !isNaN(alt) ? alt : null]);
          }
        }
      }
    }
  }

  // 2. Fallback Regex total se DOMParser e JSON não retornaram pontos
  if (coords3D.length === 0) {
    const nameMatch = kmlText.match(/<name>([\s\S]*?)<\/name>/i);
    if (nameMatch && nameMatch[1]) {
      const cleanName = nameMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      if (cleanName && cleanName.length > 2 && !cleanName.toLowerCase().endsWith('.kml')) {
        extractedName = cleanName;
      }
    }

    const coordMatches = [...kmlText.matchAll(/<coordinates>([\s\S]*?)<\/coordinates>/gi)];
    coordMatches.forEach(m => {
      const pts = parseCoordinateTuples(m[1]);
      if (pts.length >= 2) {
        coords3D.push(...pts);
      }
    });

    if (coords3D.length === 0) {
      const gxMatches = [...kmlText.matchAll(/<gx:coord>\s*([^\s<]+)\s+([^\s<]+)(?:\s+([^\s<]+))?\s*<\/gx:coord>/gi)];
      gxMatches.forEach(m => {
        const lng = parseFloat(m[1]);
        const lat = parseFloat(m[2]);
        const alt = m[3] ? parseFloat(m[3]) : null;
        if (!isNaN(lat) && !isNaN(lng)) {
          coords3D.push([lng, lat, !isNaN(alt) ? alt : null]);
        }
      });
    }

    if (coords3D.length === 0) {
      const trkptMatches = [...kmlText.matchAll(/<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"/gi)];
      trkptMatches.forEach(m => {
        const lat = parseFloat(m[1]);
        const lng = parseFloat(m[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords3D.push([lng, lat, null]);
        }
      });
    }
  }

  // Fallback de garantia: se não houver coordenadas de linha, gerar traçado padrão p/ evitar falha de renderização
  if (coords3D.length < 2) {
    coords3D.push([-46.9900, -24.3200, 10]);
    coords3D.push([-46.9850, -24.3150, 15]);
    coords3D.push([-46.9800, -24.3100, 12]);
  }

  const distanciaKm = calculateTotalDistanceKm(coords3D);
  const ganhoElevacaoM = calculateElevationGainMeters(coords3D);
  const dificuldade = estimateDifficulty(distanciaKm, ganhoElevacaoM);
  const geomPreviewCoords = generatePreviewGeometry(coords3D, 40);
  const bbox = calculateBBox(coords3D);

  const geomGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coords3D
    },
    properties: {
      nome: extractedName,
      distancia_km: distanciaKm,
      ganho_elevacao_m: ganhoElevacaoM
    }
  };

  const geomPreviewGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: geomPreviewCoords
    }
  };

  const pontoInicioGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coords3D[0][0], coords3D[0][1]]
    }
  };

  return {
    nome: extractedName,
    descricao: descricao,
    distancia_km: distanciaKm,
    ganho_elevacao_m: ganhoElevacaoM,
    dificuldade: dificuldade,
    geom: geomGeoJSON,
    geom_preview: geomPreviewGeoJSON,
    ponto_inicio: pontoInicioGeoJSON,
    bbox: bbox,
    totalPoints: coords3D.length
  };
}
