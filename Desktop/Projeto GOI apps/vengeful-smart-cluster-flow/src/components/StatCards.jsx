import React from "react";
import { Server, Cable, Activity, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export default function StatCards({ nodes = [], links = [] }) {
  const totalNodes = nodes.length;
  const totalHubs = nodes.filter((n) => n.dark).length;
  const totalLinks = links.length;

  const operacionais = nodes.filter((n) => n.status === "operacional").length;
  const manutencao = nodes.filter((n) => n.status === "manutencao").length;
  const alertaNodes = nodes.filter((n) => n.status === "alerta").length;

  const linksAtivos = links.filter((l) => l.status === "ativo").length;
  const linksDegradados = links.filter((l) => l.status === "degradado").length;
  const linksRompidos = links.filter((l) => l.status === "rompido").length;

  const totalCapacidadeGbps = nodes.reduce(
    (acc, curr) => acc + (curr.capacidade_gbps || 100),
    0
  );

  const healthPercent =
    totalNodes > 0
      ? Math.round(((operacionais + linksAtivos) / (totalNodes + (totalLinks || 1))) * 100)
      : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Centrais Total */}
      <div className="bg-card border border-border/80 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Centrais de Rede
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Server className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">{totalNodes}</span>
          <span className="text-xs text-muted-foreground font-medium">centrais</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            {totalHubs} Hubs Principais
          </span>
          <span>·</span>
          <span>{totalNodes - totalHubs} SPOs</span>
        </div>
      </div>

      {/* Card 2: Conexões de Fibra */}
      <div className="bg-card border border-border/80 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Links de Fibra Ótica
          </span>
          <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
            <Cable className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">{totalLinks}</span>
          <span className="text-xs text-muted-foreground font-medium">conexões</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {linksAtivos} Ativos
          </span>
          {linksDegradados > 0 && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {linksDegradados} Atenuados
            </span>
          )}
          {linksRompidos > 0 && (
            <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {linksRompidos} Rompidos
            </span>
          )}
        </div>
      </div>

      {/* Card 3: Capacidade da Malha */}
      <div className="bg-card border border-border/80 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Capacidade Total
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">
            {(totalCapacidadeGbps / 1000).toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Tbps instalados</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Média: {totalNodes > 0 ? Math.round(totalCapacidadeGbps / totalNodes) : 0} Gbps / Central
        </div>
      </div>

      {/* Card 4: Saúde Operacional */}
      <div className="bg-card border border-border/80 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Saúde da Malha
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {healthPercent}%
          </span>
          <span className="text-xs text-muted-foreground font-medium">operacional</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{operacionais} operacionais</span>
          {manutencao > 0 && <span className="text-amber-500">· {manutencao} em manutenção</span>}
          {alertaNodes > 0 && <span className="text-rose-500">· {alertaNodes} em alerta</span>}
        </div>
      </div>
    </div>
  );
}