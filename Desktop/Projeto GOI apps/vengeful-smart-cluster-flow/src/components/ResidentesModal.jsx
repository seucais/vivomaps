import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  ativo: "bg-green-100 text-green-700",
  ferias: "bg-yellow-100 text-yellow-700",
  afastado: "bg-red-100 text-red-700",
};
const STATUS_LABELS = { ativo: "Ativo", ferias: "Férias", afastado: "Afastado" };

export default function ResidentesModal({ open, onClose, residents, areas, activeCluster, clusterLabel, onResidentsChange }) {
  const [central, setCentral] = useState("");
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("ativo");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  // Filter areas by cluster (if not "all")
  const availableAreas = activeCluster === "all"
    ? areas
    : areas.filter(a => a.cluster_key === activeCluster);

  const handleAdd = async () => {
    const c = central || availableAreas[0]?.sigla;
    if (!nome.trim() || !c) return;
    setSaving(true);
    const clusterKey = activeCluster === "all"
      ? (areas.find(a => a.sigla === c)?.cluster_key || "all")
      : activeCluster;
    const created = await base44.entities.Resident.create({
      cluster_key: clusterKey,
      central: c,
      nome: nome.trim(),
      status,
    });
    onResidentsChange([...residents, created]);
    setNome("");
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.Resident.delete(id);
    onResidentsChange(residents.filter(r => r.id !== id));
  };

  const visibleResidents = activeCluster === "all"
    ? residents
    : residents.filter(r => r.cluster_key === activeCluster);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h3 className="text-sm font-bold text-foreground">
            🏠 Gerenciar Residentes — {clusterLabel}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {/* Add form */}
          <div className="flex gap-2 flex-wrap items-end">
            <div className="flex flex-col gap-1 flex-1 min-w-[110px]">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Central</label>
              <select
                className="border border-border rounded-lg px-2.5 py-2 text-xs outline-none focus:border-primary bg-background"
                value={central}
                onChange={e => setCentral(e.target.value)}
              >
                {availableAreas.map(a => (
                  <option key={a.id} value={a.sigla}>{a.sigla}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-[2] min-w-[130px]">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nome do Residente</label>
              <input
                className="border border-border rounded-lg px-2.5 py-2 text-xs outline-none focus:border-primary bg-background"
                placeholder="Ex: João Silva"
                value={nome}
                onChange={e => setNome(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div className="flex flex-col gap-1" style={{ minWidth: 100 }}>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
              <select
                className="border border-border rounded-lg px-2.5 py-2 text-xs outline-none focus:border-primary bg-background"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="ativo">Ativo</option>
                <option value="ferias">Férias</option>
                <option value="afastado">Afastado</option>
              </select>
            </div>
            <button
              onClick={handleAdd}
              disabled={saving || !nome.trim()}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg px-3 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </button>
          </div>

          {/* List */}
          <div className="flex flex-col gap-2">
            {visibleResidents.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Nenhum residente cadastrado para este cluster.
              </p>
            ) : (
              visibleResidents.map(r => (
                <div key={r.id} className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/40 border border-border rounded-lg">
                  <span className="bg-accent text-primary text-[10px] font-bold font-mono px-2 py-0.5 rounded min-w-[52px] text-center whitespace-nowrap">
                    {r.central}
                  </span>
                  <span className="flex-1 text-xs font-medium text-foreground">{r.nome}</span>
                  <span className={cn("text-[10px] font-semibold px-2.5 py-0.5 rounded-full", STATUS_STYLES[r.status])}>
                    {STATUS_LABELS[r.status]}
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-red-50 rounded p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}