import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move, Info, PlusCircle, Trash2, Edit3, Cable } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function InteractiveTopologyCanvas({
  clusterData,
  selectedNodeId,
  selectedLinkId,
  onSelectNode,
  onSelectLink,
  onUpdateNodePosition,
  onAddConnectionClick,
  onEditNodeClick,
  onDeleteNodeClick,
  onEditLinkClick,
  onDeleteLinkClick
}) {
  const { width = 1200, height = 700, nodes = [], links = [], extra = "" } = clusterData || {};

  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(0.85);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  // Position map helper for line connections
  const posMap = {};
  nodes.forEach((n) => {
    posMap[n.code] = { x: n.x, y: n.y, node: n };
  });

  // Handle Dragging Node
  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    onSelectNode(node.id);
    onSelectLink(null);

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    // Convert screen coordinates to SVG viewBox space
    const scaleX = (width + 80) / rect.width;
    const scaleY = (height + 100) / rect.height;

    const svgX = (clientX - rect.left) * scaleX - 40;
    const svgY = (clientY - rect.top) * scaleY - 40;

    setDraggingNode(node);
    setDragOffset({
      x: svgX - node.x,
      y: svgY - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const scaleX = (width + 80) / rect.width;
    const scaleY = (height + 100) / rect.height;

    const newX = Math.round((clientX - rect.left) * scaleX - 40 - dragOffset.x);
    const newY = Math.round((clientY - rect.top) * scaleY - 40 - dragOffset.y);

    // Constrain coordinates within SVG bounds
    const boundedX = Math.max(30, Math.min(width - 30, newX));
    const boundedY = Math.max(30, Math.min(height - 30, newY));

    onUpdateNodePosition(draggingNode.id, boundedX, boundedY);
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  useEffect(() => {
    if (draggingNode) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [draggingNode, dragOffset]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedLink = links.find((l) => l.id === selectedLinkId);

  const viewWidth = width + 80;
  const viewHeight = height + 100;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col relative select-none">
      {/* Top Toolbar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-purple-400" />
            Canvas de Topologia Interativa
          </span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-medium">
            Arraste os nós para reposicionar
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setZoom((z) => Math.min(z + 0.15, 1.5))}
            className="h-7 w-7 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
            className="h-7 w-7 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setZoom(0.85)}
            className="h-7 px-2 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-white"
            title="Resetar Zoom"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            {Math.round(zoom * 100)}%
          </Button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowGrid(!showGrid)}
            className={cn(
              "h-7 px-2 text-[11px]",
              showGrid ? "text-purple-400 bg-purple-500/10" : "text-slate-400 hover:bg-slate-800"
            )}
          >
            Grade: {showGrid ? "ON" : "OFF"}
          </Button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative overflow-auto p-6 min-h-[500px] flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        <svg
          ref={svgRef}
          width={viewWidth * zoom}
          height={viewHeight * zoom}
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-75 block max-w-full"
        >
          {/* Custom SVG Header/Extra Markers */}
          {extra && <g dangerouslySetInnerHTML={{ __html: extra }} />}

          {/* Grid Background Lines (Optional) */}
          {showGrid && (
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          )}
          {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

          <g transform="translate(40, 40)">
            {/* LINK LINES */}
            {links.map((link) => {
              const pa = posMap[link.from_code];
              const pb = posMap[link.to_code];
              if (!pa || !pb) return null;

              const isSelected = selectedLinkId === link.id;
              const isConnectedToSelectedNode =
                selectedNode &&
                (link.from_code === selectedNode.code || link.to_code === selectedNode.code);

              // Colors based on status
              let lineColor = "#c026d3"; // default magenta/violet
              let strokeWidth = 2.4;
              let dashArray = "none";

              if (link.status === "degradado") {
                lineColor = "#f59e0b"; // Amber
                dashArray = "6 4";
              } else if (link.status === "rompido") {
                lineColor = "#ef4444"; // Red
                strokeWidth = 3;
                dashArray = "4 4";
              }

              if (isSelected) {
                lineColor = "#38bdf8"; // Cyan focus
                strokeWidth = 4;
              } else if (isConnectedToSelectedNode) {
                lineColor = "#a855f7"; // Bright Purple
                strokeWidth = 3.2;
              }

              // Midpoint calculation for link distance label
              const midX = (pa.x + pb.x) / 2;
              const midY = (pa.y + pb.y) / 2;

              return (
                <g key={link.id} className="cursor-pointer group" onClick={() => { onSelectLink(link.id); onSelectNode(null); }}>
                  {/* Invisible wide line for easy click target */}
                  <line
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke="transparent"
                    strokeWidth="14"
                  />
                  {/* Visible Line */}
                  <line
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke={lineColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeLinecap="round"
                    className="transition-colors duration-150 group-hover:stroke-cyan-400"
                  />
                  {/* Link distance pill tag */}
                  {(isSelected || isConnectedToSelectedNode) && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-24"
                        y="-10"
                        width="48"
                        height="18"
                        rx="9"
                        fill="#0f172a"
                        stroke={lineColor}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#f8fafc"
                      >
                        {link.distancia_km || "—"}km
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* NODES CIRCLES */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isDragging = draggingNode?.id === node.id;

              // Base circle colors matching ClusterFlow specs
              const baseFill = node.dark ? "#4c1d95" : "#64748b"; // Hub = dark purple, SPO = slate/gray
              const textFill = "#ffffff";

              // Ring color based on status
              let statusRing = "#6366f1"; // default indigo
              if (node.status === "manutencao") statusRing = "#f59e0b";
              if (node.status === "alerta") statusRing = "#ef4444";
              if (node.status === "desativado") statusRing = "#94a3b8";

              const label = node.code.includes(".") ? node.code.split(".").pop() : node.code;
              const fontSize = label.length > 5 ? 8 : label.length > 3 ? 9.5 : 11;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-grab active:cursor-grabbing transition-transform"
                  onMouseDown={(e) => handleMouseDown(e, node)}
                >
                  {/* Outer glow ring when selected */}
                  {isSelected && (
                    <circle
                      r="29"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Outer Ring */}
                  <circle
                    r="24"
                    fill="none"
                    stroke={statusRing}
                    strokeWidth={node.dark ? "3" : "1.8"}
                    opacity={isSelected ? "1" : "0.85"}
                  />

                  {/* Central Main Circle */}
                  <circle
                    r="22"
                    fill={baseFill}
                    className="transition-transform duration-100 hover:scale-105"
                  />

                  {/* Hub indicator icon / star dot */}
                  {node.dark && (
                    <circle cx="14" cy="-14" r="5" fill="#a855f7" stroke="#0f172a" strokeWidth="1.5" />
                  )}

                  {/* Code Label Text */}
                  <text
                    x="0"
                    y="1.5"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fontWeight="800"
                    fill={textFill}
                    fontFamily="monospace"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Node / Link Inspector Popup Drawer */}
      {(selectedNode || selectedLink) && (
        <div className="bg-slate-900/95 border-t border-slate-800 p-4 px-6 flex items-center justify-between gap-4 flex-wrap z-10 animate-in slide-in-from-bottom-2 duration-150">
          {selectedNode && (
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-extrabold font-mono text-sm">
                {selectedNode.code}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{selectedNode.name}</h4>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      selectedNode.dark
                        ? "bg-purple-900/80 text-purple-300 border border-purple-700"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    )}
                  >
                    {selectedNode.dark ? "Hub Concentrador" : "Estação SPO"}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {selectedNode.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Região: <span className="text-slate-200 font-medium">{selectedNode.cluster_key.toUpperCase()}</span> ·
                  Capacidade: <span className="text-slate-200 font-medium">{selectedNode.capacidade_gbps} Gbps</span> ·
                  Coord: <span className="font-mono text-slate-300">X: {selectedNode.x}, Y: {selectedNode.y}</span>
                </p>
              </div>
            </div>
          )}

          {selectedLink && (
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 font-bold">
                <Cable className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Link: {selectedLink.from_code} ↔ {selectedLink.to_code}
                  </h4>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      selectedLink.status === "ativo"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : selectedLink.status === "degradado"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    )}
                  >
                    {selectedLink.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distância: <span className="text-slate-200 font-medium">{selectedLink.distancia_km} km</span> ·
                  Cabo: <span className="text-slate-200 font-medium">{selectedLink.tipo_cabo}</span> ·
                  Trajeto: <span className="text-slate-200 font-medium">{selectedLink.trajeto}</span>
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons for selected node or link */}
          <div className="flex items-center gap-2">
            {selectedNode && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddConnectionClick(selectedNode.code)}
                  className="border-purple-700/60 bg-purple-900/30 text-purple-200 hover:bg-purple-900/60 text-xs gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Conectar
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditNodeClick(selectedNode)}
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteNodeClick(selectedNode.id)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 text-xs gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </Button>
              </>
            )}

            {selectedLink && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditLinkClick(selectedLink)}
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar Link
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteLinkClick(selectedLink.id)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 text-xs gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir Link
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
