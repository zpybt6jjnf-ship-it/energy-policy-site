"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  useInView,
} from "motion/react";

interface KeyFindingProps {
  stat: string;
  description: string;
  color?: string;
}

/**
 * Parse a stat string to extract a leading numeric value, optional prefix/suffix.
 * Examples:
 *   "550 min"      -> { prefix: "", number: 550, suffix: " min", decimals: 0 }
 *   "$12.4B"       -> { prefix: "$", number: 12.4, suffix: "B", decimals: 1 }
 *   "3x increase"  -> { prefix: "", number: 3, suffix: "x increase", decimals: 0 }
 *   "AI + EVs"     -> null (no leading number)
 *   "Declining"    -> null
 */
function parseNumericStat(stat: string): {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
} | null {
  const match = stat.match(/^([^0-9]*?)([\d,]+(?:\.\d+)?)\s*(.*)$/);
  if (!match) return null;
  const prefix = match[1];
  const numStr = match[2].replace(/,/g, "");
  const number = parseFloat(numStr);
  if (isNaN(number)) return null;
  const decimalPart = numStr.split(".")[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  // Preserve original spacing between the number and whatever follows
  const suffix = stat.slice(match[1].length + match[2].length);
  return { prefix, number, suffix, decimals };
}

function AnimatedNumericStat({
  stat,
  color,
}: {
  stat: string;
  color: string;
}) {
  const parsed = parseNumericStat(stat)!;
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: parsed.decimals,
      maximumFractionDigits: parsed.decimals,
    }),
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      count.set(parsed.number);
      setHasAnimated(true);
      return;
    }
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      animate(count, parsed.number, {
        duration: 0.6,
        ease: "easeOut",
      });
    }
  }, [isInView, hasAnimated, count, parsed.number, prefersReduced]);

  return (
    <span
      ref={ref}
      className="text-3xl font-bold tracking-tight sm:text-4xl font-mono tabular-nums"
      style={{ color }}
    >
      {parsed.prefix}
      <motion.span>{display}</motion.span>
      {parsed.suffix}
    </span>
  );
}

function AnimatedTextStat({
  stat,
  color,
}: {
  stat: string;
  color: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  return (
    <motion.span
      ref={ref}
      className="text-3xl font-bold tracking-tight sm:text-4xl"
      style={{ color }}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1 }
          : prefersReduced
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.9 }
      }
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.5,
      }}
    >
      {stat}
    </motion.span>
  );
}

export default function KeyFinding({
  stat,
  description,
  color = "#0D7377",
}: KeyFindingProps) {
  const isNumeric = parseNumericStat(stat) !== null;

  return (
    <div className="mb-6 flex items-baseline gap-3">
      {isNumeric ? (
        <AnimatedNumericStat stat={stat} color={color} />
      ) : (
        <AnimatedTextStat stat={stat} color={color} />
      )}
      <span className="text-base text-muted">{description}</span>
    </div>
  );
}
