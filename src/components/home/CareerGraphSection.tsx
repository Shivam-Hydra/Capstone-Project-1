"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState, useRef, useMemo, useEffect } from "react";
import { Info, Target, Network } from "lucide-react";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0F172A]" />
});

const graphData = {
    nodes: [
        { id: "You", group: "user", val: 12, color: "#FFFFFF" },
        { id: "Python", group: "skill", val: 6, color: "#2563EB" },
        { id: "Linear Algebra", group: "skill", val: 6, color: "#2563EB" },
        { id: "Statistics", group: "skill", val: 6, color: "#2563EB" },
        { id: "Neural Networks", group: "skill", val: 8, color: "#60A5FA" },
        { id: "Face Detection", group: "project", val: 9, color: "#818CF8" },
        { id: "Stock Predictor", group: "project", val: 9, color: "#818CF8" },
        { id: "ML Engineer", group: "job", val: 15, color: "#4F46E5" },
        { id: "Data Scientist", group: "job", val: 15, color: "#4F46E5" },
        { id: "AI Researcher", group: "job", val: 18, color: "#6366F1" }
    ],
    links: [
        { source: "You", target: "Python" },
        { source: "You", target: "Linear Algebra" },
        { source: "Python", target: "Neural Networks" },
        { source: "Linear Algebra", target: "Neural Networks" },
        { source: "Neural Networks", target: "Face Detection" },
        { source: "Neural Networks", target: "AI Researcher" },
        { source: "Statistics", target: "Data Scientist" },
        { source: "Python", target: "Stock Predictor" },
        { source: "Stock Predictor", target: "ML Engineer" },
        { source: "Face Detection", target: "ML Engineer" }
    ]
};

export function CareerGraphSection() {
    const fgRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [hoverNode, setHoverNode] = useState<any>(null);

    // Track dimensions of the black box container
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

    // Final Robust 3D Fix: Stop the "Compact Dot" issue
    useEffect(() => {
        if (!fgRef.current || dimensions.width === 0) return;

        // Spread nodes initially to prevent collapse at origin
        const { nodes } = graphData;
        nodes.forEach((n: any, i: number) => {
            if (!n.x) { // Only if not already positioned by D3
                n.x = Math.cos(i) * 200;
                n.y = Math.sin(i) * 200;
                n.z = (i - 5) * 60;
            }
        });

        // Aggressive forces for spread
        fgRef.current.d3Force("charge").strength(-2000);
        fgRef.current.d3Force("link").distance(300);

        // Ensure simulation is high energy
        fgRef.current.d3AlphaTarget(0.2).d3ReheatSimulation();

        // Staged camera snap with delay to allow layout to breathe
        const timer = setTimeout(() => {
            if (fgRef.current) {
                if (fgRef.current.zoomToFit) {
                    fgRef.current.zoomToFit(2000, 150);
                } else {
                    fgRef.current.cameraPosition({ x: 0, y: 0, z: 800 }, { x: 0, y: 0, z: 0 }, 2000);
                }

                // Gradually cool down
                setTimeout(() => {
                    if (fgRef.current) fgRef.current.d3AlphaTarget(0);
                }, 2000);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [dimensions.width, dimensions.height]);

    return (
        <section className="py-32 bg-[#0F172A] relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">

                {/* Left: Graph Container */}
                <div
                    ref={containerRef}
                    className="w-full lg:w-1/2 h-[600px] bg-black/40 rounded-[40px] border border-white/10 relative overflow-hidden shadow-2xl"
                >
                    {dimensions.width > 0 && (
                        <ForceGraph3D
                            key={`${dimensions.width}-${dimensions.height}`}
                            ref={fgRef}
                            width={dimensions.width}
                            height={dimensions.height}
                            graphData={graphData}
                            nodeLabel="id"
                            nodeVal="val"
                            nodeColor="color"
                            linkColor={() => "rgba(255,255,255,0.25)"}
                            linkWidth={2}
                            showNavInfo={false}
                            backgroundColor="rgba(0,0,0,0)"
                            onNodeHover={setHoverNode}
                            enableNodeDrag={false}
                            enableNavigationControls={true}
                            cooldownTicks={500}
                        />
                    )}

                    <div className="absolute bottom-6 left-6 p-4 bg-indigo-500/10 backdrop-blur-md rounded-2xl border border-indigo-500/20 pointer-events-none z-20">
                        <div className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mb-1">Global Neural Network</div>
                        <div className="text-xs text-white/40 italic">3D Career Vectorization</div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="w-full lg:w-1/2 space-y-10">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase"
                        >
                            Graph Intelligence
                        </motion.div>
                        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                            Mapped by <br />
                            <span className="text-indigo-500 italic">Big Data.</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Our graph engine visualizes trillions of data points across global markets to map your ideal path with mathematical precision.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: "Dynamic Nodes", icon: Target, desc: "Skills and projects acting as high-gravity nodes for your path." },
                            { title: "Force-Directed", icon: Network, desc: "Paths are weighted by real-world demand and industrial trends." }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-4 hover:border-indigo-500/30 transition-all group">
                                <item.icon className="h-8 w-8 text-indigo-500 group-hover:scale-110 transition-transform" />
                                <h4 className="text-xl font-bold text-white tracking-tight">{item.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 pt-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 shadow-lg">
                            <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">You</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 shadow-lg">
                            <div className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb]" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Skills</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 shadow-lg">
                            <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Jobs</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
