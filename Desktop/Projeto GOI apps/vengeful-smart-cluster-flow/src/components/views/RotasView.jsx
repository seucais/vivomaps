import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parseKMLContent, readKMLOrKMZFile } from '@/lib/kmlParser';
import ModalConfirmarExclusao from '@/components/modals/ModalConfirmarExclusao';
import { 
  Route as RouteIcon, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Compass, 
  ExternalLink, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Star, 
  Send, 
  ArrowRight, 
  Bookmark, 
  TrendingUp, 
  Layers, 
  X, 
  Save, 
  Navigation, 
  Eye, 
  Download,
  Check,
  CheckCircle,
  Globe,
  Upload,
  FileText,
  Plus,
  Flag
} from 'lucide-react';

export function downloadKmlRoute(rota) {
  const points = rota?.pontosGps || [
    { lat: -24.3200, lng: -46.9900, elevacao: 12 },
    { lat: -24.3400, lng: -46.9750, elevacao: 120 },
    { lat: -24.3550, lng: -46.9600, elevacao: 234 },
    { lat: -24.3700, lng: -46.9500, elevacao: 15 }
  ];

  const coordStr = points.map(p => `${p.lng},${p.lat},${p.elevacao || 0}`).join('\n          ');

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${(rota?.nome || 'Rota_Vivo_Backbone').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</name>
    <description>Trajeto de Fibra Óptica Vivo Backbone: ${rota?.origem || 'Ponta A'} X ${rota?.destino || 'Ponta B'}</description>
    <Style id="vivoRouteStyle">
      <LineStyle>
        <color>ff0099ff</color>
        <width>6</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>${rota?.nome || 'Trajeto'}</name>
      <styleUrl>#vivoRouteStyle</styleUrl>
      <LineString>
        <extrude>1</extrude>
        <tessellate>1</tessellate>
        <coordinates>
          ${coordStr}
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;

  const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(rota?.nome || 'rota_google_earth').replace(/[^a-zA-Z0-9]/g, '_')}.kml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function openGoogleEarth3DWeb(rota) {
  const center = rota?.pontosGps?.[0] || { lat: -24.32, lng: -46.99 };
  const earthUrl = `https://earth.google.com/web/@${center.lat},${center.lng},500a,2000d,35y,0h,45t,0r`;
  window.open(earthUrl, '_blank', 'noopener,noreferrer');
}

export class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MapErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-3">
          <div className="text-rose-600 dark:text-rose-400 font-bold text-sm">
            ⚠️ Ocorreu um alerta ao carregar o mapa interativo.
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {this.state.error?.message || 'Falha na renderização de coordenadas do mapa.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Tentar Recarregar Mapa
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function GoogleEarthMapContainer({ rota, sliderPosition = 50, subTrechoRange = null, onSubTrechoChange, onUpdateRota }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const cursorMarkerRef = useRef(null);
  const subTrechoPolylineRef = useRef(null);
  const isDraggingMarkerRef = useRef(false);

  const [viewMode, setViewMode] = useState('satelite_hd'); // 'satelite_hd' | 'earth_3d'
  const [mapLayer, setMapLayer] = useState('google_hybrid'); // 'google_hybrid' | 'esri_satelite' | 'osm'
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);

  // Extract lat/lng coordinates array safely from rota
  const getRouteCoords = () => {
    const valid = [];

    if (Array.isArray(rota?.pontosGps) && rota.pontosGps.length >= 2) {
      rota.pontosGps.forEach(p => {
        if (p) {
          const lat = typeof p.lat === 'number' ? p.lat : Array.isArray(p) ? Number(p[1]) : parseFloat(p.lat);
          const lng = typeof p.lng === 'number' ? p.lng : Array.isArray(p) ? Number(p[0]) : parseFloat(p.lng);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            valid.push([lat, lng]);
          }
        }
      });
    }

    if (valid.length < 2 && Array.isArray(rota?.geom?.geometry?.coordinates)) {
      rota.geom.geometry.coordinates.forEach(c => {
        if (Array.isArray(c) && c.length >= 2) {
          const lng = parseFloat(c[0]);
          const lat = parseFloat(c[1]);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            valid.push([lat, lng]);
          }
        }
      });
    }

    if (valid.length < 2 && Array.isArray(rota?.geom_preview?.geometry?.coordinates)) {
      rota.geom_preview.geometry.coordinates.forEach(c => {
        if (Array.isArray(c) && c.length >= 2) {
          const lng = parseFloat(c[0]);
          const lat = parseFloat(c[1]);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            valid.push([lat, lng]);
          }
        }
      });
    }

    if (valid.length >= 2) {
      return valid;
    }

    // Default fallback coordinates (Peruíbe / SP)
    return [
      [-24.3200, -46.9900],
      [-24.3150, -46.9850],
      [-24.3100, -46.9800]
    ];
  };

  const coords = getRouteCoords();
  const currentDistKm = Number(rota?.distanciaKm) || 12.5;
  const currentCursorKm = subTrechoRange?.endKm !== undefined
    ? Math.min(currentDistKm, Math.max(0, Number(subTrechoRange.endKm)))
    : ((currentDistKm * sliderPosition) / 100);
  const derivedSliderPct = currentDistKm > 0 ? (currentCursorKm / currentDistKm) * 100 : 50;

  // Calculate distance between two points (Haversine formula)
  const calcDistKm = (p1, p2) => {
    const R = 6371;
    const dLat = (p2[0] - p1[0]) * Math.PI / 180;
    const dLon = (p2[1] - p1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(p1[0] * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate cumulative distance and snap any click/drag point to nearest point along route
  const getDistanceAlongRoute = (clickPt, pts, rotaDistKm) => {
    if (!pts || pts.length < 2) return 0;

    const cumDists = [0];
    let totalPathKm = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const d = calcDistKm(pts[i], pts[i + 1]);
      totalPathKm += d;
      cumDists.push(totalPathKm);
    }

    if (totalPathKm === 0) return 0;

    let minDistanceToSegment = Infinity;
    let closestKm = 0;

    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];

      const dx = p2[1] - p1[1];
      const dy = p2[0] - p1[0];
      const lenSq = dx * dx + dy * dy;

      let t = 0;
      if (lenSq > 0) {
        t = ((clickPt[1] - p1[1]) * dx + (clickPt[0] - p1[0]) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
      }

      const projLat = p1[0] + t * dy;
      const projLng = p1[1] + t * dx;

      const distToSeg = calcDistKm(clickPt, [projLat, projLng]);
      if (distToSeg < minDistanceToSegment) {
        minDistanceToSegment = distToSeg;
        const segLen = cumDists[i + 1] - cumDists[i];
        const distAlongPath = cumDists[i] + t * segLen;
        const scaleFactor = (rotaDistKm && rotaDistKm > 0) ? (rotaDistKm / totalPathKm) : 1;
        closestKm = distAlongPath * scaleFactor;
      }
    }

    const finalKm = Math.min(rotaDistKm || totalPathKm, Math.max(0, closestKm));
    return Number(finalKm.toFixed(2));
  };

  // Interpolate position along line for slider (0-100%)
  const getInterpolatedPoint = (pts, pct) => {
    if (!pts || pts.length < 2) return pts?.[0] || [-23.89, -46.42];
    const totalSegments = pts.length - 1;
    const scaledIndex = (pct / 100) * totalSegments;
    const index = Math.min(Math.floor(scaledIndex), totalSegments - 1);
    const fraction = scaledIndex - index;

    const p1 = pts[index];
    const p2 = pts[index + 1] || p1;

    const lat = p1[0] + (p2[0] - p1[0]) * fraction;
    const lng = p1[1] + (p2[1] - p1[1]) * fraction;
    return [lat, lng];
  };

  // 1. Initialize Interactive Leaflet Satellite Map ONLY on route/layer/mode change
  useEffect(() => {
    if (viewMode === 'earth_3d') return;
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      cursorMarkerRef.current = null;
      subTrechoPolylineRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Tile Layer setup
    let tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Google Satellite + Hybrid
    if (mapLayer === 'esri_satelite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapLayer === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw Glowing Polyline + Main Route Line
    L.polyline(coords, {
      color: '#fb923c',
      weight: 14,
      opacity: 0.45,
      lineCap: 'round'
    }).addTo(map);

    const polyline = L.polyline(coords, {
      color: '#f97316',
      weight: 7,
      opacity: 0.95,
      lineCap: 'round'
    }).addTo(map);

    // Interactive Map & Polyline Click Handler: updates cards instantly
    const handleRoutePointClick = (latlng) => {
      const kmAlong = getDistanceAlongRoute([latlng.lat, latlng.lng], coords, currentDistKm);
      onSubTrechoChange?.({ startKm: 0, endKm: kmAlong, source: 'map' });
    };

    polyline.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      handleRoutePointClick(e.latlng);
    });

    map.on('click', (e) => {
      handleRoutePointClick(e.latlng);
    });

    // Start Marker (Ponta A) 🟢
    const startPt = coords[0];
    const startIcon = L.divIcon({
      className: 'start-marker',
      html: `<div style="background:#22c55e; color:white; font-size:10px; font-weight:bold; font-family:sans-serif; padding:3px 8px; border-radius:12px; border:2px solid white; box-shadow:0 0 12px rgba(0,0,0,0.8); white-space:nowrap;">📍 Ponta A (${rota?.origem || 'Origem'})</div>`,
      iconAnchor: [30, 12]
    });
    L.marker(startPt, { icon: startIcon }).addTo(map);

    // End Marker (Ponta B) 🔴
    const endPt = coords[coords.length - 1];
    const endIcon = L.divIcon({
      className: 'end-marker',
      html: `<div style="background:#ef4444; color:white; font-size:10px; font-weight:bold; font-family:sans-serif; padding:3px 8px; border-radius:12px; border:2px solid white; box-shadow:0 0 12px rgba(0,0,0,0.8); white-space:nowrap;">🏁 Ponta B (${rota?.destino || 'Destino'})</div>`,
      iconAnchor: [30, 12]
    });
    L.marker(endPt, { icon: endIcon }).addTo(map);

    // Checkpoint Markers 🚩
    if (Array.isArray(rota?.checkpoints)) {
      rota.checkpoints.forEach((cp, idx) => {
        const lat = parseFloat(cp.lat);
        const lng = parseFloat(cp.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          const cpIcon = L.divIcon({
            className: 'checkpoint-marker',
            html: `<div style="background:#f59e0b; color:white; font-size:10px; font-weight:bold; font-family:sans-serif; padding:3px 8px; border-radius:12px; border:2px solid white; box-shadow:0 0 10px rgba(0,0,0,0.8); white-space:nowrap;">🚩 CP${idx + 1}: ${cp.nome || 'Checkpoint'}</div>`,
            iconAnchor: [25, 12]
          });
          L.marker([lat, lng], { icon: cpIcon }).addTo(map);
        }
      });
    }

    // Waypoint Markers 📍
    if (Array.isArray(rota?.waypoints)) {
      rota.waypoints.forEach((wp, idx) => {
        const lat = parseFloat(wp.lat);
        const lng = parseFloat(wp.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          const wpIcon = L.divIcon({
            className: 'waypoint-marker',
            html: `<div style="background:#8b5cf6; color:white; font-size:10px; font-weight:bold; font-family:sans-serif; padding:3px 8px; border-radius:12px; border:2px solid white; box-shadow:0 0 10px rgba(0,0,0,0.8); white-space:nowrap;">📍 WP${idx + 1}: ${wp.nome || 'Waypoint'}</div>`,
            iconAnchor: [25, 12]
          });
          L.marker([lat, lng], { icon: wpIcon }).addTo(map);
        }
      });
    }

    // Fit bounds to polyline
    try {
      const bounds = polyline.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [45, 45] });
      }
    } catch (err) {
      console.error('Fit bounds error:', err);
    }

    // Smooth resize / tile load invalidateSize timer
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        cursorMarkerRef.current = null;
        subTrechoPolylineRef.current = null;
      }
    };
  }, [rota?.id, mapLayer, viewMode]);

  // 2. Dynamically draw/update Cyan Highlight Sub-Trecho on Map without destroying map instance
  useEffect(() => {
    if (viewMode === 'earth_3d') return;
    const map = mapInstanceRef.current;
    if (!map) return;

    if (subTrechoPolylineRef.current) {
      map.removeLayer(subTrechoPolylineRef.current);
      subTrechoPolylineRef.current = null;
    }

    if (subTrechoRange && subTrechoRange.endKm > subTrechoRange.startKm) {
      const totalDist = Number(rota?.distanciaKm) || 29.73;
      const startPct = Math.max(0, Math.min(100, (subTrechoRange.startKm / totalDist) * 100));
      const endPct = Math.max(0, Math.min(100, (subTrechoRange.endKm / totalDist) * 100));

      const pStart = getInterpolatedPoint(coords, startPct);
      const pEnd = getInterpolatedPoint(coords, endPct);

      const totalSegs = coords.length - 1;
      const idxStart = Math.floor((startPct / 100) * totalSegs);
      const idxEnd = Math.ceil((endPct / 100) * totalSegs);

      const subPoints = [pStart];
      for (let i = idxStart + 1; i <= idxEnd && i < coords.length - 1; i++) {
        subPoints.push(coords[i]);
      }
      subPoints.push(pEnd);

      const subPolyline = L.polyline(subPoints, {
        color: '#06b6d4',
        weight: 9,
        opacity: 0.95,
        lineCap: 'round'
      }).addTo(map);

      subTrechoPolylineRef.current = subPolyline;
    }
  }, [subTrechoRange, rota?.id, viewMode]);

  // 3. Synchronize Cursor Marker Position on Map (Draggable to update cards)
  useEffect(() => {
    if (viewMode === 'earth_3d') return;
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!coords || coords.length < 2) return;

    const currentPt = getInterpolatedPoint(coords, derivedSliderPct);

    if (!cursorMarkerRef.current) {
      const cursorIcon = L.divIcon({
        className: 'synced-cursor-marker',
        html: `<div style="position:relative; width:32px; height:32px; cursor:grab;" title="Arraste ao longo do traçado para atualizar os cards">
          <div style="position:absolute; inset:0; background:rgba(37,99,235,0.45); border-radius:50%; animation:ping 1.2s infinite;"></div>
          <div style="position:absolute; top:3px; left:3px; width:26px; height:26px; background:#2563eb; border:3px solid white; border-radius:50%; box-shadow:0 0 16px #2563eb; display:flex; align-items:center; justify-content:center; color:white; font-size:11px; font-weight:bold;">📍</div>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(currentPt, {
        icon: cursorIcon,
        draggable: true,
        zIndexOffset: 1000
      }).addTo(map);

      marker.on('dragstart', () => {
        isDraggingMarkerRef.current = true;
      });

      marker.on('drag', (e) => {
        const latlng = e.target.getLatLng();
        const kmAlong = getDistanceAlongRoute([latlng.lat, latlng.lng], coords, currentDistKm);
        onSubTrechoChange?.({ startKm: 0, endKm: kmAlong, source: 'map' });
      });

      marker.on('dragend', (e) => {
        isDraggingMarkerRef.current = false;
        const latlng = e.target.getLatLng();
        const kmAlong = getDistanceAlongRoute([latlng.lat, latlng.lng], coords, currentDistKm);
        onSubTrechoChange?.({ startKm: 0, endKm: kmAlong, source: 'map' });
      });

      cursorMarkerRef.current = marker;
    } else {
      if (!isDraggingMarkerRef.current) {
        cursorMarkerRef.current.setLatLng(currentPt);
      }
    }
  }, [derivedSliderPct, rota?.id, viewMode]);

  return (
    <div className="w-full h-[520px] rounded-2xl relative overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col">
      {/* MAP HEADER ACTION BAR WITH MODE TABS */}
      <div className="bg-slate-900/95 backdrop-blur-md p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <span>MAPA DA ROTA DE FIBRA ÓPTICA</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono">
                {coords.length > 0 ? `${coords.length} Pontos GPS` : 'Satélite HD'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-300">
              Trajeto: <strong className="text-white">{rota?.origem || 'Ponta A'} ➔ {rota?.destino || 'Ponta B'}</strong> ({(currentDistKm * 1000).toLocaleString('pt-BR')} m / {currentDistKm} km)
            </p>
          </div>
        </div>

        {/* VIEW MODE & PROVIDER SELECTOR */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('satelite_hd')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'satelite_hd' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛰️ Satélite + Trajeto</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('earth_3d')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'earth_3d' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌐 Visão 3D Frame</span>
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER FOR DIRECT UPLOAD */}
      {uploadSuccessMsg && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top z-20">
          <span>{uploadSuccessMsg}</span>
          <button onClick={() => setUploadSuccessMsg(null)} className="text-white hover:text-emerald-200 font-extrabold">✕</button>
        </div>
      )}

      {/* MAP VIEW CONTAINER */}
      <div className="w-full flex-1 relative bg-slate-950">
        {viewMode === 'earth_3d' ? (
          <iframe
            title="Google Earth 3D Map View"
            className="w-full h-full border-0"
            src={`https://maps.google.com/maps?q=${coords[0]?.[0] || -23.89},${coords[0]?.[1] || -46.42}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
          />
        ) : (
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        )}

        {/* MAP LAYER SELECTOR FLOATING ON SATELLITE MODE */}
        {viewMode === 'satelite_hd' && (
          <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-1 text-[11px] font-semibold text-slate-300 pointer-events-auto">
            <button
              type="button"
              onClick={() => setMapLayer('google_hybrid')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${mapLayer === 'google_hybrid' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800'}`}
            >
              🛰️ Google Híbrido
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('esri_satelite')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${mapLayer === 'esri_satelite' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800'}`}
            >
              🌍 Esri Satélite
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('osm')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${mapLayer === 'osm' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800'}`}
            >
              📜 Mapa Base
            </button>
          </div>
        )}

        {/* CURSOR SYNCHRONIZED BADGE */}
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 border border-slate-700 shadow-lg pointer-events-none hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span>Cursor do Gráfico: {Math.round(currentCursorKm * 1000).toLocaleString('pt-BR')} m ({currentCursorKm} km)</span>
        </div>
      </div>
    </div>
  );
}

export const RotaSateliteLeafletMap = GoogleEarthMapContainer;

export function CalculadorTrechoParalelo({ rota, subTrechoRange, onSubTrechoChange }) {
  const distTotal = Number(rota?.distanciaKm) || 29.73;

  // Single source of truth derived directly from subTrechoRange prop
  const currentKm = subTrechoRange?.endKm !== undefined && subTrechoRange?.endKm !== null
    ? Math.min(distTotal, Math.max(0, Number(subTrechoRange.endKm)))
    : Number((distTotal / 2).toFixed(2));

  const [inputDisplayStr, setInputDisplayStr] = useState(() => currentKm.toFixed(2).replace('.', ','));
  const isTypingRef = useRef(false);

  // Sync input string when currentKm changes externally (e.g. from map click/drag or slider)
  useEffect(() => {
    if (!isTypingRef.current) {
      setInputDisplayStr(currentKm.toFixed(2).replace('.', ','));
    }
  }, [currentKm]);

  const updatePontoIntermediario = (valKm, rawStr) => {
    const validKm = Math.min(distTotal, Math.max(0, valKm));
    if (rawStr !== undefined) {
      setInputDisplayStr(rawStr);
    } else {
      setInputDisplayStr(validKm.toFixed(2).replace('.', ','));
    }
    onSubTrechoChange?.({ startKm: 0, endKm: validKm, source: 'calculator' });
  };

  const handleInputChange = (rawVal) => {
    isTypingRef.current = true;
    setInputDisplayStr(rawVal);
    const parsed = parseFloat(rawVal.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) {
      updatePontoIntermediario(parsed, rawVal);
    }
  };

  const handleInputBlur = () => {
    isTypingRef.current = false;
    setInputDisplayStr(currentKm.toFixed(2).replace('.', ','));
  };

  const handleSliderChange = (numVal) => {
    isTypingRef.current = false;
    updatePontoIntermediario(numVal);
  };

  const handleReset = () => {
    isTypingRef.current = false;
    const defaultVal = Number((distTotal / 2).toFixed(2));
    updatePontoIntermediario(defaultVal);
  };

  // Calculations directly derived from currentKm (Always 100% reactive & accurate)
  const distAtePontoX = Math.min(distTotal, Math.max(0, currentKm));
  const distPontoXAteB = Math.max(0, Number((distTotal - distAtePontoX).toFixed(2)));
  const pctPontoX = distTotal > 0 ? Number(((distAtePontoX / distTotal) * 100).toFixed(1)) : 0;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-600" />
            <span>Calculadora Paralelo de Distância do Trecho (Ponta A ➔ Ponta B)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Calcule a distância de qualquer ponto intermediário na extensão da trilha.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Ponto Intermediário (da Ponta A)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputDisplayStr}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 text-xs font-mono font-bold border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Ex: 10,95"
              />
              <span className="text-xs font-bold text-slate-500">km</span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Resetar no Satélite
            </button>
          </div>
        </div>

        {/* Slider Ponto Intermediário */}
        <div className="space-y-1 pt-1">
          <input
            type="range"
            min="0"
            max={distTotal}
            step="0.05"
            value={currentKm}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export function EditarRotaModal({ isOpen, onClose, onSave, rota }) {
  const [formData, setFormData] = useState(() => {
    if (rota) return { ...rota };
    return { nome: '', tipo: 'Rota Cabo', distanciaKm: 5, desnivelPositivo: 50, dificuldade: 'Moderada' };
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-violet-600" />
          <span>Editar Trilha / Rota</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Nome da Trilha / Rota *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Distância (km)</label>
              <input
                type="number"
                step="any"
                value={formData.distanciaKm}
                onChange={(e) => setFormData({ ...formData, distanciaKm: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Desnível+ (m)</label>
              <input
                type="number"
                value={formData.desnivelPositivo || 0}
                onChange={(e) => setFormData({ ...formData, desnivelPositivo: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Dificuldade</label>
            <select
              value={formData.dificuldade || 'Moderada'}
              onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="Fácil">Fácil</option>
              <option value="Moderada">Moderada</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-slate-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl">
              Atualizar Trilha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UploadRotaGoogleEarthModal({ isOpen, onClose, onSave }) {
  const fileInputRef = useRef(null);
  
  const [fileName, setFileName] = useState('');
  const [parsedPointsCount, setParsedPointsCount] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    origem: '',
    destino: '',
    distanciaKm: 12.5,
    tipo: 'Tronco Principal (DWDM)',
    dificuldade: 'Moderada',
    desnivelPositivo: 65,
    descricao: ''
  });

  if (!isOpen) return null;

  // Haversine formula to compute distance from array of coordinates
  const calculateDistanceKm = (coords) => {
    if (!coords || coords.length < 2) return 12.5;
    let totalMeters = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const lat1 = coords[i].lat;
      const lon1 = coords[i].lng;
      const lat2 = coords[i + 1].lat;
      const lon2 = coords[i + 1].lng;

      const R = 6371; // km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalMeters += R * c;
    }
    return Number(totalMeters.toFixed(2));
  };

  const parseKMLorGPXText = (text, nameFromMeta) => {
    const coords = [];
    
    // Check KML <coordinates> tag
    const coordMatch = text.match(/<coordinates>([\s\S]*?)<\/coordinates>/i);
    if (coordMatch && coordMatch[1]) {
      const rawPairs = coordMatch[1].trim().split(/\s+/);
      rawPairs.forEach(pair => {
        const parts = pair.split(',');
        if (parts.length >= 2) {
          const lng = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            coords.push({ lat, lng });
          }
        }
      });
    }

    // Check GPX <trkpt> tags
    if (coords.length === 0) {
      const trkptMatches = [...text.matchAll(/<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"/gi)];
      trkptMatches.forEach(m => {
        const lat = parseFloat(m[1]);
        const lng = parseFloat(m[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords.push({ lat, lng });
        }
      });
    }

    // Extract name from KML <name> tag if present
    const nameMatch = text.match(/<name>([\s\S]*?)<\/name>/i);
    let extractedName = nameFromMeta;
    if (nameMatch && nameMatch[1]) {
      const cleanName = nameMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      if (cleanName && cleanName.length > 2 && !cleanName.includes('.kml')) {
        extractedName = cleanName;
      }
    }

    return { coords, extractedName };
  };

  const [parsedData, setParsedData] = useState(null);

  const processSelectedFile = async (file) => {
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);

    try {
      const { kmlText } = await readKMLOrKMZFile(file);
      const parsed = parseKMLContent(kmlText, file.name);

      setParsedData(parsed);
      setParsedPointsCount(parsed.totalPoints || 0);

      const computedRota = {
        id: `rot_${Date.now()}`,
        nome: parsed.nome || `Trilha ${file.name.replace(/\.[^/.]+$/, "")}`,
        origem: 'Importado do Google Earth',
        destino: 'Importado do Google Earth',
        distanciaKm: Number(parsed.distancia_km || 12.5),
        ganho_elevacao_m: Number(parsed.ganho_elevacao_m || 50),
        desnivelPositivo: Number(parsed.ganho_elevacao_m || 50),
        tipo: 'Tronco Principal (DWDM)',
        dificuldade: parsed.dificuldade === 'facil' ? 'Fácil' : parsed.dificuldade === 'dificil' ? 'Difícil' : 'Moderada',
        kml_path: `storage/kml/${Date.now()}_${file.name}`,
        geom: parsed.geom || null,
        geom_preview: parsed.geom_preview || null,
        ponto_inicio: parsed.ponto_inicio || null,
        pontosGps: parsed.geom?.geometry?.coordinates?.map(c => ({ lat: c[1], lng: c[0], elevacao: c[2] })) || [],
        status: 'Ativa',
        autor: 'william bispo',
        fonteArquivo: file.name,
        comentarios: [
          {
            id: `c_${Date.now()}`,
            autor: 'Google Earth Importer',
            texto: `Rota criada via upload do arquivo ${file.name} (${parsed.totalPoints || 0} pontos GPS).`,
            data: new Date().toISOString().replace('T', ' ').slice(0, 16)
          }
        ],
        fotos: [
          { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80' },
          { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' }
        ]
      };

      onSave(computedRota);
      onClose();
      alert(`🎉 Rota "${computedRota.nome}" (${parsed.totalPoints || 0} pontos GPS) carregada do computador com sucesso!`);
    } catch (err) {
      console.error('Error parsing KML/KMZ file:', err);
      alert(err.message || 'Erro ao processar arquivo KML/KMZ.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome) {
      alert('Preencha o nome da rota.');
      return;
    }

    const newRota = {
      id: `rot_${Date.now()}`,
      nome: formData.nome,
      origem: formData.origem || 'Origem não especificada',
      destino: formData.destino || 'Destino não especificado',
      distanciaKm: Number(formData.distanciaKm || parsedData?.distancia_km || 12),
      ganho_elevacao_m: parsedData?.ganho_elevacao_m ?? Number(formData.desnivelPositivo || 50),
      desnivelPositivo: parsedData?.ganho_elevacao_m ?? Number(formData.desnivelPositivo || 50),
      tipo: formData.tipo || 'Tronco Principal (DWDM)',
      dificuldade: formData.dificuldade || 'Moderada',
      kml_path: fileName ? `storage/kml/${Date.now()}_${fileName}` : null,
      geom: parsedData?.geom || null,
      geom_preview: parsedData?.geom_preview || null,
      ponto_inicio: parsedData?.ponto_inicio || null,
      pontosGps: parsedData?.geom?.geometry?.coordinates?.map(c => ({ lat: c[1], lng: c[0], elevacao: c[2] })) || [],
      status: 'Ativa',
      autor: 'william bispo',
      fonteArquivo: fileName || 'Google Earth KML/KMZ',
      comentarios: [
        {
          id: `c_${Date.now()}`,
          autor: 'Google Earth Importer',
          texto: `Rota criada via upload do arquivo ${fileName || 'KML/KMZ'} (${parsedPointsCount} pontos GPS).`,
          data: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      fotos: [
        { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80' },
        { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' }
      ]
    };

    onSave(newRota);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150 space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-600" />
          <span>Upload de Rota (Google Earth / KML / KMZ / GPX)</span>
        </h3>

        {/* FILE DROPZONE */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="p-6 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-center cursor-pointer transition space-y-2"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="*" 
            className="hidden" 
          />

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs font-bold">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
              {fileName ? `📄 Arquivo selecionado: ${fileName}` : 'Clique para selecionar o arquivo do Google Earth'}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Suporta formatos <strong>.kml</strong>, <strong>.kmz</strong>, <strong>.gpx</strong> e <strong>GeoJSON</strong>
            </span>
          </div>

          {parsedPointsCount > 0 && (
            <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
              ✓ {parsedPointsCount} Pontos GPS Extraídos com Sucesso
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Nome da Rota / Trilha *</label>
            <input
              type="text"
              placeholder="Ex: Rota Tronco Bertioga - Praia Grande"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Origem (Ponta A)</label>
              <input
                type="text"
                placeholder="Ex: BERT.BT"
                value={formData.origem}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Destino (Ponta B)</label>
              <input
                type="text"
                placeholder="Ex: PGE.CO"
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Distância (km)</label>
              <input
                type="number"
                step="any"
                value={formData.distanciaKm}
                onChange={(e) => setFormData({ ...formData, distanciaKm: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Tipo de Rota</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Tronco Principal (DWDM)">Tronco Principal (DWDM)</option>
                <option value="Anel de Proteção">Anel de Proteção</option>
                <option value="Subterrâneo">Subterrâneo</option>
                <option value="Aéreo">Aéreo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Dificuldade</label>
              <select
                value={formData.dificuldade}
                onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Fácil">Fácil</option>
                <option value="Moderada">Moderada</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Descrição / Observações Técnicas</label>
            <textarea
              rows={2}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-500">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Salvar Rota na Biblioteca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RotasView({
  rotas = [],
  linkingCabo,
  routeFilterCabo,
  onToggleLinkRotaToCabo,
  onClearLinkingCabo,
  onClearRouteFilterCabo,
  onNavigateToCabos,
  onSaveRota,
  onUpdateRota,
  onDeleteRota,
  onOpenGravarModal
}) {
  const [rotaEmDestaque, setRotaEmDestaque] = useState(null);
  const [editingRota, setEditingRota] = useState(null);
  const [deletingRota, setDeletingRota] = useState(null);
  const [modalUploadGoogleEarth, setModalUploadGoogleEarth] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');
  const [subTrechoRange, setSubTrechoRange] = useState(null);
  
  // Interactive Altimetry Distance Slider (0 to 100%)
  const [sliderPosition, setSliderPosition] = useState(50);

  // Initialize subTrechoRange whenever rotaEmDestaque changes
  useEffect(() => {
    if (rotaEmDestaque) {
      const dist = Number(rotaEmDestaque.distanciaKm) || 12.5;
      setSubTrechoRange({ startKm: 0, endKm: Number((dist / 2).toFixed(2)) });
    } else {
      setSubTrechoRange(null);
    }
  }, [rotaEmDestaque?.id]);

  // Photo Upload & Checkpoint/Waypoint Handlers
  const photoInputRef = useRef(null);

  const handleUploadFotoTrilha = (e) => {
    const file = e.target.files?.[0];
    if (!file || !rotaEmDestaque) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      const newFoto = {
        id: `foto_${Date.now()}`,
        url: dataUrl,
        legenda: file.name.replace(/\.[^/.]+$/, ""),
        data: new Date().toLocaleDateString('pt-BR')
      };
      const updatedFotos = [...(rotaEmDestaque.fotos || []), newFoto];
      const updatedRota = { ...rotaEmDestaque, fotos: updatedFotos };
      setRotaEmDestaque(updatedRota);
      onUpdateRota?.(updatedRota);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveFotoTrilha = (fotoId) => {
    if (!rotaEmDestaque) return;
    const updatedFotos = (rotaEmDestaque.fotos || []).filter(f => f.id !== fotoId && f.url !== fotoId);
    const updatedRota = { ...rotaEmDestaque, fotos: updatedFotos };
    setRotaEmDestaque(updatedRota);
    onUpdateRota?.(updatedRota);
  };

  const [pontoForm, setPontoForm] = useState({
    tipo: 'checkpoint',
    nome: '',
    descricao: '',
    lat: '',
    lng: ''
  });

  const handleAddPontoMapa = (e) => {
    e.preventDefault();
    if (!pontoForm.nome || !rotaEmDestaque) return;

    const latVal = parseFloat(pontoForm.lat) || (rotaEmDestaque.pontosGps?.[0]?.lat || -24.32);
    const lngVal = parseFloat(pontoForm.lng) || (rotaEmDestaque.pontosGps?.[0]?.lng || -46.99);

    const novoPonto = {
      id: `pt_${Date.now()}`,
      nome: pontoForm.nome,
      descricao: pontoForm.descricao || '',
      lat: latVal,
      lng: lngVal,
      data: new Date().toLocaleDateString('pt-BR')
    };

    let updatedRota = { ...rotaEmDestaque };
    if (pontoForm.tipo === 'checkpoint') {
      updatedRota.checkpoints = [...(rotaEmDestaque.checkpoints || []), novoPonto];
    } else {
      updatedRota.waypoints = [...(rotaEmDestaque.waypoints || []), novoPonto];
    }

    setRotaEmDestaque(updatedRota);
    onUpdateRota?.(updatedRota);

    setPontoForm({
      tipo: 'checkpoint',
      nome: '',
      descricao: '',
      lat: '',
      lng: ''
    });
  };

  const handleRemovePontoMapa = (tipo, pontoId) => {
    if (!rotaEmDestaque) return;
    let updatedRota = { ...rotaEmDestaque };
    if (tipo === 'checkpoint') {
      updatedRota.checkpoints = (rotaEmDestaque.checkpoints || []).filter(p => p.id !== pontoId);
    } else {
      updatedRota.waypoints = (rotaEmDestaque.waypoints || []).filter(p => p.id !== pontoId);
    }
    setRotaEmDestaque(updatedRota);
    onUpdateRota?.(updatedRota);
  };

  const safeRotas = rotas || [];
  const rotasExibidas = routeFilterCabo
    ? safeRotas.filter(r => (routeFilterCabo.rotasVinculadas || []).includes(r.id))
    : safeRotas;

  const handleAddComentario = (rotaId) => {
    if (!novoComentario) return;
    const rotaAtual = safeRotas.find(r => r.id === rotaId);
    if (rotaAtual) {
      const comentariosAtualizados = [
        ...(rotaAtual.comentarios || []),
        {
          id: `c_${Date.now()}`,
          autor: 'william bispo',
          texto: novoComentario,
          data: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ];
      onUpdateRota({ ...rotaAtual, comentarios: comentariosAtualizados });
      if (rotaEmDestaque?.id === rotaId) {
        setRotaEmDestaque({ ...rotaEmDestaque, comentarios: comentariosAtualizados });
      }
      setNovoComentario('');
    }
  };

  const headerFileInputRef = useRef(null);
  const [isUploadingDirect, setIsUploadingDirect] = useState(false);

  const handleHeaderDirectUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDirect(true);
    try {
      const { kmlText } = await readKMLOrKMZFile(file);
      const parsed = parseKMLContent(kmlText, file.name);

      const computedRota = {
        id: `rot_${Date.now()}`,
        nome: parsed.nome || `Trilha ${file.name.replace(/\.[^/.]+$/, "")}`,
        origem: 'Importado do Google Earth',
        destino: 'Importado do Google Earth',
        distanciaKm: Number(parsed.distancia_km || 12.5),
        ganho_elevacao_m: Number(parsed.ganho_elevacao_m || 50),
        desnivelPositivo: Number(parsed.ganho_elevacao_m || 50),
        tipo: 'Tronco Principal (DWDM)',
        dificuldade: parsed.dificuldade === 'facil' ? 'Fácil' : parsed.dificuldade === 'dificil' ? 'Difícil' : 'Moderada',
        kml_path: `storage/kml/${Date.now()}_${file.name}`,
        geom: parsed.geom || null,
        geom_preview: parsed.geom_preview || null,
        ponto_inicio: parsed.ponto_inicio || null,
        pontosGps: parsed.geom?.geometry?.coordinates?.map(c => ({ lat: c[1], lng: c[0], elevacao: c[2] || 0 })) || [],
        status: 'Ativa',
        autor: 'william bispo',
        fonteArquivo: file.name,
        comentarios: [
          {
            id: `c_${Date.now()}`,
            autor: 'Google Earth Importer',
            texto: `Rota criada via upload do arquivo ${file.name} (${parsed.totalPoints || 0} pontos GPS).`,
            data: new Date().toISOString().replace('T', ' ').slice(0, 16)
          }
        ],
        fotos: [
          { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80' },
          { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' }
        ]
      };

      if (onSaveRota) {
        onSaveRota(computedRota);
      } else if (onUpdateRota) {
        onUpdateRota(computedRota);
      }

      setRotaEmDestaque(computedRota);
      alert(`🎉 Sucesso! Rota "${computedRota.nome}" (${parsed.totalPoints || 0} pontos GPS) importada do computador e exibida no mapa!`);
    } catch (err) {
      console.error('Erro no upload direto de KML/KMZ:', err);
      alert(`⚠️ ${err.message || 'Erro ao processar arquivo KML/KMZ do Desktop.'}`);
    } finally {
      setIsUploadingDirect(false);
      if (headerFileInputRef.current) {
        headerFileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* BANNER MODO VINCULAÇÃO DE ROTAS */}
      {linkingCabo && (
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-200 border border-violet-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                📍 MODO DE VINCULAÇÃO DE ROTAS: Tronco {linkingCabo.nome}
              </h3>
              <p className="text-xs text-violet-100 mt-0.5">
                Marque abaixo as rotas que pertencem a este cabo tronco ({linkingCabo.rotasVinculadas?.length || 0} rota(s) atualmente vinculada(s)).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClearLinkingCabo?.();
              onNavigateToCabos?.();
            }}
            className="px-5 py-2.5 bg-white text-violet-900 hover:bg-violet-50 font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Check className="w-4 h-4 text-violet-700" />
            <span>Concluir Vinculação e Voltar aos Cabos</span>
          </button>
        </div>
      )}

      {/* BANNER MODO EXPLORAÇÃO DE ROTAS VINCULADAS */}
      {routeFilterCabo && (
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200 border border-emerald-400">
          <div className="flex items-center gap-3">
            <RouteIcon className="w-6 h-6 text-white shrink-0" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                🔍 Exibindo Apenas Rotas Vinculadas ao Tronco: {routeFilterCabo.nome}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Visualizando {rotasExibidas.length} rota(s) associada(s) a este cabo.
              </p>
            </div>
          </div>

          <button
            onClick={() => onClearRouteFilterCabo?.()}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Ver Todas as Rotas</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-emerald-600" />
            <span>Biblioteca de Rotas & Trilhas Gravadas ({rotasExibidas.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeamentos de campo no formato Wikiloc com fotos, medidor de altimetria, GPS e comentários.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <input 
            type="file" 
            ref={headerFileInputRef} 
            onChange={handleHeaderDirectUpload} 
            accept="*" 
            className="hidden" 
          />

          <button
            type="button"
            onClick={() => headerFileInputRef.current?.click()}
            disabled={isUploadingDirect}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Globe className="w-4 h-4 text-violet-200" />
            <span>{isUploadingDirect ? 'Carregando Rota do Desktop...' : '📁 Carregar Rota no Google Earth (.KML/.KMZ)'}</span>
          </button>

          <button
            onClick={onOpenGravarModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Gravar Nova Trilha</span>
          </button>
        </div>
      </div>

      {/* DETALHE DA TRILHA (ESTILO WIKILOC IMAGEM DA ROTA) */}
      {rotaEmDestaque ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setRotaEmDestaque(null)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            ← Voltar para Biblioteca de Rotas
          </button>

          {/* Top Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{rotaEmDestaque.nome}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span>Distância: <strong className="text-slate-900 dark:text-white font-mono">{Math.round((rotaEmDestaque.distanciaKm || 0) * 1000).toLocaleString('pt-BR')} m ({rotaEmDestaque.distanciaKm} km)</strong></span>
                <span>Desnível+: <strong className="text-slate-900 dark:text-white font-mono">{rotaEmDestaque.desnivelPositivo || 234} m</strong></span>
                <span>Dificuldade: <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold">{rotaEmDestaque.dificuldade || 'Moderada'}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* BOTÃO REDIRECIONAR AO PONTO DA GRAVAÇÃO NO GPS / GOOGLE MAPS */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${rotaEmDestaque.pontosGps?.[0]?.lat || -24.32},${rotaEmDestaque.pontosGps?.[0]?.lng || -46.99}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4" />
                <span>📍 Abrir Ponto da Gravação no GPS</span>
              </a>

              <button
                onClick={() => setEditingRota(rotaEmDestaque)}
                className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Editar Trilha"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDeletingRota(rotaEmDestaque)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                title="Excluir Trilha / Rota (Requer Autorização)"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Rota</span>
              </button>
            </div>
          </div>

          {/* Grid: Map + Elevation & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Satellite Map & Altimetry Graph */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Satellite Map with Google Earth 3D & Ruler Distance Measurement & Direct KML Upload */}
              <MapErrorBoundary>
                <GoogleEarthMapContainer 
                  rota={rotaEmDestaque} 
                  sliderPosition={sliderPosition} 
                  subTrechoRange={subTrechoRange} 
                  onSubTrechoChange={setSubTrechoRange}
                  onUpdateRota={(updated) => {
                    setRotaEmDestaque(updated);
                    onUpdateRota?.(updated);
                  }} 
                />
              </MapErrorBoundary>

              {/* CALCULADOR PARALELO DE TRECHO ENTRE PONTA A E PONTA B */}
              <CalculadorTrechoParalelo 
                rota={rotaEmDestaque} 
                subTrechoRange={subTrechoRange} 
                onSubTrechoChange={setSubTrechoRange} 
              />

              {/* Photos Grid with Upload & Delete */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-500" />
                    <span>Fotos da Infraestrutura e Campo ({rotaEmDestaque.fotos?.length || 0})</span>
                  </h3>
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handleUploadFotoTrilha}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Fazer Upload de Foto</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {rotaEmDestaque.fotos?.map((f, idx) => (
                    <div key={f.id || idx} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group relative bg-slate-100 dark:bg-slate-800">
                      <img src={f.url} alt={f.legenda} className="w-full h-28 object-cover group-hover:scale-105 transition duration-300" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFotoTrilha(f.id || f.url)}
                        className="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-rose-700 shadow-md cursor-pointer"
                        title="Excluir foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="p-2 text-[11px]">
                        <span className="font-semibold block truncate text-slate-800 dark:text-slate-200">{f.legenda}</span>
                        <span className="text-[10px] text-slate-400">{f.data}</span>
                      </div>
                    </div>
                  ))}
                  {(!rotaEmDestaque.fotos || rotaEmDestaque.fotos.length === 0) && (
                    <div className="col-span-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-400 text-xs">
                      Nenhuma foto enviada ainda. Clique em "Fazer Upload de Foto" acima.
                    </div>
                  )}
                </div>
              </div>

              {/* Checkpoints & Waypoints Management */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>Checkpoints e Waypoints da Trilha</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                      🚩 {rotaEmDestaque.checkpoints?.length || 0} Checkpoints
                    </span>
                    <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 font-semibold">
                      📍 {rotaEmDestaque.waypoints?.length || 0} Waypoints
                    </span>
                  </div>
                </div>

                {/* Form Adicionar Ponto */}
                <form onSubmit={handleAddPontoMapa} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">➕ Novo Ponto de Referência no Mapa</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">Tipo de Ponto</label>
                      <select
                        value={pontoForm.tipo}
                        onChange={(e) => setPontoForm({ ...pontoForm, tipo: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs"
                      >
                        <option value="checkpoint">🚩 Checkpoint (Controle / Ponto de Checagem)</option>
                        <option value="waypoint">📍 Waypoint (Caixa / Ponto de Interesse)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">Nome / Identificação *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Caixa CE-04 ou Curva do Rio"
                        value={pontoForm.nome}
                        onChange={(e) => setPontoForm({ ...pontoForm, nome: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">Latitude (opcional)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder={rotaEmDestaque.pontosGps?.[0]?.lat ? `${rotaEmDestaque.pontosGps[0].lat}` : "-24.3200"}
                        value={pontoForm.lat}
                        onChange={(e) => setPontoForm({ ...pontoForm, lat: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">Longitude (opcional)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder={rotaEmDestaque.pontosGps?.[0]?.lng ? `${rotaEmDestaque.pontosGps[0].lng}` : "-46.9900"}
                        value={pontoForm.lng}
                        onChange={(e) => setPontoForm({ ...pontoForm, lng: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Ponto ao Mapa</span>
                    </button>
                  </div>
                </form>

                {/* List of Checkpoints & Waypoints */}
                <div className="space-y-2">
                  {/* Checkpoints List */}
                  {rotaEmDestaque.checkpoints?.map((cp, idx) => (
                    <div key={cp.id || idx} className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px]">🚩 CP{idx + 1}</span>
                        <div>
                          <strong className="text-slate-900 dark:text-white block">{cp.nome}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">Lat: {cp.lat}, Lng: {cp.lng}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePontoMapa('checkpoint', cp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Remover Checkpoint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Waypoints List */}
                  {rotaEmDestaque.waypoints?.map((wp, idx) => (
                    <div key={wp.id || idx} className="p-2.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-violet-600 text-white font-extrabold text-[10px]">📍 WP{idx + 1}</span>
                        <div>
                          <strong className="text-slate-900 dark:text-white block">{wp.nome}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">Lat: {wp.lat}, Lng: {wp.lng}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePontoMapa('waypoint', wp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Remover Waypoint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {(!rotaEmDestaque.checkpoints || rotaEmDestaque.checkpoints.length === 0) &&
                   (!rotaEmDestaque.waypoints || rotaEmDestaque.waypoints.length === 0) && (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      Nenhum checkpoint ou waypoint cadastrado para esta rota. Use o formulário acima para adicionar pontos no mapa.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Details */}
            <div className="space-y-4">
              
              {/* Autor Card */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-300 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-lg">
                  WB
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Autor da Trilha</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rotaEmDestaque.autor || 'william bispo'}</h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                    Veja mais trilhas deste autor &gt;
                  </span>
                </div>
              </div>

              {/* Interactive Actions */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => handleAplaudir(rotaEmDestaque.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">👏 Aplaudir</span>
                  <span className="font-mono text-emerald-600 font-bold">{rotaEmDestaque.aplausos || 0}</span>
                </button>
              </div>

              {/* Estatísticas da Trilha Table */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                  Estatísticas da Trilha
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Distância</span>
                    <strong className="text-slate-900 dark:text-white">{rotaEmDestaque.distanciaKm} km</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Tipo de trilha</span>
                    <strong className="text-slate-900 dark:text-white">Mão Única</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Desnível positivo</span>
                    <strong className="text-slate-900 dark:text-white">{rotaEmDestaque.desnivelPositivo || 234} m</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Desnível negativo</span>
                    <strong className="text-slate-900 dark:text-white">{rotaEmDestaque.desnivelNegativo || 210} m</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Elevação máx</span>
                    <strong className="text-slate-900 dark:text-white">{rotaEmDestaque.elevacaoMax || 240} m</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Elevação mín</span>
                    <strong className="text-slate-900 dark:text-white">{rotaEmDestaque.elevacaoMin || 12} m</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Dificuldade</span>
                    <strong className="text-sky-600 font-bold">{rotaEmDestaque.dificuldade || 'Moderada'}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>TrailRank</span>
                    <strong className="text-amber-500 font-bold">{rotaEmDestaque.trailRank || 9} / 10</strong>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Comentários Técnicos ({rotaEmDestaque.comentarios?.length || 0})
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rotaEmDestaque.comentarios?.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">{c.autor}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{c.data}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{c.texto}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Escrever um comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <button
                    onClick={() => handleAddComentario(rotaEmDestaque.id)}
                    className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* LISTA / CARDS WIKILOC DA BIBLIOTECA */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rotasExibidas.map((rota) => {
            const isLinkedToCurrentCabo = linkingCabo && (linkingCabo.rotasVinculadas || []).includes(rota.id);
            return (
              <div key={rota.id} className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-4 transition ${
                isLinkedToCurrentCabo ? 'border-2 border-emerald-500 shadow-md bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}>
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <span>🚷</span> {rota.tipo || 'Trekking'}
                  </span>
                  <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5" /> Salvar em uma Lista
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{rota.nome}</h3>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div>Distância: <strong className="text-slate-900 dark:text-white">{rota.distanciaKm}km</strong></div>
                  <div>Desnível+: <strong className="text-slate-900 dark:text-white">{rota.desnivelPositivo || 234}m</strong></div>
                  <div>Dificuldade: <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold">{rota.dificuldade || 'Moderada'}</span></div>
                </div>

                {/* BOTÃO VINCULAR/DESMARCAR NO MODO LINKING */}
                {linkingCabo && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onToggleLinkRotaToCabo?.(linkingCabo.id, rota.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                        isLinkedToCurrentCabo
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-md'
                          : 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-800'
                      }`}
                    >
                      <CheckCircle className={`w-4 h-4 ${isLinkedToCurrentCabo ? 'text-white' : 'text-violet-500'}`} />
                      <span>
                        {isLinkedToCurrentCabo
                          ? '✓ Rota Vinculada a este Tronco (Clique para Desmarcar)'
                          : '+ Marcar e Vincular esta Rota ao Tronco'}
                      </span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-6 h-6 rounded-md bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">
                    WB
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{rota.autor || 'william bispo'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="col-span-2 h-36">
                    <img
                      src={rota.fotos?.[0]?.url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'}
                      alt="Foto da trilha"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 h-36">
                    <img
                      src={rota.fotos?.[1]?.url || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'}
                      alt="Foto secundária"
                      className="w-full h-[68px] object-cover"
                    />
                    <div className="relative w-full h-[68px]">
                      <img
                        src={rota.fotos?.[2]?.url || 'https://images.unsplash.com/photo-1511497584788-876761c119ee?auto=format&fit=crop&w=600&q=80'}
                        alt="Mais fotos"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-[11px] font-bold text-white">
                        Ver mais fotos
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingRota(rota)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Excluir Rota (Requer Autorização)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Rota</span>
                  </button>

                  <button
                    onClick={() => setRotaEmDestaque(rota)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Ver trilha</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Editar Rota */}
      {editingRota && (
        <EditarRotaModal
          isOpen={Boolean(editingRota)}
          onClose={() => setEditingRota(null)}
          onSave={(rotaAtualizada) => {
            onUpdateRota(rotaAtualizada);
            if (rotaEmDestaque?.id === rotaAtualizada.id) {
              setRotaEmDestaque(rotaAtualizada);
            }
          }}
          rota={editingRota}
        />
      )}

      {/* Modal Upload Google Earth (.KML/.KMZ) */}
      <UploadRotaGoogleEarthModal
        isOpen={modalUploadGoogleEarth}
        onClose={() => setModalUploadGoogleEarth(false)}
        onSave={(novaRota) => {
          if (onSaveRota) {
            onSaveRota(novaRota);
          } else if (onUpdateRota) {
            onUpdateRota(novaRota);
          }
        }}
      />

      {/* Modal de Autenticação Requerida para Exclusão de Rota */}
      <ModalConfirmarExclusao
        isOpen={Boolean(deletingRota)}
        onClose={() => setDeletingRota(null)}
        onConfirm={() => {
          if (deletingRota) {
            onDeleteRota?.(deletingRota.id);
            if (rotaEmDestaque?.id === deletingRota.id) {
              setRotaEmDestaque(null);
            }
            setDeletingRota(null);
          }
        }}
        itemNome={deletingRota?.nome || ''}
        tipoItem="Rota"
      />
    </div>
  );
}
