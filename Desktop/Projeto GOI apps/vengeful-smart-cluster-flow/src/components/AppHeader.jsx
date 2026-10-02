import React, { useRef } from "react";
import { Network, Plus, Cable, Download, Upload, RotateCcw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader({
  onAddCentral,
  onAddConnection,
  onExportJSON,
  onImportJSON,
  onResetTopology,
  totalCentrais,
  totalLinks
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          onImportJSON(json);
        } catch (err) {
          alert("Arquivo JSON inválido. Verifique o formato.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">
                Cadastro de Cabos e Centrais
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Base44 Vivo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cadastro e Gestão de Cabos de Fibra Óptica e Centrais · Backbone Vivo SP
            </p>
          </div>
        </div>

        {/* Counter Pill */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-800/80 border border-slate-700/60 rounded-lg px-4 py-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">Total Centrais:</span>
            <span className="font-bold text-white">{totalCentrais}</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-fuchsia-400" />
            <span className="text-slate-400">Conexões Óticas:</span>
            <span className="font-bold text-white">{totalLinks}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <Button
            size="sm"
            onClick={onAddCentral}
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs gap-1.5 shadow-md shadow-purple-900/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Central
          </Button>

          <Button
            size="sm"
            onClick={onAddConnection}
            variant="outline"
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-xs gap-1.5"
          >
            <Cable className="w-3.5 h-3.5 text-fuchsia-400" />
            Nova Conexão
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onExportJSON}
            className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1"
            title="Exportar Topologia como JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Exportar
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1"
            title="Importar Topologia JSON"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            Importar
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onResetTopology}
            className="text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs gap-1"
            title="Resetar para dados padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Resetar
          </Button>
        </div>
      </div>
    </header>
  );
}