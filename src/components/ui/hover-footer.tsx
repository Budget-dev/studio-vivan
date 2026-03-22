"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskId, setMaskId] = useState("");

  useEffect(() => {
    setMaskId(`mask-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#FDE88A" />
              <stop offset="25%" stopColor="#FDE88A" />
              <stop offset="50%" stopColor="#FDE88A" />
              <stop offset="75%" stopColor="#FDE88A" />
              <stop offset="100%" stopColor="#FDE88A" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          animate={{
            cx: `${cursor.x / 3}%`,
            cy: `${cursor.y}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={maskId}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="font-headline font-black fill-transparent stroke-white/10 text-[60px] uppercase tracking-tighter"
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="font-headline font-black fill-transparent stroke-white/40 text-[60px] uppercase tracking-tighter"
        initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: duration ?? 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        mask={`url(#${maskId})`}
        className="font-headline font-black fill-white/80 text-[60px] uppercase tracking-tighter"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[120px]" />
    </div>
  );
};
