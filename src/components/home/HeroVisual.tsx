"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Dynamically import ForceGraph2D since it's client-side only
const ForceGraph2D = dynamic(() => import("react-force-graph-2d").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-transparent" />
});

const initialData = {
    nodes: [
        { id: "Physics", group: 1, val: 10, label: "Physics" },
        { id: "AI", group: 1, val: 12, label: "AI" },
        { id: "Python", group: 1, val: 8, label: "Python" },
        { id: "Math", group: 1, val: 9, label: "Math" },
        { id: "Statistics", group: 1, val: 8, label: "Statistics" },
        { id: "Machine Learning", group: 2, val: 15, label: "Machine Learning" },
        { id: "Data Scientist", group: 2, val: 14, label: "Data Scientist" },
        { id: "Robotics", group: 2, val: 13, label: "Robotics" },
        { id: "Quantum Engineer", group: 2, val: 14, label: "Quantum Engineer" }
    ],
    links: [
        { source: "Physics", target: "Quantum Engineer" },
        { source: "Math", target: "Quantum Engineer" },
        { source: "Math", target: "Machine Learning" },
        { source: "AI", target: "Machine Learning" },
        { source: "Python", target: "Machine Learning" },
        { source: "Statistics", target: "Data Scientist" },
        { source: "AI", target: "Data Scientist" },
        { source: "Physics", target: "Robotics" },
        { source: "AI", target: "Robotics" }
    ]
};

export function HeroVisual({ isExternalHover = false }: { isExternalHover?: boolean }) {
    const fgRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [highlightNodes, setHighlightNodes] = useState(new Set<any>([]));
    const [highlightLinks, setHighlightLinks] = useState(new Set<any>([]));
    const [hoverNode, setHoverNode] = useState<any>(null);

    // Track dimensions
    useEffect(() => {
        if (!containerRef.current) return;
        const update = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        const obs = new ResizeObserver(update);
        obs.observe(containerRef.current);
        update();
        return () => obs.disconnect();
    }, []);

    // Robust Offset Centering
    useEffect(() => {
        if (fgRef.current && dimensions.width > 0) {
            // Push the nodes to the left side of the right-hand card
            // cameraX positive = look right = graph moves left
            const cameraX = dimensions.width * 0.35;

            const centerForce = fgRef.current.d3Force("center");
            if (centerForce) {
                centerForce.x(0).y(0);
            }

            fgRef.current.d3Force("charge").strength(-400);
            fgRef.current.d3Force("link").distance(80);

            // Use periodic centering to ensure it sticks
            const timer = setTimeout(() => {
                fgRef.current.centerAt(cameraX, 0, 1000);
                fgRef.current.zoomToFit(800, 200);
                fgRef.current.d3AlphaTarget(0).d3ReheatSimulation();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [dimensions.width, dimensions.height]);

    return (
        <motion.div
            ref={containerRef}
            className="w-full h-full min-h-[500px] relative pointer-events-auto"
        >
            {dimensions.width > 0 && (
                <ForceGraph2D
                    ref={fgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={initialData}
                    backgroundColor="transparent"
                    nodeRelSize={9}
                    nodeId="id"
                    linkColor={() => "#2563EB44"}
                    linkWidth={link => (highlightLinks.has(link) ? 5 : 2)}
                    linkDirectionalParticles={4}
                    linkDirectionalParticleSpeed={0.005}
                    linkDirectionalParticleWidth={2}
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                        const label = node.label;
                        const fontSize = 14 / globalScale;
                        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                        const isHighlighted = highlightNodes.has(node.id) || hoverNode?.id === node.id;

                        // Beautiful gradient node
                        const r = 8 / globalScale;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);

                        if (isHighlighted) {
                            ctx.shadowColor = "#60A5FA";
                            ctx.shadowBlur = 20;
                            ctx.fillStyle = "#60A5FA";
                        } else {
                            ctx.fillStyle = node.group === 2 ? "#2563EB" : "#334155";
                        }
                        ctx.fill();
                        ctx.shadowBlur = 0;

                        // Text
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = isHighlighted ? "#FFFFFF" : "rgba(148, 163, 184, 0.9)";
                        ctx.fillText(label, node.x, node.y + 18 / globalScale);
                    }}
                    onNodeHover={(node: any) => {
                        setHoverNode(node);
                        if (node) {
                            setHighlightNodes(new Set([node.id]));
                            setHighlightLinks(new Set(initialData.links.filter(l => l.source === node.id || l.target === node.id)));
                        } else {
                            if (!isExternalHover) setHighlightNodes(new Set([]));
                            setHighlightLinks(new Set([]));
                        }
                    }}
                    cooldownTicks={200}
                />
            )}

            <div className="absolute top-8 left-8 p-5 bg-[#0F172A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl pointer-events-none z-20">
                <div className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-400 mb-1">Neural Engine</div>
                <div className="text-xs text-white/60 font-medium">Career mapping active</div>
            </div>
        </motion.div>
    );
}
