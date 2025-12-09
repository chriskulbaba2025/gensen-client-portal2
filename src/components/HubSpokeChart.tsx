"use client";

import React, { useEffect, useState } from "react";
import * as d3 from "d3-shape";
import { useRouter } from "next/navigation";
import { Search, ClipboardList, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HubSpokeItem {
  id: string;
  title: string;
  hub?: number;
}

export default function HubSpokeChart({
  data,
  businessName,
}: {
  data: any[];
  businessName: string;
}) {
  const router = useRouter();

  const normalized = data.map((item) => ({
    id: item.id,
    title: item.title,
    hub: item.hub ?? null,
  }));

  const width = 850;
  const height = 850;
  const radius = Math.min(width, height) / 2 - 160;

  const colorDefault = ["#0aa2fb", "#6ca439", "#f66630"];

  const pieGen = d3.pie().value(() => 1).sort(null);
  const arcs = pieGen(normalized);

  const arcGen = d3.arc().innerRadius(100).outerRadius(radius);

  const sentenceCase = (t: string) =>
    t
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

 const getHubNumber = (_item: any, index: number) => {
  return index + 1;
};

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-[#f0f2f5] rounded-xl">
      <div className="bg-gradient-to-b from-[#2a4a7f] to-[#0b1320] w-full rounded-xl p-10 text-white relative">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#00aaff] to-[#67b7ff] bg-clip-text text-transparent">
          {businessName
            ? `${businessName} · Topical Map`
            : "GENSEN – Topical Content Map"}
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
            {/* ARC CLICK FIX */}
            {arcs.map((d: any, i: number) => {
              const color = colorDefault[i % colorDefault.length];
              const hubNumber = getHubNumber(normalized[i], i);

              return (
                <path
                  key={`arc-${i}`}
                  d={arcGen(d) || undefined}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.25s ease, filter 0.25s ease",
                    transformOrigin: "center center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.filter = `drop-shadow(0 0 15px ${color})`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.filter = "none";
                  }}
                  onClick={() => {
  console.log("NAVIGATING TO HUB:", hubNumber);
  router.push(`/dashboard/hub/${hubNumber}`);
}}
                />
              );
            })}

            <AnimatePresence>
              {arcs.map((d: any, i: number) => {
                const color = colorDefault[i % colorDefault.length];
                const angle = (d.startAngle + d.endAngle) / 2;

                const outerLabelRadius = radius + 100;
                const labelRadius =
                  i % 2 === 0 ? outerLabelRadius : radius + 70;
                const lineRadius = radius + 10;

                const x = Math.cos(angle - Math.PI / 2) * labelRadius;
                const y = Math.sin(angle - Math.PI / 2) * labelRadius;

                const lineX = Math.cos(angle - Math.PI / 2) * lineRadius;
                const lineY = Math.sin(angle - Math.PI / 2) * lineRadius;

                const label = normalized[i].title;
                const textWidth = Math.min(label.length * 8 + 40, 260);

                const isLeft = x < 0;
                const hubNumber = getHubNumber(normalized[i], i);

                return (
                  <motion.g
                    key={`label-${i}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      mounted
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{
                      duration: 0.4,
                      delay: 0.03 * i,
                      ease: "easeOut",
                    }}
                  >
                    <line
                      x1={lineX}
                      y1={lineY}
                      x2={x}
                      y2={y}
                      stroke={color}
                      strokeWidth={1.5}
                    />

                    <foreignObject
                      x={x + (isLeft ? -textWidth : 0)}
                      y={y - 20}
                      width={textWidth}
                      height={80}
                      style={{ overflow: "visible" }}
                    >
                      <div
                        style={{
                          background: "rgba(255,255,255,0.96)",
                          borderRadius: "9999px",
                          padding: "6px 14px",
                          fontSize: "13px",
                          lineHeight: "1.45",
                          color: "#0b1320",
                          boxShadow:
                            "0 10px 25px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(148,163,184,0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          cursor: "pointer",
                          border: "1px solid #dbeafe",
                          transition: "all 0.25s ease",
                        }}
                        onClick={() =>
                          router.push(`/dashboard/hub/${hubNumber}`)
                        }
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

            <circle r={95} fill="white" stroke="#67b7ff" strokeWidth={2} />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#10284a"
              fontSize="18px"
              fontWeight={700}
            >
              {businessName || "Main Hubs"}
            </text>
          </g>
        </svg>

        <div className="mt-[40px] bg-[#e9eef6] text-[#0b1320] rounded-lg p-8">
          <div className="text-[15px] leading-[24px] text-left max-w-[700px] mx-auto mb-6">
            <p>
              Each hub is colour-coded by funnel stage so you can see how topics
              work together across your customer journey.
            </p>
            <p>
              Blue builds awareness, green supports evaluation, and orange
              drives action.
            </p>
            <p>
              This gives you a quick way to balance reach, education, and
              conversion instead of publishing at random.
            </p>
          </div>

          <div className="text-[16px] leading-[26px] text-left max-w-[700px] mx-auto">
            <div className="flex items-center mb-[16px]">
              <span className="w-[18px] h-[18px] rounded-full mr-[12px] bg-[#0aa2fb] border border-[#0b1320]" />
              <Search size={18} className="mr-[8px] text-[#0aa2fb]" />
              <span>
                <strong>Awareness · Top-of-Funnel</strong>
              </span>
            </div>

            <div className="flex items-center mb-[16px]">
              <span className="w-[18px] h-[18px] rounded-full mr-[12px] bg-[#6ca439] border border-[#0b1320]" />
              <ClipboardList size={18} className="mr-[8px] text-[#6ca439]" />
              <span>
                <strong>Consideration · Mid-Funnel</strong>
              </span>
            </div>

            <div className="flex items-center">
              <span className="w-[18px] h-[18px] rounded-full mr-[12px] bg-[#f66630] border border-[#0b1320]" />
              <CheckCircle size={18} className="mr-[8px] text-[#f66630]" />
              <span>
                <strong>Decision · Bottom-of-Funnel</strong>
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
