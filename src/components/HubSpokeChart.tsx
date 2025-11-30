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

export default function HubSpokeChart({ data }: { data: HubSpokeItem[] }) {
  const router = useRouter();

  const width = 850;
  const height = 850;
  const radius = Math.min(width, height) / 2 - 160;

  const colorDefault = ["#0aa2fb", "#6ca439", "#f66630"];

  /** Do NOT use typed generics here — let TS infer */
  const pieGen = d3.pie().value(() => 1).sort(null);
  const arcs = pieGen(data);

  /** No PieArcDatum type — TS will infer correctly */
  const arcGen = d3.arc().innerRadius(100).outerRadius(radius);

  const sentenceCase = (t: string) =>
    t
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-[#f0f2f5] rounded-xl">
      <div className="bg-gradient-to-b from-[#2a4a7f] to-[#0b1320] w-full rounded-xl p-10 text-white relative">

        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#00aaff] to-[#67b7ff] bg-clip-text text-transparent">
          GENSEN – Topical Content Map
        </h2>

        {/* SVG WHEEL */}
        <svg width={width} height={height} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#35588f" />
              <stop offset="100%" stopColor="#0b1320" />
            </radialGradient>
          </defs>

          <rect width={width} height={height} fill="url(#bgGradient)" rx={24} />

          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {/* WEDGES */}
            {arcs.map((d: any, i: number) => {
              const color = colorDefault[i % colorDefault.length];
              return (
                <path
                  key={`arc-${i}`}
                  d={arcGen(d) || undefined}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={3}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.filter = `drop-shadow(0 0 15px ${color})`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.filter = "none";
                  }}
                  onClick={() => router.push(`/spoke/${data[i].hub}`)}
                />
              );
            })}

            {/* LABELS */}
            <AnimatePresence>
              {arcs.map((d: any, i: number) => {
                const color = colorDefault[i % colorDefault.length];
                const angle = (d.startAngle + d.endAngle) / 2;

                const outerLabelRadius = radius + 100;
                const labelRadius = i % 2 === 0 ? outerLabelRadius : radius + 70;
                const lineRadius = radius + 10;

                const x = Math.cos(angle - Math.PI / 2) * labelRadius;
                const y = Math.sin(angle - Math.PI / 2) * labelRadius;

                const lineX = Math.cos(angle - Math.PI / 2) * lineRadius;
                const lineY = Math.sin(angle - Math.PI / 2) * lineRadius;

                const label = data[i].title;
                const textWidth = Math.min(label.length * 8 + 40, 260);

                return (
                  <motion.g
                    key={`label-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: mounted ? 1 : 0,
                      y: mounted ? 0 : 10,
                    }}
                    transition={{
                      delay: 0.2 + i * 0.05,
                      duration: 0.5,
                    }}
                  >
                    <line
                      x1={lineX}
                      y1={lineY}
                      x2={x}
                      y2={y - 50}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />

                    <foreignObject
                      x={x - textWidth / 2}
                      y={y - 90}
                      width={textWidth}
                      height={100}
                      xmlns="http://www.w3.org/1999/xhtml"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          fontFamily: "Raleway, sans-serif",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#0b1320",
                          lineHeight: "1.4",
                          height: "100%",
                          padding: "10px 12px",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          borderRadius: "12px",
                          background: "rgba(255,255,255,0.96)",
                          border: "1px solid #dbeafe",
                          transition: "all 0.25s ease",
                        }}
                        onClick={() => router.push(`/spoke/${data[i].hub}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = color;
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.96)";
                          e.currentTarget.style.color = "#0b1320";
                        }}
                      >
                        {sentenceCase(label)}
                      </div>
                    </foreignObject>
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* CENTER CIRCLE */}
            <circle r={95} fill="white" stroke="#67b7ff" strokeWidth={2} />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#10284a"
              fontSize="18px"
              fontWeight={700}
            >
              Main Hubs
            </text>
          </g>
        </svg>

        {/* LEGEND */}
        <div className="mt-[40px] bg-[#e9eef6] text-[#0b1320] rounded-lg p-8">
          <div className="text-[18px] leading-[28px] text-left max-w-[700px] mx-auto">
            <div className="flex items-center mb-[16px]">
              <span className="w-[18px] h-[18px] rounded-full mr-[12px] bg-[#0aa2fb] border border-[#0b1320]" />
              <span>
                <strong>Informational</strong>
              </span>
            </div>

            <div className="flex items-center mb-[16px]">
              <span className="w-[18px] h-[18px] rounded-full mr-[12px] bg-[#6ca439] border border-[#0b1320]" />
              <span>
                <strong>Transactional</strong>
              </span>
            </div>

            <div className="flex items-center">
              <span className="w-[18px] h-[18px] rounded-full mr-[12px] bg-[#f66630] border border-[#0b1320]" />
              <span>
                <strong>Edge</strong>
              </span>
            </div>
          </div>

          <p className="mt-8 text-[16px] text-center text-[#1c2a40]">
            Hover or click a segment to explore its related content topics.
          </p>
        </div>

      </div>
    </div>
  );
}
