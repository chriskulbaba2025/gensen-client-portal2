"use client";

import React, { useEffect, useState } from "react";
import * as d3 from "d3-shape";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface HubSpokeItem {
  id: string;
  title: string;
  hub: number;
}

export default function HubSpokeChart({
  data,
  businessName,
}: {
  data: HubSpokeItem[];
  businessName: string;
}) {
  const router = useRouter();

  // Only show HUB items (correct prefix)
  const hubs = data.filter((item) => item.id.startsWith("HUB#"));

  const width = 850;
  const height = 850;
  const radius = Math.min(width, height) / 2 - 160;

  const colors = ["#0aa2fb", "#6ca439", "#f66630"];

  const pieGen = d3.pie().value(() => 1).sort(null);
  const arcs = pieGen(hubs);

  const arcGen = d3.arc().innerRadius(100).outerRadius(radius);

  // Short, clean truncation for wheel labels
  const truncate = (t: string) =>
    t.length > 22 ? t.slice(0, 22).trim() + "…" : t;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 150);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-[#f0f2f5] rounded-xl">
      <div className="bg-gradient-to-b from-[#2a4a7f] to-[#0b1320] w-full rounded-xl p-10 text-white relative">

        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#00aaff] to-[#67b7ff] bg-clip-text text-transparent">
          GENSEN – Topical Content Map
        </h2>

        <svg width={width} height={height} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#35588f" />
              <stop offset="100%" stopColor="#0b1320" />
            </radialGradient>
          </defs>

          <rect width={width} height={height} fill="url(#bgGradient)" rx={24} />

          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {/* Wedges */}
            {arcs.map((d: any, i: number) => {
              const color = colors[i % colors.length];

              return (
                <path
                  key={`arc-${i}`}
                  d={arcGen(d) || undefined}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={3}
                  style={{ cursor: "pointer", transition: "0.25s" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as SVGPathElement).style.transform =
                      "scale(1.05)";
                    (e.currentTarget as SVGPathElement).style.filter =
                      `drop-shadow(0 0 15px ${color})`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as SVGPathElement).style.transform =
                      "scale(1)";
                    (e.currentTarget as SVGPathElement).style.filter = "none";
                  }}
                  onClick={() => router.push(`/spoke/${hubs[i].hub}`)}
                />
              );
            })}

            {/* Labels */}
            <AnimatePresence>
              {arcs.map((d: any, i: number) => {
                const color = colors[i % colors.length];
                const angle = (d.startAngle + d.endAngle) / 2;

                // BALANCED SPACING
                const labelRadius = radius + 105; // evenly spaced outer labels
                const lineRadius = radius + 25; // short connector line

                const x = Math.cos(angle - Math.PI / 2) * labelRadius;
                const y = Math.sin(angle - Math.PI / 2) * labelRadius;

                const lineX = Math.cos(angle - Math.PI / 2) * lineRadius;
                const lineY = Math.sin(angle - Math.PI / 2) * lineRadius;

                const label = truncate(hubs[i].title);
                const widthLimit = Math.min(label.length * 8 + 40, 220);

                return (
                  <motion.g
                    key={`label-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? 1 : 0 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                  >
                    <line
                      x1={lineX}
                      y1={lineY}
                      x2={x}
                      y2={y - 40}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />

                    <foreignObject
                      x={x - widthLimit / 2}
                      y={y - 80}
                      width={widthLimit}
                      height={80}
                      xmlns="http://www.w3.org/1999/xhtml"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          background: "rgba(255,255,255,0.95)",
                          borderRadius: "10px",
                          padding: "8px 10px",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#0b1320",
                          border: "1px solid #dbeafe",
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = color;
                          el.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = "rgba(255,255,255,0.95)";
                          el.style.color = "#0b1320";
                        }}
                        onClick={() => router.push(`/spoke/${hubs[i].hub}`)}
                      >
                        {label}
                      </div>
                    </foreignObject>
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* Center circle with business name */}
            <circle r={95} fill="white" stroke="#67b7ff" strokeWidth={2} />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#10284a"
              fontSize="18px"
              fontWeight={700}
            >
              {businessName || "Your Business"}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
