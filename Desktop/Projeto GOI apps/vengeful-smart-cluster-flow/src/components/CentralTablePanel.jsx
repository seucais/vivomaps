import React, { useState, useMemo } from "react";
import { Search, Server, Plus, Edit2, Trash2, Cable, ExternalLink, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CentralTablePanel({
  nodes = [],
  links = [],
  onSelectNode,
  onEditNode,
  onDeleteNode,
  onAddConnectionToNode,
  onAddCentral
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchSearch =
        n.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.cluster_key.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "all" || n.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [nodes, searchTerm, statusFilter]);

  // Count active links per central
  const linksCountMap = useMemo(() => {
    const map = {};
    links.forEach((l) => {
      map[l.from_code] = (map[l.from_code] || 0) + 1;
      map[l.to_code] = (map[l.to_code] || 0) + 1;
    });
    return map;
  }, [links]);

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header & Controls */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-foreground">Gerenciador de Centrais</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {filteredNodes.length} de {nodes.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por código ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-purple-500 w-52"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-purple-500"
          >
            <option value="all">Todos os Status</option>
            <option value="operacional">Operacional</option>
            <option value="manutencao">Em Manutenção</option>
            <option value="alerta">Em Alerta</option>
            <option value="desativado">Desativado</option>
          </select>

          <Button
            size="sm"
            onClick={onAddCentral}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1 h-8"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Central
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1 max-h-[500px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-4">Código / Nome</th>
              <th className="py-2.5 px-3">Cluster</th>
              <th className="py-2.5 px-3">Tipo</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Capacidade</th>
              <th className="py-2.5 px-3 text-center">Links Ativos</th>
              <th className="py-2.5 px-3 text-center">Coord (X, Y)</th>
              <th className="py-2.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredNodes.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-muted-foreground">
                  Nenhuma central encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredNodes.map((node) => {
                const connCount = linksCountMap[node.code] || 0;

                return (
                  <tr
                    key={node.id}
                    className="hover:bg-muted/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectNode(node.id)}
                  >
                    {/* Code & Name */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {node.code}
                        </span>
                        <span className="font-semibold text-foreground">{node.name}</span>
                      </div>
                    </td>

                    {/* Cluster */}
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-muted-foreground uppercase text-[10px] bg-muted px-2 py-0.5 rounded">
                        {node.cluster_key}
                      </span>
                    </td>

                    {/* Type Hub/SPO */}
                    <td className="py-2.5 px-3">
                      {node.dark ? (
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-full">
                          HUB Principal
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          SPO Distribuído
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                          node.status === "operacional" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                          node.status === "manutencao" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                          node.status === "alerta" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
                          node.status === "desativado" && "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            node.status === "operacional" && "bg-emerald-500",
                            node.status === "manutencao" && "bg-amber-500",
                            node.status === "alerta" && "bg-rose-500",
                            node.status === "desativado" && "bg-slate-500"
                          )}
                        />
                        {node.status}
                      </span>
                    </td>

                    {/* Capacity */}
                    <td className="py-2.5 px-3 text-center font-semibold text-foreground">
                      {node.capacidade_gbps} Gbps
                    </td>

                    {/* Active Links Count */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded-full">
                        {connCount} links
                      </span>
                    </td>

                    {/* Coordinates */}
                    <td className="py-2.5 px-3 text-center font-mono text-[11px] text-muted-foreground">
                      ({node.x}, {node.y})
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onAddConnectionToNode(node.code)}
                          className="h-7 w-7 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                          title="Adicionar Conexão"
                        >
                          <Cable className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditNode(node)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Editar Central"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteNode(node.id)}
                          className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Excluir Central"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
