import React, { useState, useMemo } from "react";
import { Cable, Search, Plus, Edit2, Trash2, ArrowRightLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ConnectionTablePanel({
  links = [],
  onSelectLink,
  onEditLink,
  onDeleteLink,
  onAddConnection
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLinks = useMemo(() => {
    return links.filter((l) => {
      const matchSearch =
        l.from_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.to_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.tipo_cabo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.trajeto.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [links, searchTerm, statusFilter]);

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header & Controls */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Cable className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
          <h3 className="text-sm font-bold text-foreground">Gerenciador de Conexões de Fibra</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {filteredLinks.length} de {links.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar origem, destino ou trajeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500 w-56"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-fuchsia-500"
          >
            <option value="all">Todos os Status</option>
            <option value="ativo">Ativo (Normal)</option>
            <option value="degradado">Degradado (Atenuação)</option>
            <option value="rompido">Rompido (Crítico)</option>
          </select>

          <Button
            size="sm"
            onClick={onAddConnection}
            variant="outline"
            className="border-fuchsia-500/30 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-300 text-xs gap-1 h-8"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Conexão
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1 max-h-[500px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-4">Conexão (Origem ↔ Destino)</th>
              <th className="py-2.5 px-3">Cluster</th>
              <th className="py-2.5 px-3">Distância (km)</th>
              <th className="py-2.5 px-3">Especificação de Cabo</th>
              <th className="py-2.5 px-3">Tipo de Trajeto</th>
              <th className="py-2.5 px-3">Status do Link</th>
              <th className="py-2.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-muted-foreground">
                  Nenhuma conexão de fibra encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr
                  key={link.id}
                  className="hover:bg-muted/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectLink(link.id)}
                >
                  {/* Origin <-> Destination */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {link.from_code}
                      </span>
                      <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                      <span className="font-mono font-bold text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded">
                        {link.to_code}
                      </span>
                    </div>
                  </td>

                  {/* Cluster */}
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-muted-foreground uppercase text-[10px] bg-muted px-2 py-0.5 rounded">
                      {link.cluster_key}
                    </span>
                  </td>

                  {/* Distance */}
                  <td className="py-2.5 px-3 font-semibold text-foreground">
                    {link.distancia_km} km
                  </td>

                  {/* Cable Type */}
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    {link.tipo_cabo}
                  </td>

                  {/* Trajeto */}
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {link.trajeto}
                  </td>

                  {/* Link Status */}
                  <td className="py-2.5 px-3">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                        link.status === "ativo" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                        link.status === "degradado" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                        link.status === "rompido" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      )}
                    >
                      {link.status === "rompido" && <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />}
                      {link.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditLink(link)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Editar Conexão"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteLink(link.id)}
                        className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Excluir Conexão"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
