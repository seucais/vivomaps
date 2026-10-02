import React, { useState, useEffect } from "react";
import { X, Server, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLUSTER_METADATA } from "@/lib/topologyStore";

export default function CentralModal({
  open,
  onClose,
  onSave,
  editingCentral = null,
  activeCluster = "guarulhos"
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [clusterKey, setClusterKey] = useState("guarulhos");
  const [isDark, setIsDark] = useState(true);
  const [status, setStatus] = useState("operacional");
  const [capacidade, setCapacidade] = useState(100);
  const [posX, setPosX] = useState(300);
  const [posY, setPosY] = useState(250);

  useEffect(() => {
    if (editingCentral) {
      setCode(editingCentral.code || "");
      setName(editingCentral.name || "");
      setClusterKey(editingCentral.cluster_key || "guarulhos");
      setIsDark(editingCentral.dark ?? true);
      setStatus(editingCentral.status || "operacional");
      setCapacidade(editingCentral.capacidade_gbps || 100);
      setPosX(editingCentral.x || 300);
      setPosY(editingCentral.y || 250);
    } else {
      setCode("");
      setName("");
      setClusterKey(activeCluster === "all" ? "guarulhos" : activeCluster);
      setIsDark(false);
      setStatus("operacional");
      setCapacidade(100);
      setPosX(350);
      setPosY(250);
    }
  }, [editingCentral, activeCluster, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      alert("Por favor, informe a sigla/código da central (ex: GR, PC, AO).");
      return;
    }

    const payload = {
      id: editingCentral ? editingCentral.id : `${clusterKey}-${code.trim().toUpperCase()}`,
      code: code.trim().toUpperCase(),
      name: name.trim() || `Central ${code.trim().toUpperCase()}`,
      cluster_key: clusterKey,
      dark: Boolean(isDark),
      status: status,
      capacidade_gbps: Number(capacidade) || 100,
      x: Number(posX) || 300,
      y: Number(posY) || 250
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              {editingCentral ? "Editar Central de Rede" : "Adicionar Nova Central"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Código / Sigla *
              </label>
              <input
                type="text"
                placeholder="Ex: GR, PC, AO"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={Boolean(editingCentral)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 font-mono text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Região / Cluster
              </label>
              <select
                value={clusterKey}
                onChange={(e) => setClusterKey(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 text-xs"
              >
                {Object.values(CLUSTER_METADATA)
                  .filter((c) => c.key !== "all")
                  .map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              Nome Completo da Central
            </label>
            <input
              type="text"
              placeholder="Ex: Central Guarulhos Centro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Tipo de Nó
              </label>
              <select
                value={isDark ? "dark" : "light"}
                onChange={(e) => setIsDark(e.target.value === "dark")}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 text-xs"
              >
                <option value="dark">HUB Concentrador Principal</option>
                <option value="light">SPO Estação Distribuída</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Status Operacional
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 text-xs"
              >
                <option value="operacional">Operacional (Normal)</option>
                <option value="manutencao">Em Manutenção</option>
                <option value="alerta">Em Alerta</option>
                <option value="desativado">Desativado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Capacidade (Gbps)
              </label>
              <input
                type="number"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Posição X (Canvas)
              </label>
              <input
                type="number"
                value={posX}
                onChange={(e) => setPosX(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Posição Y (Canvas)
              </label>
              <input
                type="number"
                value={posY}
                onChange={(e) => setPosY(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-purple-500 text-xs font-mono"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-1">
              <Save className="w-3.5 h-3.5" />
              {editingCentral ? "Atualizar Central" : "Criar Central"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
