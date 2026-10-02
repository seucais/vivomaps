import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  CheckCircle, 
  ShieldAlert, 
  MapPin, 
  Activity, 
  Filter, 
  Trash2, 
  X, 
  Save, 
  Check, 
  AlertCircle, 
  Edit3,
  Eye,
  Layers,
  Server,
  HardDrive,
  Cpu,
  Radio,
  ExternalLink,
  Info,
  Route
} from 'lucide-react';

// Helper to extract or derive equipment affectation counts (Esvaziado para inserção manual)
export function parseAfetacoes(cabo) {
  if (cabo.afetacoesObj && typeof cabo.afetacoesObj === 'object') {
    return cabo.afetacoesObj;
  }
  
  if (cabo.afetacoes && typeof cabo.afetacoes === 'object') {
    return cabo.afetacoes;
  }

  // Zeros por padrão para inserção manual pelo usuário
  return { dwdm: 0, sws: 0, swd: 0, hl4: 0, hl5g: 0, hl5d: 0 };
}

// ----------------------------------------------------------------------
// MODAL DE VISUALIZAÇÃO DETALHADA DO CABO ("Visualizar")
// ----------------------------------------------------------------------
export function CaboDetalhesModal({ isOpen, onClose, cabo, onEditClick, rotas = [] }) {
  if (!isOpen || !cabo) return null;

  const clusterLabel = cabo.cluster || cabo.cidade || 'Baixada Santista';
  const af = parseAfetacoes(cabo);
  const pad = (n) => (n && Number(n) > 0 ? String(n).padStart(2, '0') : '-');

  const idsVinculados = cabo.rotasVinculadas || [];
  const rotasDoCabo = (rotas || []).filter(r => idsVinculados.includes(r.id));

  const listaEquipamentos = [
    { label: 'DWDM', val: pad(af.dwdm) },
    { label: 'SWS', val: pad(af.sws) },
    { label: 'SWD', val: pad(af.swd) },
    { label: 'HL4', val: pad(af.hl4) },
    { label: 'HL5.G', val: pad(af.hl5g) },
    { label: 'HL5.D', val: pad(af.hl5d) }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150 space-y-6">
        
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shadow-xs">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs">
                  {clusterLabel}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  cabo.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {cabo.status || 'Ativo'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                Tronco: {cabo.nome}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid de Especificações Básicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Cluster / Conjunto */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conjunto / Cluster</span>
            <strong className="text-xs font-bold text-purple-700 dark:text-purple-300 block truncate mt-0.5">{clusterLabel}</strong>
          </div>

          {/* Cabo */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cabo (Tronco)</span>
            <strong className="text-xs font-bold text-slate-900 dark:text-white block truncate mt-0.5">{cabo.nome}</strong>
          </div>

          {/* Ponta A */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ponta_A (Origem)</span>
            <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block truncate mt-0.5">{cabo.origem}</strong>
          </div>

          {/* Ponta B */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ponta_B (Destino)</span>
            <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block truncate mt-0.5">{cabo.destino}</strong>
          </div>

          {/* Capacidade */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Capacidade</span>
            <strong className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">{cabo.capacidade} Fibras</strong>
          </div>

          {/* Extensão */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Extensão</span>
            <strong className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
              {cabo.distancia ? `${Number(cabo.distancia).toLocaleString()} m (${(cabo.distancia / 1000).toFixed(2)} km)` : '0 m'}
            </strong>
          </div>

          {/* Draco */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Draco (Status)</span>
            <strong className="text-xs font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
              {cabo.draco ? '🟢 Sim (Ativo)' : '🔴 Não'}
            </strong>
          </div>

          {/* FO Draco */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FO Draco</span>
            <strong className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
              {cabo.fibraDraco || 'N/A'}
            </strong>
          </div>
        </div>

        {/* SEÇÃO AFETAÇÕES POR EQUIPAMENTO */}
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Afetações por Classe de Equipamento (Manual):
            </span>
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
              6 Colunas Esvaziadas para Edição
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {listaEquipamentos.map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/60 text-center shadow-2xs space-y-0.5"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span>
                <span className={`text-base font-black font-mono block ${item.val !== '-' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-300 dark:text-slate-700'}`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SEÇÃO ROTAS VINCULADAS AO TRONCO */}
        <div className="p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-900 dark:text-violet-200 uppercase tracking-wider flex items-center gap-1.5">
              <Route className="w-4 h-4 text-violet-600" /> Rotas Vinculadas ao Tronco ({rotasDoCabo.length}):
            </span>
            
            <button
              onClick={() => {
                onClose();
                onExplorarRotas?.(cabo);
              }}
              className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>🔍 Explorar Rotas na Tela de Rotas</span>
            </button>
          </div>

          {rotasDoCabo.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {rotasDoCabo.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800/80 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-violet-700 dark:text-violet-300 block truncate">
                    {r.nome || `${r.origem} ➔ ${r.destino}`}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{r.origem} ➔ {r.destino}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {r.distanciaKm ? `${r.distanciaKm} km` : (r.tipo || 'Ativa')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 text-xs text-slate-400 italic">
              Nenhuma rota vinculada a este tronco. Clique no botão "Editar este Cabo" para associar uma ou mais rotas da aba "ROTAS".
            </div>
          )}
        </div>

        {/* KMZ & OBS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* KMZ */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> Trajeto KMZ / MyMaps:
            </span>

            {cabo.kmzUrl ? (
              <a
                href={cabo.kmzUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Trajeto no Google MyMaps</span>
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-400 italic">
                Nenhum link de KMZ cadastrado para este tronco.
              </div>
            )}
          </div>

          {/* OBS */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-purple-600" /> Observações Técnicas (OBS):
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 max-h-28 overflow-y-auto">
              {cabo.observacoes || 'Sem observações adicionais.'}
            </p>
          </div>
        </div>

        {/* Rodapé Modal */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
          >
            Fechar
          </button>

          <button
            onClick={() => {
              onClose();
              if (onEditClick) onEditClick(cabo);
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar este Cabo</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL DE CADASTRO E EDIÇÃO DO CABO (`CaboModal`)
// ----------------------------------------------------------------------
export function CaboModal({ isOpen, onClose, onSave, editingCabo, onNavigateToVincularRotas, rotas = [] }) {
  const defaultForm = {
    nome: '',
    cluster: 'Baixada Santista',
    cidade: '',
    origem: '',
    destino: '',
    capacidade: 144,
    distancia: 5000,
    tipo: 'Aéreo',
    status: 'Ativo',
    fibrasPrioritarias: '',
    draco: false,
    fibraDraco: '',
    kmzUrl: '',
    observacoes: '',
    rotasVinculadas: [],
    afetacoesObj: {
      dwdm: 0,
      sws: 0,
      swd: 0,
      hl4: 0,
      hl5g: 0,
      hl5d: 0
    }
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      if (editingCabo) {
        const defaultAf = parseAfetacoes(editingCabo);
        setFormData({ 
          ...editingCabo,
          cluster: editingCabo.cluster || editingCabo.cidade || 'Baixada Santista',
          rotasVinculadas: editingCabo.rotasVinculadas || [],
          afetacoesObj: typeof defaultAf === 'object' ? defaultAf : defaultForm.afetacoesObj
        });
      } else {
        setFormData(defaultForm);
      }
    }
  }, [isOpen, editingCabo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.cidade || !formData.origem || !formData.destino) {
      alert('Por favor, preencha os campos obrigatórios (*).');
      return;
    }

    onSave({
      ...formData,
      id: formData.id || `cab_${Date.now()}`,
      capacidade: Number(formData.capacidade),
      distancia: Number(formData.distancia),
      criadoEm: formData.criadoEm || new Date().toISOString().slice(0, 10)
    });

    onClose();
  };

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
          <Zap className="w-5 h-5 text-emerald-500" />
          <span>{editingCabo ? `Editar Tronco: ${formData.nome}` : 'Cadastrar Novo Tronco'}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">TRONCO (Nome) *</label>
              <input
                type="text"
                placeholder="Ex: TR102"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Conjunto / Cluster *</label>
              <input
                type="text"
                placeholder="Ex: Baixada Santista, Vale do Ribeira"
                value={formData.cluster}
                onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Cidade *</label>
              <input
                type="text"
                placeholder="Ex: Bertioga"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Ponta A (Origem) *</label>
              <input
                type="text"
                placeholder="Ex: BERT.BT"
                value={formData.origem}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Ponta B (Destino) *</label>
              <input
                type="text"
                placeholder="Ex: BERT.VA"
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Capacidade (Fibras) *</label>
              <select
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              >
                <option value={12}>12 Fibras</option>
                <option value={24}>24 Fibras</option>
                <option value={36}>36 Fibras</option>
                <option value={72}>72 Fibras</option>
                <option value={144}>144 Fibras</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Extensão (Metros) *</label>
              <input
                type="number"
                placeholder="Ex: 8234"
                value={formData.distancia}
                onChange={(e) => setFormData({ ...formData, distancia: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* DRACO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="draco-check"
                checked={formData.draco}
                onChange={(e) => setFormData({ ...formData, draco: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="draco-check" className="text-xs font-bold text-blue-900 dark:text-blue-200 cursor-pointer">
                Sistema Draco Ativo
              </label>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-0.5">FO Draco (Fibra)</label>
              <input
                type="text"
                placeholder="Ex: Fibra 7"
                value={formData.fibraDraco || ''}
                onChange={(e) => setFormData({ ...formData, fibraDraco: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* AFETAÇÕES DE EQUIPAMENTOS (INSERÇÃO MANUAL) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                Insira Manualmente as Afetações (Quantidades de Equipamentos):
              </label>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block text-center">DWDM</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.afetacoesObj?.dwdm ?? 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    afetacoesObj: { ...formData.afetacoesObj, dwdm: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 text-center border rounded-lg dark:bg-slate-800 font-mono font-bold text-rose-600"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block text-center">SWS</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.afetacoesObj?.sws ?? 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    afetacoesObj: { ...formData.afetacoesObj, sws: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 text-center border rounded-lg dark:bg-slate-800 font-mono font-bold text-rose-600"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block text-center">SWD</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.afetacoesObj?.swd ?? 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    afetacoesObj: { ...formData.afetacoesObj, swd: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 text-center border rounded-lg dark:bg-slate-800 font-mono font-bold text-rose-600"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block text-center">HL4</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.afetacoesObj?.hl4 ?? 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    afetacoesObj: { ...formData.afetacoesObj, hl4: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 text-center border rounded-lg dark:bg-slate-800 font-mono font-bold text-rose-600"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block text-center">HL5.G</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.afetacoesObj?.hl5g ?? 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    afetacoesObj: { ...formData.afetacoesObj, hl5g: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 text-center border rounded-lg dark:bg-slate-800 font-mono font-bold text-rose-600"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block text-center">HL5.D</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.afetacoesObj?.hl5d ?? 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    afetacoesObj: { ...formData.afetacoesObj, hl5d: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 text-center border rounded-lg dark:bg-slate-800 font-mono font-bold text-rose-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">URL do Trajeto KMZ / Google MyMaps</label>
            <input
              type="text"
              placeholder="https://www.google.com/maps/d/viewer?mid=..."
              value={formData.kmzUrl || ''}
              onChange={(e) => setFormData({ ...formData, kmzUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          {/* SEÇÃO REDIRECIONAMENTO PARA TELA DE ROTAS */}
          <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 space-y-2">
            <span className="text-xs font-bold text-violet-900 dark:text-violet-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Route className="w-4 h-4 text-violet-600" />
                Vincular Rotas Cadastradas em "ROTAS":
              </span>
              <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                {formData.rotasVinculadas?.length || 0} Selecionada(s)
              </span>
            </span>
            <p className="text-[11px] text-slate-500">
              Clique no botão abaixo para abrir a **Tela de Rotas** e marcar no formato de check quais rotas pertencem a este cabo tronco.
            </p>
            <button
              type="button"
              onClick={() => {
                onSave(formData);
                onClose();
                onNavigateToVincularRotas?.(formData);
              }}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Route className="w-4 h-4" />
              <span>📍 Ir para a Tela de Rotas para Marcar / Selecionar Rotas</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Observações Técnicas (OBS)</label>
            <textarea
              rows={2}
              placeholder="Adicione observações sobre este tronco..."
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
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
              <Save className="w-4 h-4 text-emerald-400" />
              <span>{editingCabo ? 'Atualizar Tronco' : 'Salvar Tronco'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// TELA PRINCIPAL: BIBLIOTECA DE CABOS & TRONCOS
// ----------------------------------------------------------------------
export default function CabosView({ cabos, rotas = [], onSaveCabo, onDeleteCabo, onNavigateToVincularRotas, onExplorarRotas, isModalOpen, setIsModalOpen }) {
  const [search, setSearch] = useState('');
  const [filtroCidade, setFiltroCidade] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [editingCabo, setEditingCabo] = useState(null);
  const [visualizingCabo, setVisualizingCabo] = useState(null);
  const [visibleLimit, setVisibleLimit] = useState(50);

  const safeCabos = cabos || [];
  const totalCabos = safeCabos.length;
  const ativosCount = safeCabos.filter(c => c.status === 'Ativo').length;
  const dracoCount = safeCabos.filter(c => c.draco).length;
  const distanciaTotalKm = (safeCabos.reduce((acc, c) => acc + (c.distancia || 0), 0) / 1000).toFixed(1);

  // Extract unique cities list
  const cidadesUnicas = Array.from(new Set(safeCabos.map(c => c.cidade).filter(Boolean))).sort();

  const filteredCabos = safeCabos.filter(c => {
    const matchSearch = (c.nome || '').toLowerCase().includes(search.toLowerCase()) || 
                        (c.cidade || '').toLowerCase().includes(search.toLowerCase()) ||
                        (c.origem || '').toLowerCase().includes(search.toLowerCase()) ||
                        (c.destino || '').toLowerCase().includes(search.toLowerCase());
    const matchCidade = filtroCidade === 'Todas' || c.cidade === filtroCidade;
    const matchStatus = filtroStatus === 'Todos' || c.status === filtroStatus;
    return matchSearch && matchCidade && matchStatus;
  });

  const visibleCabos = filteredCabos.slice(0, visibleLimit);

  const handleOpenNovoModal = () => {
    setEditingCabo(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cabo) => {
    setEditingCabo(cabo);
    setIsModalOpen(true);
  };

  const handleVisualizarClick = (cabo) => {
    setVisualizingCabo(cabo);
  };

  const handleModalClose = () => {
    setEditingCabo(null);
    setIsModalOpen(false);
  };

  // Helper renderizador para celulas de equipamento
  const renderCellEquipamento = (valor) => {
    const num = Number(valor || 0);
    if (num <= 0) {
      return <span className="text-slate-300 dark:text-slate-700 font-mono text-xs">-</span>;
    }
    return (
      <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 font-mono font-extrabold text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
        {String(num).padStart(2, '0')}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Biblioteca de Cabos & Troncos ({totalCabos} Importados)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tabela pronta para inserção manual das afetações de equipamentos (DWDM, SWS, SWD, HL4, HL5.G, HL5.D).
          </p>
        </div>

        <button
          onClick={handleOpenNovoModal}
          className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>+ Novo Cabo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Total Troncos</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white block">{totalCabos}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Ativos</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">{ativosCount}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Com Draco</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400 block">{dracoCount}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Distância Total</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white block">{distanciaTotalKm}km</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Cidades</span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400 block">{cidadesUnicas.length}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Filtrados</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white block">{filteredCabos.length}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por tronco, conjunto, ponta A ou B..."
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
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl dark:bg-slate-800 dark:text-white max-w-[180px]"
          >
            <option value="Todas">Todas as Cidades ({cidadesUnicas.length})</option>
            {cidadesUnicas.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => { setFiltroStatus(e.target.value); setVisibleLimit(50); }}
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl dark:bg-slate-800 dark:text-white"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Em Manutenção">Em Manutenção</option>
          </select>

          <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
            Exibindo {visibleCabos.length} de {filteredCabos.length}
          </span>
        </div>
      </div>

      {/* TABELA DE CABOS COM DADOS ESVAZIADOS PRONTOS PARA PREENCHIMENTO MANUAL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                
                {/* 1. CONJUNTO / CLUSTER */}
                <th className="py-3 px-3">CONJUNTO</th>
                
                {/* 2. CABO */}
                <th className="py-3 px-3">CABO</th>

                {/* 3-8. Pontas e Especificações */}
                <th className="py-3 px-3">PONTA_A</th>
                <th className="py-3 px-3">PONTA_B</th>
                <th className="py-3 px-3">CAPACIDADE</th>
                <th className="py-3 px-3">EXTENSÃO</th>
                <th className="py-3 px-3">DRACO</th>
                <th className="py-3 px-3">FO DRACO</th>
                
                {/* 9-14. 6 COLUNAS DE AFETAÇÃO DE EQUIPAMENTO */}
                <th className="py-3 px-2 text-center bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border-x border-rose-100 dark:border-rose-900/50">DWDM</th>
                <th className="py-3 px-2 text-center bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border-r border-rose-100 dark:border-rose-900/50">SWS</th>
                <th className="py-3 px-2 text-center bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border-r border-rose-100 dark:border-rose-900/50">SWD</th>
                <th className="py-3 px-2 text-center bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border-r border-rose-100 dark:border-rose-900/50">HL4</th>
                <th className="py-3 px-2 text-center bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border-r border-rose-100 dark:border-rose-900/50">HL5.G</th>
                <th className="py-3 px-2 text-center bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border-r border-rose-100 dark:border-rose-900/50">HL5.D</th>

                {/* 15-16. KMZ e OBS */}
                <th className="py-3 px-3">KMZ</th>
                <th className="py-3 px-3">OBS</th>

                {/* 17. ÚNICA COLUNA DE AÇÕES (STICKY DIREITA) */}
                <th className="py-3 px-4 text-center sticky right-0 bg-slate-100 dark:bg-slate-800 z-20 border-l border-slate-200 dark:border-slate-700 shadow-xs font-extrabold text-purple-900 dark:text-purple-200">
                  AÇÕES
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {visibleCabos.map((cabo) => {
                const clusterText = cabo.cluster || cabo.cidade || 'Baixada Santista';
                const af = parseAfetacoes(cabo);

                return (
                  <tr key={cabo.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition group">
                    
                    {/* 1. CONJUNTO */}
                    <td className="py-3 px-3 font-semibold text-purple-700 dark:text-purple-300">
                      <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-900 text-[10px] font-mono font-bold">
                        {clusterText}
                      </span>
                    </td>

                    {/* 2. CABO */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{cabo.nome}</span>
                      </div>
                    </td>

                    {/* 3. PONTA_A */}
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {cabo.origem}
                    </td>

                    {/* 4. PONTA_B */}
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {cabo.destino}
                    </td>

                    {/* 5. CAPACIDADE */}
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {cabo.capacidade} FO
                    </td>

                    {/* 6. EXTENSÃO */}
                    <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap text-[11px]">
                      {cabo.distancia ? `${Number(cabo.distancia).toLocaleString()} m` : '0 m'}
                    </td>

                    {/* 7. DRACO */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {cabo.draco ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200">
                          Sim
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Não</span>
                      )}
                    </td>

                    {/* 8. FO DRACO */}
                    <td className="py-3 px-3 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                      {cabo.fibraDraco || '-'}
                    </td>

                    {/* 9-14. COLUNAS INDIVIDUAIS DE AFETAÇÃO (EXIBE - QUANDO 0, E VALOR REAL DESTACADO AO PREENCHER) */}
                    {/* DWDM */}
                    <td className="py-3 px-2 text-center bg-rose-50/30 dark:bg-rose-950/10 border-x border-rose-100/60 dark:border-rose-900/40">
                      {renderCellEquipamento(af.dwdm)}
                    </td>

                    {/* SWS */}
                    <td className="py-3 px-2 text-center bg-rose-50/30 dark:bg-rose-950/10 border-r border-rose-100/60 dark:border-rose-900/40">
                      {renderCellEquipamento(af.sws)}
                    </td>

                    {/* SWD */}
                    <td className="py-3 px-2 text-center bg-rose-50/30 dark:bg-rose-950/10 border-r border-rose-100/60 dark:border-rose-900/40">
                      {renderCellEquipamento(af.swd)}
                    </td>

                    {/* HL4 */}
                    <td className="py-3 px-2 text-center bg-rose-50/30 dark:bg-rose-950/10 border-r border-rose-100/60 dark:border-rose-900/40">
                      {renderCellEquipamento(af.hl4)}
                    </td>

                    {/* HL5.G */}
                    <td className="py-3 px-2 text-center bg-rose-50/30 dark:bg-rose-950/10 border-r border-rose-100/60 dark:border-rose-900/40">
                      {renderCellEquipamento(af.hl5g)}
                    </td>

                    {/* HL5.D */}
                    <td className="py-3 px-2 text-center bg-rose-50/30 dark:bg-rose-950/10 border-r border-rose-100/60 dark:border-rose-900/40">
                      {renderCellEquipamento(af.hl5d)}
                    </td>

                    {/* 15. KMZ */}
                    <td className="py-3 px-3">
                      {cabo.kmzUrl ? (
                        <a
                          href={cabo.kmzUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 transition"
                          title="Abrir Trajeto MyMaps"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>KMZ</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-300 dark:text-slate-700">-</span>
                      )}
                    </td>

                    {/* 16. OBS */}
                    <td className="py-3 px-3 max-w-xs text-[10px] text-slate-500 truncate">
                      {cabo.observacoes || '-'}
                    </td>

                    {/* 17. ÚNICA COLUNA DE AÇÕES STICKY À DIREITA (VISUALIZAR, EDITAR, EXCLUIR) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-emerald-50/80 dark:group-hover:bg-slate-800/90 z-10 border-l border-slate-200 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* 1. Botão VISUALIZAR (Azul) */}
                        <button
                          onClick={() => handleVisualizarClick(cabo)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer shrink-0"
                          title="Visualizar Detalhes Completos do Cabo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visualizar</span>
                        </button>

                        {/* 2. Botão EDITAR (Verde) */}
                        <button
                          onClick={() => handleEditClick(cabo)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer shrink-0"
                          title="Editar Informações deste Cabo e Afetações"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* 3. Botão EXCLUIR (Vermelho) */}
                        <button
                          onClick={() => onDeleteCabo(cabo.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer shrink-0"
                          title="Excluir Tronco"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão Carregar Mais Cabos */}
      {visibleLimit < filteredCabos.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleLimit(prev => prev + 50)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Carregar mais Cabos (+50) • Restam {filteredCabos.length - visibleLimit}
          </button>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      <CaboModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={onSaveCabo}
        editingCabo={editingCabo}
        onNavigateToVincularRotas={onNavigateToVincularRotas}
        rotas={rotas}
      />

      {/* Modal de Detalhes Completo ("Visualizar") */}
      <CaboDetalhesModal
        isOpen={!!visualizingCabo}
        onClose={() => setVisualizingCabo(null)}
        cabo={visualizingCabo}
        onEditClick={handleEditClick}
        onExplorarRotas={onExplorarRotas}
        rotas={rotas}
      />

    </div>
  );
}
