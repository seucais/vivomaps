import React from "react";
import { cn } from "@/lib/utils";
import { CLUSTER_METADATA } from "@/lib/topologyStore";
import { Layers } from "lucide-react";

export default function ClusterFilter({ activeCluster, onSelect, nodeCounts = {} }) {
  const clustersList = Object.values(CLUSTER_METADATA);

  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 shadow-sm flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
          <Layers className="w-3.5 h-3.5 text-purple-500" />
          <span>Região / Cluster:</span>
        </div>

        {clustersList.map((c) => {
          const isActive = activeCluster === c.key;
          const count = nodeCounts[c.key] || 0;

          return (
            <button
              key={c.key}
              onClick={() => onSelect(c.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-2",
                isActive
                  ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/20"
                  : "bg-background border-border text-foreground/80 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400"
              )}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              <span>{c.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}