import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Route, 
  Zap, 
  Building2, 
  User, 
  ShieldCheck, 
  Database, 
  LogOut,
  Activity
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, usuario, onResetData }) {
  const menuItems = [
    { id: 'painel', label: 'Painel', icon: LayoutDashboard },
    { id: 'gravar-rota', label: 'Gravar Rota', icon: Video },
    { id: 'rotas', label: 'Rotas', icon: Route },
    { id: 'cabos', label: 'Cabos', icon: Zap },
    { id: 'centrais', label: 'Centrais', icon: Building2 },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'usuarios', label: 'Gerenciar Usuários', icon: ShieldCheck },
    { id: 'import-export', label: 'Importar / Exportar', icon: Database },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-900/40 font-bold text-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">BACKBONE - BBR</h1>
            <span className="text-[10px] text-slate-400 font-medium block">Gestão & Mapeamento Vivo</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-inner border-l-4 border-violet-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center gap-2.5">
          <img 
            src={usuario?.foto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
            alt={usuario?.nome || "Usuário"} 
            className="w-7 h-7 rounded-full object-cover border border-slate-700"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{usuario?.nome || "william bispo"}</p>
            <span className="text-[10px] text-violet-400 font-medium block">{usuario?.role || "Admin"}</span>
          </div>
        </div>

        <button
          onClick={onResetData}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Restaurar Dados Padrão</span>
        </button>
      </div>
    </aside>
  );
}
