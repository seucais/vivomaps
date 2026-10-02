import { Network } from "lucide-react";
import { TOPOLOGIES } from "../lib/topologyData";
import TopologySVG from "./TopologySVG";

export default function TopologyPanel({ activeCluster, clusterLabel }) {
  const topo = activeCluster !== "all" ? TOPOLOGIES[activeCluster] : null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden h-full">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-xs font-semibold text-foreground">
          {topo
            ? `Topologia de Cabos Óticos — ${clusterLabel}`
            : "Topologia de Cabos Óticos"}
        </h3>
      </div>
      <div className="p-5 overflow-x-auto">
        {topo ? (
          <TopologySVG topo={topo} />
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
            <Network className="w-12 h-12 stroke-1" />
            <p className="text-sm">Selecione um cluster para visualizar a topologia</p>
          </div>
        )}
      </div>
    </div>
  );
}