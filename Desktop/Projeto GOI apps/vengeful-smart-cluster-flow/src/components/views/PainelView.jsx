import React from 'react';
import { 
  Route, 
  Zap, 
  Building2, 
  Users, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Bell, 
  Plus, 
  Video, 
  ShieldCheck,
  RefreshCw 
} from 'lucide-react';

export default function PainelView({ store, setActiveView, onOpenGravarRotaModal, onOpenNovoCaboModal, onOpenNovaCentralModal, onResetData }) {
  const { rotas, cabos, centrais, usuarios, avisos, atividades, usuarioAtual } = store;

  const totalRotas = rotas.length;
  const totalCabos = cabos.length;
  const totalCentrais = centrais.length;
  const usuariosAtivos = usuarios.filter(u => u.status === 'Ativo').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Bom dia, {usuarioAtual?.nome || 'william'}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Painel Backbone BBR • <strong className="text-emerald-600 dark:text-emerald-400">{totalCentrais} Centrais</strong> e <strong className="text-violet-600 dark:text-violet-400">{totalCabos} Troncos de Cabos</strong> alimentados via Google Sheets.
          </p>
        </div>
      </div>

      {/* Grid of Stat Cards matching exact layout from Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total de Rotas */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total de Rotas</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{totalRotas}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Route className="w-5 h-5" />
          </div>
        </div>

        {/* Total de Cabos */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total de Cabos</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{totalCabos}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Total de Centrais */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total de Centrais</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{totalCentrais}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Usuários Ativos */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Usuários Ativos</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{usuariosAtivos}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Atividades Hoje */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Atividades Hoje</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{atividades.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Esta Semana */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Esta Semana</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{totalCabos + totalRotas}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Este Mês */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Este Mês</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{totalCentrais + totalCabos}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/60 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Última Atividade */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Última Atividade</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block">20:19</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Panels: Avisos e Atividades Recentes matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Avisos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Últimos Avisos</h3>
          </div>

          {avisos.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Nenhum aviso recente.</p>
          ) : (
            <div className="space-y-3">
              {avisos.map((av) => (
                <div key={av.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{av.titulo}</span>
                    <span className="text-[10px] text-slate-400">{av.data}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{av.conteudo}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Atividades Recentes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Atividades Recentes</h3>
          </div>

          {atividades.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Nenhuma atividade recente</p>
          ) : (
            <div className="space-y-3">
              {atividades.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{act.acao}</span>
                    <p className="text-[11px] text-slate-500">{act.detalhes}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
