import React, { useState } from 'react';
import { ShieldCheck, UserCheck, UserX, Plus, Search, Trash2, CheckCircle2 } from 'lucide-react';

export default function GerenciarUsuariosView({ usuarios, onUpdateUserRole, onApproveUser, onDeleteUser }) {
  const [search, setSearch] = useState('');

  const filtered = usuarios.filter(u => 
    u.nome.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.cargo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-600" />
            <span>Gerenciamento de Usuários & Acessos (Painel ADM)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Aprove cadastros pendentes, defina atribuições de Admin / Técnico e controle quem acessa o sistema.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Usuário</th>
                <th className="px-5 py-3">Cargo / Área</th>
                <th className="px-5 py-3">Função (Role)</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={usr.foto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                        alt={usr.nome}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{usr.nome}</span>
                        <span className="text-[11px] text-slate-400">{usr.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="text-slate-900 dark:text-slate-200 font-medium block">{usr.cargo}</span>
                    <span className="text-[10px] text-slate-400 block">{usr.area}</span>
                  </td>

                  <td className="px-5 py-3.5">
                    <select
                      value={usr.role}
                      onChange={(e) => onUpdateUserRole(usr.id, e.target.value)}
                      className="px-2.5 py-1 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 font-semibold"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Leitor">Leitor</option>
                    </select>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      usr.status === 'Ativo' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {usr.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right space-x-2">
                    {usr.status === 'Pendente' && (
                      <button
                        onClick={() => onApproveUser(usr.id)}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-semibold text-[11px] rounded-lg hover:bg-emerald-700"
                      >
                        Aprovar
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteUser(usr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                      title="Excluir Usuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
