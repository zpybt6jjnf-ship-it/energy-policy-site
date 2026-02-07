"use client";

import { useState, useCallback, useId } from "react";

interface BottleneckLabsLogoProps {
  size?: number;
}

export default function BottleneckLabsLogo({ size = 36 }: BottleneckLabsLogoProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const uid = useId().replace(/:/g, "");

  const handleClick = useCallback(() => {
    if (isFlashing) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 3000);
  }, [isFlashing]);

  const gradientId = `siteGradient-${uid}`;
  const clipId = `mountainClip-${uid}`;

  return (
    <div
      className="shrink-0"
      style={{ width: size, height: size, display: "inline-block", cursor: "pointer" }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      title="Bottleneck Labs"
      aria-label="Bottleneck Labs logo - click for lightning effect"
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="block">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <clipPath id={clipId}>
            <path d="M 0,100 L 0,70 L 8,65 L 18,75 L 28,50 L 38,60 L 50,30 L 62,55 L 72,45 L 82,60 L 92,55 L 100,65 L 100,100 Z" />
          </clipPath>
        </defs>

        <style>{`
          .bnl-wire-${uid} { fill: none; stroke: #475569; stroke-width: 1.5; }
          .bnl-pulse-${uid} { fill: none; stroke: #f59e0b; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 8, 40; animation: bnl-flow-${uid} 1.2s linear infinite; }
          .bnl-pulse2-${uid} { animation-delay: -0.4s; }
          @keyframes bnl-flow-${uid} { from { stroke-dashoffset: 48; } to { stroke-dashoffset: 0; } }
          .bnl-flash-${uid} { animation: bnl-flashFade-${uid} 0.5s ease-out forwards; }
          @keyframes bnl-flashFade-${uid} { 0% { opacity: 1; } 10% { opacity: 0.2; } 20% { opacity: 0.9; } 30% { opacity: 0.1; } 40% { opacity: 0.7; } 60% { opacity: 0; } 100% { opacity: 0; } }
          @media (prefers-reduced-motion: reduce) {
            .bnl-pulse-${uid} { animation: none; }
            .bnl-flash-${uid} { animation: none; opacity: 0; }
          }
        `}</style>

        {/* Background */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill={isFlashing ? "#f8fafc" : "#0f172a"}
          style={{ transition: "fill 0.05s" }}
          rx="4"
        />

        {/* Mountain range outline */}
        <path
          d="M 0,70 L 8,65 L 18,75 L 28,50 L 38,60 L 50,30 L 62,55 L 72,45 L 82,60 L 92,55 L 100,65"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Clipped content: towers, wires, pulses */}
        <g clipPath={`url(#${clipId})`}>
          {/* Transmission towers */}
          <g stroke="#94a3b8" strokeWidth="1.5" fill="none">
            <path d="M 25,100 L 25,58 M 21,58 L 25,52 L 29,58 M 21,58 L 29,58" />
            <line x1="20" y1="64" x2="30" y2="64" />
            <line x1="21" y1="72" x2="29" y2="72" />
            <path d="M 50,100 L 50,38 M 46,38 L 50,32 L 54,38 M 46,38 L 54,38" />
            <line x1="44" y1="44" x2="56" y2="44" />
            <line x1="45" y1="52" x2="55" y2="52" />
            <path d="M 75,100 L 75,52 M 71,52 L 75,46 L 79,52 M 71,52 L 79,52" />
            <line x1="70" y1="58" x2="80" y2="58" />
            <line x1="71" y1="66" x2="79" y2="66" />
          </g>

          {/* Wires */}
          <path className={`bnl-wire-${uid}`} d="M 0,56 Q 25,62 50,46 Q 75,52 100,54" />
          <path className={`bnl-wire-${uid}`} d="M 0,64 Q 25,70 50,54 Q 75,60 100,62" />

          {/* Electric pulses (the moving light) */}
          <path className={`bnl-pulse-${uid}`} d="M 0,56 Q 25,62 50,46 Q 75,52 100,54" />
          <path className={`bnl-pulse-${uid} bnl-pulse2-${uid}`} d="M 0,64 Q 25,70 50,54 Q 75,60 100,62" />
        </g>

        {/* Border */}
        <rect x="1" y="1" width="98" height="98" stroke="#334155" strokeWidth="2" fill="none" rx="4" />

        {/* Lightning flash overlay */}
        {isFlashing && (
          <rect className={`bnl-flash-${uid}`} x="0" y="0" width="100" height="100" fill="#fff" rx="4" />
        )}
      </svg>
    </div>
  );
}
