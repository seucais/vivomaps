import React, { useRef } from 'react';
import { Upload, Download, Database, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

export default function ImportExportView({ store, onImportJSON, onExportJSON, onResetData }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          onImportJSON(json);
          alert('Dados importados com sucesso!');
        } catch (err) {
          alert('Arquivo JSON inválido. Verifique a estrutura.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-violet-600" />
          <span>Importação e Exportação de Dados do Sistema</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Faça backup completo das centrais, cabos, rotas e usuários ou restaure arquivos de projeto em formato JSON.
        </p>
      </div>

      {/* Grid of Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export JSON */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-center flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 mx-auto">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Exportar Base Completa</h3>
            <p className="text-xs text-slate-500">
              Gera um arquivo JSON contendo todas as centrais, cabos, rotas gravadas e usuários cadastrados.
            </p>
          </div>

          <button
            onClick={onExportJSON}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Backup JSON</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-center flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Importar Dados</h3>
            <p className="text-xs text-slate-500">
              Carregue um arquivo JSON salvo anteriormente para atualizar instantaneamente o banco de dados.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Carregar Arquivo JSON</span>
          </button>
        </div>

        {/* Reset Base */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-center flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Restaurar Dados Padrão</h3>
            <p className="text-xs text-slate-500">
              Restaura a base de dados padrão original com as centrais e cabos demonstrativos da Vivo.
            </p>
          </div>

          <button
            onClick={onResetData}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Base Padrão</span>
          </button>
        </div>
      </div>
    </div>
  );
}
