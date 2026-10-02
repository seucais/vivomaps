import { ScrollArea } from "@/components/ui/scroll-area";

export default function ATPanel({ areas, clusters, activeCluster }) {
  const grouped = activeCluster === "all";

  const clusterMap = {};
  if (grouped) {
    clusters.forEach((c) => {
      clusterMap[c.key] = c.label;
    });
  }

  const sortedAreas = [...areas].sort((a, b) => {
    if (grouped) {
      const aClusterOrder = clusters.find(c => c.key === a.cluster_key)?.order || 99;
      const bClusterOrder = clusters.find(c => c.key === b.cluster_key)?.order || 99;
      if (aClusterOrder !== bClusterOrder) return aClusterOrder - bClusterOrder;
    }
    return (a.order || 0) - (b.order || 0);
  });

  let lastCluster = null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground">Áreas de Transmissão</h3>
        <span className="bg-muted text-muted-foreground text-[11px] font-semibold rounded-full px-2.5 py-0.5">
          {areas.length} ATs
        </span>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="p-2">
          {sortedAreas.map((at) => {
            let showHeader = false;
            if (grouped && at.cluster_key !== lastCluster) {
              showHeader = true;
              lastCluster = at.cluster_key;
            }
            return (
              <div key={at.id}>
                {showHeader && (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 pt-3 pb-1">
                    {clusterMap[at.cluster_key] || at.cluster_key}
                  </div>
                )}
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="bg-accent text-primary text-[10px] font-bold font-mono px-2 py-0.5 rounded min-w-[52px] text-center whitespace-nowrap">
                    {at.sigla}
                  </span>
                  <span className="text-xs text-foreground">{at.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}