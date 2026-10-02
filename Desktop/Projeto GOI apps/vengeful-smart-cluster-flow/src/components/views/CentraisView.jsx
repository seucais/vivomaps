import React, { useState, useEffect, useRef } from 'react';
import ModalConfirmarExclusao from '@/components/modals/ModalConfirmarExclusao';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Navigation, 
  Key, 
  ShieldCheck, 
  ExternalLink, 
  Trash2, 
  X, 
  Save, 
  Camera, 
  Upload, 
  Edit3, 
  Check, 
  Compass, 
  Hash,
  Eye
} from 'lucide-react';

export function CentralModal({ isOpen, onClose, onSave, editingCentral }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const defaultForm = {
    nome: '',
    sigla: '',
    cidade: '',
    endereco: '',
    numeroPortaria: '',
    latitude: -23.5505,
    longitude: -46.6333,
    foto: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    portaria: '24h com crachá',
    tiposAcesso: ['Portaria', 'Bluetooth'],
    status: 'Ativa',
    observacoes: '',
    chaveEntrada: '',
    chaveTx: ''
  };

  const [formData, setFormData] = useState(defaultForm);
  const [isCapturingGps, setIsCapturingGps] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingCentral) {
        setFormData({
          id: editingCentral.id,
          nome: editingCentral.nome || '',
          sigla: editingCentral.sigla || '',
          cidade: editingCentral.cidade || '',
          endereco: editingCentral.endereco || '',
          numeroPortaria: editingCentral.numeroPortaria || '',
          latitude: editingCentral.latitude || -23.5505,
          longitude: editingCentral.longitude || -46.6333,
          foto: editingCentral.foto || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
          portaria: editingCentral.portaria || '24h com crachá',
          tiposAcesso: editingCentral.tiposAcesso || ['Portaria', 'Bluetooth'],
          status: editingCentral.status || 'Ativa',
          observacoes: editingCentral.observacoes || '',
          chaveEntrada: editingCentral.chaveEntrada || '',
          chaveTx: editingCentral.chaveTx || ''
        });
      } else {
        setFormData(defaultForm);
      }
    }
  }, [isOpen, editingCentral]);

  if (!isOpen) return null;

  const handleToggleAcesso = (item) => {
    if (formData.tiposAcesso?.includes(item)) {
      setFormData({ ...formData, tiposAcesso: formData.tiposAcesso.filter(a => a !== item) });
    } else {
      setFormData({ ...formData, tiposAcesso: [...(formData.tiposAcesso || []), item] });
    }
  };

  const handleCapturarGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: Number(position.coords.latitude.toFixed(5)),
            longitude: Number(position.coords.longitude.toFixed(5))
          });
          setIsCapturingGps(false);
          alert(`GPS Capturado: Lat ${position.coords.latitude.toFixed(5)}, Lng ${position.coords.longitude.toFixed(5)}`);
        },
        (error) => {
          // Fallback simulation for dev environment
          const simLat = Number((-23.5505 + (Math.random() - 0.5) * 0.05).toFixed(5));
          const simLng = Number((-46.6333 + (Math.random() - 0.5) * 0.05).toFixed(5));
          setFormData({ ...formData, latitude: simLat, longitude: simLng });
          setIsCapturingGps(false);
          alert(`Coordenadas simuladas com sucesso: Lat ${simLat}, Lng ${simLng}`);
        }
      );
    } else {
      setIsCapturingGps(false);
      alert('Geolocalização não suportada pelo navegador.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, foto: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sigla || !formData.endereco) {
      alert('Preencha os campos obrigatórios (*).');
      return;
    }

    onSave({
      ...formData,
      nome: formData.sigla,
      id: formData.id || `cnt_${Date.now()}`,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      criadoEm: formData.criadoEm || new Date().toISOString().slice(0, 10)
    });

    onClose();
  };

  const listaAcessos = ['Portaria', 'Bluetooth', 'Chave Cortada', 'Cliq', 'Biometria'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-600" />
          <span>{editingCentral ? `Editar Central: ${formData.sigla}` : 'Cadastrar Nova Central Técnica'}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Sigla / Código *</label>
              <input
                type="text"
                placeholder="Ex: # PGE.CO ou BERT.BT"
                value={formData.sigla}
                onChange={(e) => setFormData({ ...formData, sigla: e.target.value, nome: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Cidade *</label>
              <input
                type="text"
                placeholder="Ex: Praia Grande, Bertioga"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Endereço Completo *</label>
            <input
              type="text"
              placeholder="Rua, Número, Bairro"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              required
            />
          </div>

          {/* Número da Portaria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Número da Portaria / Ramal</label>
              <input
                type="text"
                placeholder="Ex: Portaria #01 (Ramal 4012)"
                value={formData.numeroPortaria || ''}
                onChange={(e) => setFormData({ ...formData, numeroPortaria: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Tipo de Portaria</label>
              <input
                type="text"
                placeholder="Ex: 24h com crachá, Com Chave"
                value={formData.portaria}
                onChange={(e) => setFormData({ ...formData, portaria: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Observações Técnicas</label>
            <textarea
              rows={2}
              placeholder="Ex: Acesso pela lateral da central..."
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          {/* BOTÃO CAPTURAR COORDENADAS GPS */}
          <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-600" /> Coordenadas GPS da Central:
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                Lat: {formData.latitude} | Lng: {formData.longitude}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCapturarGps}
              disabled={isCapturingGps}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>{isCapturingGps ? 'Capturando Coordenadas...' : '📍 Capturar GPS Atual (Lat & Lng)'}</span>
            </button>
          </div>

          {/* UPLOAD OU TIRAR FOTO */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase block">Foto da Fachada da Central</label>
            
            {formData.foto && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-2">
                <img src={formData.foto} alt="Fachada da Central" className="w-full h-full object-cover" />
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <input 
              type="file" 
              ref={cameraInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-purple-600" />
                <span>📷 Tirar Foto (Câmera)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>📁 Upload de Arquivo</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Tipos de Acesso Disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {listaAcessos.map(item => {
                const isSelected = formData.tiposAcesso?.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleToggleAcesso(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-purple-400" />
              <span>{editingCentral ? 'Atualizar Central' : 'Salvar Central'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function VisualizarCentralModal({ isOpen, onClose, central, onEdit }) {
  if (!isOpen || !central) return null;

  const enderecoConcat = [central.endereco, central.cidade].filter(Boolean).join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    enderecoConcat || (central.latitude && central.longitude ? `${central.latitude},${central.longitude}` : (central.sigla || '').replace(/^#\s*/, ''))
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150 space-y-5">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Title Bar */}
        <div className="flex items-start gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs border border-purple-200 dark:border-purple-800">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                {(central.sigla || '').replace(/^#\s*/, '')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold">
                ● {central.status || 'Ativa'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 capitalize">
              {central.nome}
            </h3>
            <p className="text-xs text-slate-500">
              Cidade: <strong className="text-slate-700 dark:text-slate-300">{central.cidade}</strong>
            </p>
          </div>
        </div>

        {/* Central Photo & Main Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-48 bg-slate-100 dark:bg-slate-800 relative">
            <img 
              src={central.foto || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80'} 
              alt={central.nome} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
              <Camera className="w-3 h-3 text-purple-400" />
              <span>Infraestrutura Central Vivo</span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <span>Localização & Endereço</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {central.endereco}
            </p>

            {central.numeroPortaria && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Portaria: <strong className="text-purple-600 dark:text-purple-400">{central.numeroPortaria}</strong>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Coordenadas GPS:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {central.latitude || '-23.5505'}, {central.longitude || '-46.6333'}
              </strong>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Navegar no Google Maps GPS</span>
            </a>
          </div>
        </div>

        {/* Chaves, Acesso e Observações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 space-y-2">
            <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-600" />
              <span>Portaria & Tipos de Acesso</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-500">Portaria:</span>{' '}
                <span className="text-slate-800 dark:text-slate-200">{central.portaria || '24h com crachá'}</span>
              </div>
            </div>

            {central.tiposAcesso && central.tiposAcesso.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {central.tiposAcesso.map(acesso => (
                  <span key={acesso} className="px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 text-[10px] font-bold">
                    ✓ {acesso}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Observações & Segurança</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              {central.observacoes || 'Central operando em conformidade com as normas técnicas de Backbone Vivo GOI.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            Fechar
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(central);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Dados desta Central</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CentraisView({ centrais, onSaveCentral, onDeleteCentral, isModalOpen, setIsModalOpen }) {
  const [search, setSearch] = useState('');
  const [filtroCidade, setFiltroCidade] = useState('Todas');
  const [filtroAcesso, setFiltroAcesso] = useState('Todos');
  const [editingCentral, setEditingCentral] = useState(null);
  const [viewingCentral, setViewingCentral] = useState(null);
  const [deletingCentral, setDeletingCentral] = useState(null);
  const [visibleLimit, setVisibleLimit] = useState(50);

  const safeCentrais = centrais || [];
  const totalCentrais = safeCentrais.length;
  const ativasCount = safeCentrais.filter(c => c.status === 'Ativa').length;
  const manutencaoCount = safeCentrais.filter(c => c.status === 'Manutenção').length;
  const comGpsCount = safeCentrais.filter(c => c.latitude && c.longitude).length;

  // Extract unique cities list
  const cidadesUnicas = Array.from(new Set(safeCentrais.map(c => c.cidade).filter(Boolean))).sort();

  const filteredCentrais = safeCentrais.filter(c => {
    const matchSearch = (c.nome || '').toLowerCase().includes(search.toLowerCase()) ||
                        (c.sigla || '').toLowerCase().includes(search.toLowerCase()) ||
                        (c.endereco || '').toLowerCase().includes(search.toLowerCase()) ||
                        (c.cidade || '').toLowerCase().includes(search.toLowerCase());
    const matchCidade = filtroCidade === 'Todas' || c.cidade === filtroCidade;
    const matchAcesso = filtroAcesso === 'Todos' || c.tiposAcesso?.some(a => (a || '').toLowerCase().includes(filtroAcesso.toLowerCase()));
    return matchSearch && matchCidade && matchAcesso;
  });

  const visibleCentrais = filteredCentrais.slice(0, visibleLimit);

  const handleEditClick = (cnt) => {
    setEditingCentral(cnt);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingCentral(null);
    setIsModalOpen(false);
  };

  // Helper to build accurate Google Maps search URL concatenating address + city
  const getGpsMapsUrl = (cnt) => {
    const enderecoConcat = [cnt.endereco, cnt.cidade].filter(Boolean).join(', ');
    const queryStr = enderecoConcat || (cnt.sigla ? cnt.sigla.replace(/^#\s*/, '') : '');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Biblioteca de Centrais ({totalCentrais} Importadas)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Base de dados completa atualizada em lista contínua.</p>
        </div>

        <button
          onClick={() => {
            setEditingCentral(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-purple-400" />
          <span>+ Nova Central</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Centrais</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white block mt-0.5">{totalCentrais}</span>
          </div>
          <Building2 className="w-6 h-6 text-purple-500" />
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Ativas</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{ativasCount}</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Cidades</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400 block mt-0.5">{cidadesUnicas.length}</span>
          </div>
          <MapPin className="w-6 h-6 text-amber-500" />
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Com GPS</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 block mt-0.5">{comGpsCount}</span>
          </div>
          <Navigation className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por sigla, cidade ou endereço..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleLimit(50); }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Cidade Filter */}
          <select
            value={filtroCidade}
            onChange={(e) => { setFiltroCidade(e.target.value); setVisibleLimit(50); }}
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl dark:bg-slate-800 dark:text-white max-w-[200px]"
          >
            <option value="Todas">Todas as Cidades ({cidadesUnicas.length})</option>
            {cidadesUnicas.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Acesso Filter */}
          <select
            value={filtroAcesso}
            onChange={(e) => { setFiltroAcesso(e.target.value); setVisibleLimit(50); }}
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl dark:bg-slate-800 dark:text-white"
          >
            <option value="Todos">Todos os Acessos</option>
            <option value="Portaria">Portaria</option>
            <option value="Bluetooth">Bluetooth</option>
            <option value="Cortada">Chave Cortada</option>
            <option value="Cliq">Cliq</option>
          </select>

          <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
            Exibindo {visibleCentrais.length} de {filteredCentrais.length}
          </span>
        </div>
      </div>

      {/* LISTA ESTRUTURADA DE CENTRAIS (FORMATO DE LISTA / TABELA) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Sigla / Código</th>
                <th className="py-3 px-4">Cidade</th>
                <th className="py-3 px-4">Endereço & Portaria</th>
                <th className="py-3 px-4">Tipos de Acesso</th>
                <th className="py-3 px-4">Observações</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {visibleCentrais.map((cnt) => (
                <tr key={cnt.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition group">
                  {/* Sigla */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xs shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-extrabold text-sm text-purple-700 dark:text-purple-300">{(cnt.sigla || '').replace(/^#\s*/, '')}</div>
                      </div>
                    </div>
                  </td>

                  {/* Cidade */}
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                      {cnt.cidade}
                    </span>
                  </td>

                  {/* Endereço & Portaria */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-start gap-1 text-slate-700 dark:text-slate-300 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{cnt.endereco}</span>
                    </div>
                    {cnt.numeroPortaria && cnt.numeroPortaria !== 'Portaria Padrão' && (
                      <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 block mt-0.5">
                        📍 {cnt.numeroPortaria}
                      </span>
                    )}
                  </td>

                  {/* Portaria & Acesso */}
                  <td className="py-3 px-4">
                    <div className="space-y-1 text-[11px]">
                      {cnt.portaria && (
                        <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{cnt.portaria}</div>
                      )}
                      {cnt.tiposAcesso && cnt.tiposAcesso.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {cnt.tiposAcesso.map(acesso => (
                            <span key={acesso} className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
                              {acesso}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Observações */}
                  <td className="py-3 px-4 max-w-xs text-[11px] text-slate-500">
                    {cnt.observacoes ? (
                      <span className="line-clamp-2 italic">{cnt.observacoes}</span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">-</span>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Botão Visualizar Central */}
                      <button
                        type="button"
                        onClick={() => setViewingCentral(cnt)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 transition cursor-pointer"
                        title="Visualizar Detalhes da Central"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visualizar</span>
                      </button>

                      {/* Botão GPS Redirecionando Endereço */}
                      <a
                        href={getGpsMapsUrl(cnt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-[11px] rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-1 transition"
                        title="Navegar no Google Maps para o Endereço Cadastrado"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        <span>GPS</span>
                      </a>

                      {/* Botão Editar Central */}
                      <button
                        onClick={() => handleEditClick(cnt)}
                        className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold text-[11px] rounded-lg border border-purple-200 dark:border-purple-800 flex items-center gap-1 transition cursor-pointer"
                        title="Editar Central"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Editar</span>
                      </button>

                      {/* Botão Excluir */}
                      <button
                        type="button"
                        onClick={() => setDeletingCentral(cnt)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                        title="Excluir Central (Requer Autorização)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão Carregar Mais Centrais */}
      {visibleLimit < filteredCentrais.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleLimit(prev => prev + 50)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Carregar mais Centrais (+50) • Restam {filteredCentrais.length - visibleLimit}
          </button>
        </div>
      )}

      <CentralModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={onSaveCentral}
        editingCentral={editingCentral}
      />

      <VisualizarCentralModal
        isOpen={Boolean(viewingCentral)}
        onClose={() => setViewingCentral(null)}
        central={viewingCentral}
        onEdit={(cntToEdit) => handleEditClick(cntToEdit)}
      />

      <ModalConfirmarExclusao
        isOpen={Boolean(deletingCentral)}
        onClose={() => setDeletingCentral(null)}
        onConfirm={() => {
          if (deletingCentral) {
            onDeleteCentral?.(deletingCentral.id);
            setDeletingCentral(null);
          }
        }}
        itemNome={deletingCentral ? `${deletingCentral.sigla || ''} - ${deletingCentral.nome}` : ''}
        tipoItem="Central"
      />
    </div>
  );
}
