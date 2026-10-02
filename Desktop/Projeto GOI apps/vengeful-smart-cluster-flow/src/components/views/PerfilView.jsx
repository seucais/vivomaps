import React, { useState, useRef } from 'react';
import { User, Mail, ShieldCheck, MessageSquare, Send, Camera, Upload, CheckCircle } from 'lucide-react';

export default function PerfilView({ usuario, mensagens, onEnviarMensagem, onUpdateUsuario }) {
  const cameraRef = useRef(null);
  const fileRef = useRef(null);

  const [tipo, setTipo] = useState('Report de Erro');
  const [assunto, setAssunto] = useState('');
  const [mensagemText, setMensagemText] = useState('');

  const safeMensagens = mensagens || [];
  const safeUsuario = usuario || {};

  const handleFotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateUsuario?.({ ...safeUsuario, foto: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!assunto || !mensagemText) {
      alert('Preencha o assunto e a mensagem.');
      return;
    }

    onEnviarMensagem?.({
      id: `msg_${Date.now()}`,
      usuarioId: safeUsuario.id || 'usr_anon',
      usuarioNome: safeUsuario.nome || 'Usuário',
      tipo,
      assunto,
      mensagem: mensagemText,
      status: 'Pendente',
      respostaAdm: '',
      data: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    alert('Mensagem enviada com sucesso ao Administrador!');
    setAssunto('');
    setMensagemText('');
  };

  const minhasMensagens = safeMensagens.filter(m => m.usuarioId === safeUsuario.id || safeUsuario.role === 'Admin');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* User Header with Photo Upload */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group shrink-0">
          <img
            src={usuario?.foto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={usuario?.nome}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-violet-500 shadow-md"
          />

          <input type="file" ref={fileRef} onChange={handleFotoUpload} accept="image/*" className="hidden" />
          <input type="file" ref={cameraRef} onChange={handleFotoUpload} accept="image/*" capture="environment" className="hidden" />

          <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              onClick={() => cameraRef.current?.click()}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white"
              title="Tirar Foto"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white"
              title="Upload Foto"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{usuario?.nome || 'william bispo'}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border border-violet-300">
              {usuario?.role || 'Admin'}
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{usuario?.email || 'william.spc@vivo.com.br'}</span>
          </p>

          <p className="text-xs text-slate-400">
            {usuario?.cargo || 'Analista de Backbone SR'} • {usuario?.area || 'Rede Externa & Planta Interna Vivo'}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              onClick={() => cameraRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-violet-600" />
              <span>📷 Alterar Foto de Perfil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Form to contact ADM & History of messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Contact ADM / Report Error Form */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Solicitar Acesso ou Reportar Erro ao ADM</h3>
          </div>

          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Tipo de Solicitação</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Report de Erro">Report de Erro no App</option>
                <option value="Solicitação de Acesso">Solicitação de Acesso Especial</option>
                <option value="Sugestão">Sugestão de Melhoria</option>
                <option value="Dúvida">Dúvida Técnica</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Assunto *</label>
              <input
                type="text"
                placeholder="Resumo do problema ou solicitação"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Mensagem *</label>
              <textarea
                rows={4}
                placeholder="Descreva detalhadamente o erro ou a permissão necessária..."
                value={mensagemText}
                onChange={(e) => setMensagemText(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Mensagem ao Administrador</span>
            </button>
          </form>
        </div>

        {/* Message History */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Histórico de Mensagens ({minhasMensagens.length})</h3>

          {minhasMensagens.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Nenhuma mensagem registrada.</p>
          ) : (
            <div className="space-y-3">
              {minhasMensagens.map((msg) => (
                <div key={msg.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{msg.assunto}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      msg.status === 'Resolvido' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {msg.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{msg.mensagem}</p>

                  {msg.respostaAdm && (
                    <div className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 border border-violet-200 text-xs text-violet-900 dark:text-violet-200 mt-2">
                      <strong>Resposta do ADM:</strong> {msg.respostaAdm}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block text-right font-mono">{msg.data}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
