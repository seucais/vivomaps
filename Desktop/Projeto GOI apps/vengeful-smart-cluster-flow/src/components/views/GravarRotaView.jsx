import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Video, 
  Route as RouteIcon, 
  Search, 
  Wrench, 
  AlertTriangle, 
  Play, 
  Pause, 
  Square, 
  Camera, 
  MapPin, 
  Save, 
  X, 
  Compass, 
  Layers, 
  Upload, 
  Navigation, 
  Check,
  Zap,
  Activity,
  Maximize2,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Gauge
} from 'lucide-react';

function GravarRotaLeafletMap({ currentGps, caminhoGps, dificuldades, fotos, isRecording, isPaused, distanciaMeters }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [mapLayer, setMapLayer] = useState('google_hybrid');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    let tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    if (mapLayer === 'esri_satelite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapLayer === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const centerLat = currentGps?.lat || -24.3200;
    const centerLng = currentGps?.lng || -46.9900;
    map.setView([centerLat, centerLng], 16);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    const lineCoords = (caminhoGps || []).map(p => [p.lat, p.lng]);
    L.polyline(lineCoords, {
      color: '#fb923c',
      weight: 10,
      opacity: 0.45,
      lineCap: 'round'
    }).addTo(map);

    const polyline = L.polyline(lineCoords, {
      color: '#f97316',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round'
    }).addTo(map);

    polylineRef.current = polyline;

    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLayer]);

  // Update position & path dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lat = currentGps?.lat;
    const lng = currentGps?.lng;
    if (!lat || !lng) return;

    map.panTo([lat, lng], { animate: true, duration: 0.5 });

    if (!userMarkerRef.current) {
      const liveUserIcon = L.divIcon({
        className: 'live-gps-user-marker',
        html: `<div style="position:relative; width:32px; height:32px;">
          <div style="position:absolute; inset:0; background:rgba(16,185,129,0.4); border-radius:50%; animation:ping 1.2s infinite;"></div>
          <div style="position:absolute; top:6px; left:6px; width:20px; height:20px; background:#10b981; border:3px solid white; border-radius:50%; box-shadow:0 0 14px #10b981;"></div>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      userMarkerRef.current = L.marker([lat, lng], { icon: liveUserIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng([lat, lng]);
    }

    if (polylineRef.current && caminhoGps.length > 0) {
      const lineCoords = caminhoGps.map(p => [p.lat, p.lng]);
      polylineRef.current.setLatLngs(lineCoords);
    }

    if (markersLayerRef.current) {
      const layer = markersLayerRef.current;
      layer.clearLayers();

      if (caminhoGps.length > 0) {
        const startPt = [caminhoGps[0].lat, caminhoGps[0].lng];
        const startIcon = L.divIcon({
          className: 'start-point-marker',
          html: `<div style="background:#22c55e; color:white; font-size:10px; font-weight:bold; font-family:sans-serif; padding:2px 6px; border-radius:10px; border:2px solid white; box-shadow:0 0 10px rgba(0,0,0,0.8); white-space:nowrap;">🟢 INÍCIO</div>`,
          iconAnchor: [20, 10]
        });
        L.marker(startPt, { icon: startIcon }).addTo(layer);
      }

      (dificuldades || []).forEach((d) => {
        if (d.lat && d.lng) {
          const wpIcon = L.divIcon({
            className: 'recording-wp-marker',
            html: `<div style="background:#f59e0b; color:white; font-size:10px; font-weight:bold; font-family:sans-serif; padding:2px 6px; border-radius:10px; border:2px solid white; box-shadow:0 0 10px rgba(0,0,0,0.8); white-space:nowrap;">🚩 ${d.tipo}</div>`,
            iconAnchor: [20, 10]
          });
          L.marker([d.lat, d.lng], { icon: wpIcon }).addTo(layer);
        }
      });

      (fotos || []).forEach((f) => {
        if (f.lat && f.lng) {
          const photoIcon = L.divIcon({
            className: 'recording-photo-marker',
            html: `<div style="background:#3b82f6; color:white; font-size:10px; font-weight:bold; font-family:sans-serif; padding:2px 6px; border-radius:10px; border:2px solid white; box-shadow:0 0 10px rgba(0,0,0,0.8); white-space:nowrap;">📷 Foto</div>`,
            iconAnchor: [20, 10]
          });
          L.marker([f.lat, f.lng], { icon: photoIcon }).addTo(layer);
        }
      });
    }
  }, [currentGps, caminhoGps, dificuldades, fotos]);

  return (
    <div className="w-full h-[430px] rounded-2xl relative overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col">
      {/* MAP LAYER TABS */}
      <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-1 text-[11px] font-semibold text-slate-300 pointer-events-auto">
        <button
          type="button"
          onClick={() => setMapLayer('google_hybrid')}
          className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${mapLayer === 'google_hybrid' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800'}`}
        >
          🛰️ Google Satélite
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

      {/* FLOATING STATUS BADGE */}
      <div className="absolute top-3 right-3 z-20 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl border border-emerald-400 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
        <span>📍 Ponto Atual: {(distanciaMeters / 1000).toFixed(2)} km ({distanciaMeters.toFixed(0)} m)</span>
      </div>

      {/* LEAFLET CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}

export function GravarRotaModal({ isOpen, onClose, onSelectTipo }) {
  if (!isOpen) return null;

  const tipos = [
    {
      id: 'Rota Cabo',
      label: 'Rota Cabo',
      desc: 'Mapeamento de infraestrutura de cabos e espanação',
      icon: RouteIcon,
      color: 'border-blue-200 hover:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'Levantamento',
      label: 'Levantamento Técnico',
      desc: 'Vistoria e levantamento de rotas de campo',
      icon: Search,
      color: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'Manutenção',
      label: 'Manutenção de Fibra',
      desc: 'Atividades de reparo e manutenção em cabos',
      icon: Wrench,
      color: 'border-amber-200 hover:border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
    },
    {
      id: 'Ocorrência',
      label: 'Registro de Ocorrência',
      desc: 'Mapeamento de rompimentos e avarias graves',
      icon: AlertTriangle,
      color: 'border-rose-200 hover:border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative animate-in zoom-in-95 duration-150">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center">
          Selecione o Modo de Gravação Strava / Wikiloc
        </h3>

        <div className="space-y-3">
          {tipos.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTipo(t.id)}
                className={`w-full p-4 rounded-xl border text-left transition flex items-center gap-4 group ${t.color}`}
              >
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const calcHaversineMeters = (p1, p2) => {
  if (!p1 || !p2) return 0;
  const R = 6371000;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function GravarRotaView({ onSaveRota, cabos, centrais }) {
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [tipoGravação, setTipoGravação] = useState('Rota Cabo');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false); // DEFAULT FALSE FOR REAL PHONE GPS RECORDING

  const [segundos, setSegundos] = useState(0);
  const [distanciaMeters, setDistanciaMeters] = useState(0);
  const [velocidadeKmh, setVelocidadeKmh] = useState(0);
  const [ganhoElevacao, setGanhoElevacao] = useState(0);

  const [nomeRota, setNomeRota] = useState('');
  const [caboSelecionado, setCaboSelecionado] = useState('');

  // GPS State & Interactive Map Coordinates
  const [currentGps, setCurrentGps] = useState({ lat: -24.3200, lng: -46.9900, accuracy: 3 });
  
  // Real-time path coordinates
  const [caminhoGps, setCaminhoGps] = useState([]);
  
  const [dificuldades, setDificuldades] = useState([]);
  const [fotos, setFotos] = useState([]);

  // Modal para adicionar Waypoint / Checkpoint
  const [modalDificuldade, setModalDificuldade] = useState(false);
  const [novaDificuldade, setNovaDificuldade] = useState({ tipo: 'Poste Sobregarregado', descricao: '' });

  // 1. Initial GPS positioning on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          const accuracy = Math.round(pos.coords.accuracy || 5);
          setCurrentGps({ lat, lng, accuracy });
        },
        (err) => console.log('Posição GPS inicial:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // 2. Real-time Phone Geolocation watch (PRIMARY MODE)
  useEffect(() => {
    let watchId = null;
    if ('geolocation' in navigator && !isSimulating) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          const accuracy = Math.round(pos.coords.accuracy || 5);
          const currentSpeed = pos.coords.speed !== null && pos.coords.speed !== undefined
            ? Number((pos.coords.speed * 3.6).toFixed(1))
            : 0;

          setCurrentGps({ lat, lng, accuracy });
          if (currentSpeed > 0) setVelocidadeKmh(currentSpeed);

          if (isRecording && !isPaused) {
            setCaminhoGps((prev) => {
              const last = prev[prev.length - 1];
              if (!last) {
                return [{ lat, lng, timestamp: Date.now() }];
              }
              const distStep = calcHaversineMeters(last, { lat, lng });
              // Record point if moved at least 2 meters (filtering stationary GPS jitter)
              if (distStep >= 2.0) {
                setDistanciaMeters((prevDist) => prevDist + distStep);
                return [...prev, { lat, lng, timestamp: Date.now() }];
              }
              return prev;
            });
          }
        },
        (err) => console.warn('Erro de Geolocalização no Celular:', err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isRecording, isPaused, isSimulating]);

  // 3. Live Timer and Simulation Loop (ONLY IF isSimulating IS EXPLICITLY TRUE)
  useEffect(() => {
    let interval = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSegundos((prevSec) => {
          const nextSec = prevSec + 1;
          
          if (nextSec % 4 === 0) {
            setGanhoElevacao((prevElev) => prevElev + 1);
          }

          if (isSimulating) {
            const deltaDist = 4.2 + (Math.sin(nextSec * 0.2) * 1.5);
            setDistanciaMeters((prevDist) => prevDist + deltaDist);
            setVelocidadeKmh(14.2);

            setCaminhoGps((prevPoints) => {
              const last = prevPoints[prevPoints.length - 1] || { lat: currentGps.lat || -24.3200, lng: currentGps.lng || -46.9900 };
              const nextLat = Number((last.lat + 0.00015).toFixed(6));
              const nextLng = Number((last.lng + 0.00012).toFixed(6));

              setCurrentGps({ lat: nextLat, lng: nextLng, accuracy: 3 });
              return [...prevPoints, { lat: nextLat, lng: nextLng }];
            });
          }

          return nextSec;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused, isSimulating, currentGps.lat, currentGps.lng]);

  const handleStart = () => {
    if (!nomeRota) {
      alert('Por favor, informe o nome da trilha/rota antes de iniciar a gravação.');
      return;
    }
    setIsRecording(true);
    setIsPaused(false);
    setSegundos(0);
    setDistanciaMeters(0);
    setGanhoElevacao(0);
    if (currentGps?.lat && currentGps?.lng) {
      setCaminhoGps([{ lat: currentGps.lat, lng: currentGps.lng }]);
    } else {
      setCaminhoGps([]);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStopAndSave = () => {
    const distKm = Number((distanciaMeters / 1000).toFixed(2));
    const currentPointList = caminhoGps.map(p => ({ lat: p.lat, lng: p.lng, elevacao: p.elevacao || 10 }));
    
    const novaRota = {
      id: `rot_${Date.now()}`,
      nome: nomeRota,
      tipo: tipoGravação,
      status: 'Concluída',
      distanciaKm: distKm > 0 ? distKm : 0.05,
      ganho_elevacao_m: ganhoElevacao || 5,
      desnivelPositivo: ganhoElevacao || 5,
      desnivelNegativo: Math.floor(ganhoElevacao * 0.8) || 3,
      elevacaoMax: 50 + ganhoElevacao,
      elevacaoMin: 12,
      dificuldade: 'Moderada',
      autor: 'william bispo',
      caboNome: caboSelecionado || 'Tronco Principal',
      cidade: 'Peruíbe / SP',
      pontosGps: currentPointList.length > 0 ? currentPointList : [{ lat: currentGps.lat, lng: currentGps.lng }],
      waypoints: dificuldades.map(d => ({ nome: d.tipo, descricao: d.descricao, lat: d.lat, lng: d.lng })),
      checkpoints: [],
      fotos,
      comentarios: [
        {
          id: `c_${Date.now()}`,
          autor: 'william bispo',
          texto: `Trilha gravada no campo via GPS do celular (${currentPointList.length} pontos).`,
          data: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      aplausos: 1,
      criadoPor: 'william bispo',
      criadoEm: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    onSaveRota(novaRota);
    alert(`🎉 Trilha "${nomeRota}" (${novaRota.distanciaKm} km) gravada com sucesso! Ela foi adicionada à Biblioteca de Rotas.`);
    setIsRecording(false);
    setIsPaused(false);
    setSegundos(0);
    setDistanciaMeters(0);
    setGanhoElevacao(0);
    setVelocidadeKmh(0);
    setCaminhoGps([]);
    setDificuldades([]);
    setFotos([]);
    setNomeRota('');
  };

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Pace format (e.g. 12'45" /km)
  const calculatePace = () => {
    if (distanciaMeters < 50 || segundos < 5) return `0'00" /km`;
    const km = distanciaMeters / 1000;
    const secPerKm = segundos / km;
    const pMins = Math.floor(secPerKm / 60);
    const pSecs = Math.floor(secPerKm % 60);
    return `${pMins}'${pSecs.toString().padStart(2, '0')}" /km`;
  };

  const handleAddDificuldade = () => {
    if (!novaDificuldade.descricao) {
      alert('Digite uma observação para o marcador.');
      return;
    }

    const currentHead = caminhoGps[caminhoGps.length - 1] || { x: 300, y: 200, lat: currentGps.lat, lng: currentGps.lng };

    setDificuldades([
      ...dificuldades,
      {
        ...novaDificuldade,
        id: Date.now(),
        x: currentHead.x,
        y: currentHead.y,
        lat: currentGps.lat,
        lng: currentGps.lng,
        horario: new Date().toLocaleTimeString().slice(0, 5)
      }
    ]);
    setNovaDificuldade({ tipo: 'Poste Sobregarregado', descricao: '' });
    setModalDificuldade(false);
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const currentHead = caminhoGps[caminhoGps.length - 1] || { x: 300, y: 200, lat: currentGps.lat, lng: currentGps.lng };
        setFotos([
          ...fotos,
          {
            id: Date.now(),
            url: event.target.result,
            legenda: `Foto registrada em (${currentGps.lat}, ${currentGps.lng})`,
            data: new Date().toLocaleTimeString().slice(0, 5),
            x: currentHead.x,
            y: currentHead.y,
            lat: currentGps.lat,
            lng: currentGps.lng
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentHeadPoint = caminhoGps[caminhoGps.length - 1] || { x: 80, y: 380, lat: -24.3200, lng: -46.9900 };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
            <span>Gravador de Trilha GPS ao Vivo (Estilo Strava & Wikiloc)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Grave o percurso técnico do cabo em tempo real, marque waypoints e anexe fotos georeferenciadas ao trajeto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SIMULATOR TOGGLE BUTTON FOR DESKTOP DEMO */}
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              isSimulating 
                ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                : 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-xs'
            }`}
            title="Sinal GPS real do celular ativado. Clique se quiser simular movimento no computador."
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? '⚡ Modo Simulador (Desktop Teste)' : '📡 GPS Real do Celular (ATIVO)'}</span>
          </button>

          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-300">
            {tipoGravação}
          </span>
        </div>
      </div>

      {/* DASHBOARD TELEMETRIA HUD STRAVA (PAINEL SUPERIOR DE ALTA VISIBILIDADE) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* TEMPO */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> TEMPO</span>
            {isRecording && !isPaused && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
          </div>
          <div className="text-2xl font-mono font-black text-emerald-400 tracking-tight">
            {formatTime(segundos)}
          </div>
          <span className="text-[10px] text-slate-500">{isPaused ? 'Pausado' : isRecording ? 'Gravando ao vivo' : 'Aguardando início'}</span>
        </div>

        {/* DISTÂNCIA */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1"><RouteIcon className="w-3.5 h-3.5 text-violet-400" /> DISTÂNCIA</span>
          </div>
          <div className="text-2xl font-mono font-black text-violet-400 tracking-tight">
            {(distanciaMeters / 1000).toFixed(2)} <span className="text-xs font-sans text-slate-400">km</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{distanciaMeters.toFixed(0)} metros</span>
        </div>

        {/* VELOCIDADE */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-sky-400" /> VELOCIDADE</span>
          </div>
          <div className="text-2xl font-mono font-black text-sky-400 tracking-tight">
            {isRecording && !isPaused ? velocidadeKmh : 0} <span className="text-xs font-sans text-slate-400">km/h</span>
          </div>
          <span className="text-[10px] text-slate-500">Ritmo: {calculatePace()}</span>
        </div>

        {/* DESNÍVEL+ */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-amber-400" /> DESNÍVEL+</span>
          </div>
          <div className="text-2xl font-mono font-black text-amber-400 tracking-tight">
            +{ganhoElevacao} <span className="text-xs font-sans text-slate-400">m</span>
          </div>
          <span className="text-[10px] text-slate-500">Elevação acumulada</span>
        </div>

        {/* GPS ACCURACY */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5 text-emerald-400" /> SINAL GPS</span>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-400 truncate">
            {currentGps.lat}, {currentGps.lng}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
            Precisão: ±{currentGps.accuracy}m {isSimulating ? '(Simulado)' : '(Satelital HD)'}
          </span>
        </div>

      </div>

      {/* PAINEL PRINCIPAL: CONTROLES & MAPA SATÉLITE INTERATIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: CONTROLES DE GRAVAÇÃO STRAVA */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Configuração do Trajeto</span>
              {isRecording && (
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold animate-pulse">
                  REC ATIVO
                </span>
              )}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Nome da Trilha / Rota *</label>
                <input 
                  type="text"
                  placeholder="Ex: #76 Poda Guaraú - Peruíbe"
                  value={nomeRota}
                  onChange={(e) => setNomeRota(e.target.value)}
                  disabled={isRecording}
                  className="w-full px-3.5 py-2.5 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Tronco de Fibra Relacionado</label>
                <select
                  value={caboSelecionado}
                  onChange={(e) => setCaboSelecionado(e.target.value)}
                  disabled={isRecording}
                  className="w-full px-3.5 py-2.5 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  <option value="">Selecione o tronco de fibra...</option>
                  {cabos.map(c => (
                    <option key={c.id} value={c.nome}>{c.nome} ({c.cidade})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BOTÕES DE CONTROLE STRAVA (INICIAR / PAUSAR / SALVAR) */}
            <div className="space-y-2 pt-2">
              {!isRecording ? (
                <button
                  onClick={handleStart}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>INICIAR GRAVAÇÃO DE CAMPO</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePause}
                    className={`py-3 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md ${
                      isPaused ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                  >
                    {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                    <span>{isPaused ? 'Continuar' : 'Pausar'}</span>
                  </button>

                  <button
                    onClick={handleStopAndSave}
                    className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Finalizar & Salvar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BARRA DE AÇÕES RÁPIDAS (ADICIONAR WAYPOINTS E FOTOS DURANTE PERCURSO) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Registrar Eventos no Ponto GPS Atual:
            </span>
            
            <input 
              type="file" 
              ref={cameraInputRef} 
              onChange={handleFotoUpload} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
            />

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFotoUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setModalDificuldade(true)}
                disabled={!isRecording}
                className="px-3.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>+ Marcador 🚩</span>
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={!isRecording}
                className="px-3.5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Camera className="w-4 h-4 text-blue-500" />
                <span>📷 Tirar Foto</span>
              </button>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: MAPA SATÉLITE WIKILOC COM DESENHO DA TRILHA EM TEMPO REAL */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mapa Satélite e Trajeto em Tempo Real</h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-emerald-600 dark:text-emerald-400">Rastreamento GPS Ativo</span>
            </div>
          </div>

          {/* REAL-TIME LEAFLET SATELLITE MAP */}
          <GravarRotaLeafletMap 
            currentGps={currentGps}
            caminhoGps={caminhoGps}
            dificuldades={dificuldades}
            fotos={fotos}
            isRecording={isRecording}
            isPaused={isPaused}
            distanciaMeters={distanciaMeters}
          />

          {/* PAINEL DE EVENTOS REGISTRADOS NA ROTA (WAYPOINTS E FOTOS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Marcadores / Dificuldades */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Marcadores & Waypoints ({dificuldades.length})</span>
              </span>
              {dificuldades.length === 0 ? (
                <p className="text-[11px] text-slate-400">Nenhum marcador registrado no percurso.</p>
              ) : (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {dificuldades.map(d => (
                    <div key={d.id} className="text-[11px] p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">🚩 [{d.horario}]</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">{d.tipo}</strong>
                        <span className="text-slate-500">{d.descricao}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fotos Georeferenciadas */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-500" />
                <span>Fotos do Trajeto ({fotos.length})</span>
              </span>
              {fotos.length === 0 ? (
                <p className="text-[11px] text-slate-400">Nenhuma foto anexada ao percurso.</p>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {fotos.map(f => (
                    <div key={f.id} className="relative group shrink-0">
                      <img src={f.url} alt={f.legenda} className="w-14 h-14 rounded-lg object-cover border border-slate-300" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[9px] text-center font-mono py-0.5 rounded-b-lg">
                        {f.data}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* MODAL PARA ADICIONAR MARCADOR / WAYPOINT */}
      {modalDificuldade && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Adicionar Marcador 🚩 no Ponto GPS Atual</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Tipo de Evento / Obstáculo</label>
              <select
                value={novaDificuldade.tipo}
                onChange={(e) => setNovaDificuldade({ ...novaDificuldade, tipo: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-medium"
              >
                <option value="Poste Sobregarregado">Poste Sobregarregado</option>
                <option value="Vegetação Densa / Poda">Vegetação Densa / Poda Necessária</option>
                <option value="Caixa de Emenda Danificada">Caixa de Emenda (CEO) Danificada</option>
                <option value="Roçada Necessária">Roçada Necessária no Trecho</option>
                <option value="Travessia de Rodovia / Rio">Travessia de Rodovia / Rio</option>
                <option value="Cruzeta Danificada">Cruzeta Danificada</option>
                <option value="Anotação Técnica">Anotação Técnica Geral</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Observação do Ponto *</label>
              <textarea
                value={novaDificuldade.descricao}
                onChange={(e) => setNovaDificuldade({ ...novaDificuldade, descricao: e.target.value })}
                rows={3}
                placeholder="Descreva detalhadamente a situação encontrada neste ponto do cabo..."
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setModalDificuldade(false)}
                className="px-3.5 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddDificuldade}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Salvar Marcador 🚩
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

