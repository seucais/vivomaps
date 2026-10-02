import React, { useState } from 'react';
import { ShieldAlert, Lock, User, X, Trash2 } from 'lucide-react';

export default function ModalConfirmarExclusao({ isOpen, onClose, onConfirm, itemNome = '', tipoItem = 'Rota' }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (login.trim() === 'BackboneSPC' && senha.trim() === 'BackboneSPC') {
      onConfirm();
      setLogin('');
      setSenha('');
      setErro('');
      onClose();
    } else {
      setErro('❌ Credenciais de administrador inválidas. Ação de exclusão não autorizada.');
    }
  };

  const handleCloseModal = () => {
    setLogin('');
    setSenha('');
    setErro('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-rose-200 dark:border-rose-900/60 shadow-2xl relative animate-in zoom-in-95 duration-150 space-y-4">
        
        <button 
          onClick={handleCloseModal} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Autenticação para Exclusão</span>
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
              Ação Restrita a Administradores
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Você está prestes a excluir {tipoItem.toLowerCase()} <strong className="text-slate-900 dark:text-white font-bold">"{itemNome}"</strong>. Informe as credenciais de autorização:
        </p>

        {erro && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold animate-in slide-in-from-top-1">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
              Login de Autorização *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Login de autorização"
                className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
              Senha de Autorização *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha de autorização"
                className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirmar Exclusão</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
