import React, { useState, useEffect } from "react";
import { X, Cable, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConnectionModal({
  open,
  onClose,
  onSave,
  editingLink = null,
  availableNodes = [],
  presetFromCode = "",
  activeCluster = "guarulhos"
}) {
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [distanciaKm, setDistanciaKm] = useState(10.5);
  const [tipoCabo, setTipoCabo] = useState("144 FO Monomodo (G.652.D)");
  const [trajeto, setTrajeto] = useState("Subterrâneo (Duto PVC)");
  const [status, setStatus] = useState("ativo");

  useEffect(() => {
    if (editingLink) {
      setFromCode(editingLink.from_code || "");
      setToCode(editingLink.to_code || "");
      setDistanciaKm(editingLink.distancia_km || 10);
      setTipoCabo(editingLink.tipo_cabo || "144 FO Monomodo (G.652.D)");
      setTrajeto(editingLink.trajeto || "Subterrâneo (Duto PVC)");
      setStatus(editingLink.status || "ativo");
    } else {
      setFromCode(presetFromCode || (availableNodes[0]?.code || ""));
      setToCode(availableNodes[1]?.code || availableNodes[0]?.code || "");
      setDistanciaKm(8.5);
      setTipoCabo("144 FO Monomodo (G.652.D)");
      setTrajeto("Subterrâneo (Duto PVC)");
      setStatus("ativo");
    }
  }, [editingLink, presetFromCode, availableNodes, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fromCode || !toCode) {
      alert("Selecione a central de origem e a central de destino.");
      return;
    }

    if (fromCode === toCode) {
      alert("A central de origem deve ser diferente da central de destino.");
      return;
    }

    const payload = {
      id: editingLink ? editingLink.id : `${activeCluster}-${fromCode}-${toCode}`,
      from_code: fromCode,
      to_code: toCode,
      cluster_key: editingLink ? editingLink.cluster_key : (activeCluster === "all" ? "guarulhos" : activeCluster),
      distancia_km: Number(distanciaKm) || 1.0,
      tipo_cabo: tipoCabo,
      trajeto: trajeto,
      status: status,
      largura_banda: "100 Gbps"
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
            <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
              <Cable className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              {editingLink ? "Editar Conexão de Fibra" : "Nova Conexão Ótica"}
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
                Central Origem *
              </label>
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                disabled={Boolean(editingLink)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500 font-mono text-xs font-bold"
              >
                {availableNodes.map((n) => (
                  <option key={n.id} value={n.code}>
                    {n.code} — {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Central Destino *
              </label>
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                disabled={Boolean(editingLink)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500 font-mono text-xs font-bold"
              >
                {availableNodes.map((n) => (
                  <option key={n.id} value={n.code}>
                    {n.code} — {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Distância (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={distanciaKm}
                onChange={(e) => setDistanciaKm(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Status do Link
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500 text-xs font-semibold"
              >
                <option value="ativo">Ativo (Normal)</option>
                <option value="degradado">Degradado (Atenuação)</option>
                <option value="rompido">Rompido (Crítico)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              Especificação do Cabo Ótico
            </label>
            <select
              value={tipoCabo}
              onChange={(e) => setTipoCabo(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500 text-xs"
            >
              <option value="144 FO Monomodo (G.652.D)">144 FO Monomodo (G.652.D)</option>
              <option value="72 FO Monomodo (G.652.D)">72 FO Monomodo (G.652.D)</option>
              <option value="48 FO Monomodo">48 FO Monomodo</option>
              <option value="24 FO Multimodo">24 FO Multimodo</option>
              <option value="Cabo Submarino Blindado">Cabo Submarino Blindado</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              Modo / Tipo de Trajeto
            </label>
            <select
              value={trajeto}
              onChange={(e) => setTrajeto(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500 text-xs"
            >
              <option value="Subterrâneo (Duto PVC)">Subterrâneo (Duto PVC)</option>
              <option value="Aéreo em Postes de Concessionária">Aéreo em Postes de Concessionária</option>
              <option value="Subterrâneo em Galeria Técnica">Subterrâneo em Galeria Técnica</option>
              <option value="Submarino / Travessia de Rios">Submarino / Travessia de Rios</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white gap-1">
              <Save className="w-3.5 h-3.5" />
              {editingLink ? "Atualizar Link" : "Criar Conexão"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
