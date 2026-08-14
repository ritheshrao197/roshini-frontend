import React from "react";

const STROKE_WIDTH = 1.1;

interface GrainIconProps {
  /** 0-7 — varies stalk curve and grain spacing per grain type for visual distinction within the family. */
  seed?: number;
}

export function GrainIcon({ seed = 0 }: GrainIconProps) {
  const curve = 6 + (seed % 4) * 2;
  const grainCount = 5 + (seed % 3);
  const positions = Array.from({ length: grainCount }, (_, i) => 6 + i * (28 / grainCount));
  return (
    <svg viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
      <path vectorEffect="non-scaling-stroke" d={`M12 38 C ${12 - curve / 2} 30 ${12 + curve / 2} 20 12 2`} />
      {positions.map((y, i) => (
        <g key={i} transform={`translate(12 ${y})`}>
          <ellipse vectorEffect="non-scaling-stroke" cx={i % 2 === 0 ? -3 : 3} cy="0" rx="2.2" ry="1.3" transform={`rotate(${i % 2 === 0 ? -18 : 18})`} />
        </g>
      ))}
    </svg>
  );
}

interface NutIconProps {
  style?: "round" | "oval" | "teardrop";
}

const NUT_SHAPES: Record<NonNullable<NutIconProps["style"]>, string> = {
  round: "M12 4 C 18 4 20 10 20 16 C 20 24 16 28 12 28 C 8 28 4 24 4 16 C 4 10 6 4 12 4 Z",
  oval: "M12 3 C 17 3 19 10 19 17 C 19 24 16 29 12 29 C 8 29 5 24 5 17 C 5 10 7 3 12 3 Z",
  teardrop: "M12 2 C 16 8 20 14 20 20 C 20 25 16 29 12 29 C 8 29 4 25 4 20 C 4 14 8 8 12 2 Z",
};

export function NutIcon({ style = "round" }: NutIconProps) {
  return (
    <svg viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
      <path vectorEffect="non-scaling-stroke" d={NUT_SHAPES[style]} />
      <path vectorEffect="non-scaling-stroke" d="M12 8 L12 24" opacity="0.5" />
    </svg>
  );
}

interface SeedIconProps {
  style?: "flat" | "round" | "longOval";
}

const SEED_DIMS: Record<NonNullable<SeedIconProps["style"]>, { rx: number; ry: number }> = {
  flat: { rx: 9, ry: 5 },
  round: { rx: 7, ry: 7 },
  longOval: { rx: 5, ry: 10 },
};

export function SeedIcon({ style = "round" }: SeedIconProps) {
  const { rx, ry } = SEED_DIMS[style];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} className="w-full h-full">
      <ellipse vectorEffect="non-scaling-stroke" cx="12" cy="12" rx={rx} ry={ry} />
      <path vectorEffect="non-scaling-stroke" d={`M12 ${12 - ry} L12 ${12 + ry}`} opacity="0.4" />
    </svg>
  );
}

interface PodIconProps {
  style?: "date" | "peanut";
}

export function PodIcon({ style = "date" }: PodIconProps) {
  if (style === "peanut") {
    return (
      <svg viewBox="0 0 24 34" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
        <path vectorEffect="non-scaling-stroke" d="M12 2 C 18 2 19 8 15 11 C 19 13 19 20 15 22 C 19 25 18 32 12 32 C 6 32 5 25 9 22 C 5 20 5 13 9 11 C 5 8 6 2 12 2 Z" />
        <path vectorEffect="non-scaling-stroke" d="M12 11 C 13 11.5 13 12.5 12 13" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 34" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
      <path vectorEffect="non-scaling-stroke" d="M12 3 C 19 8 20 16 17 24 C 15 29 9 29 7 24 C 4 16 5 8 12 3 Z" />
      <path vectorEffect="non-scaling-stroke" d="M8 20 C 10 22 14 22 16 20" opacity="0.4" />
    </svg>
  );
}

/**
 * Maps each ingredient's backend `iconKey` to a configured icon. Keys here
 * MUST exactly match the `iconKey` values in server/seed-ingredients.js —
 * a mismatch means that ingredient's card renders with no icon.
 */
export const ICON_MAP: Record<string, () => React.JSX.Element> = {
  "grain-jowar": () => <GrainIcon seed={0} />,
  "grain-brown-top-millet": () => <GrainIcon seed={1} />,
  "grain-foxtail-millet": () => <GrainIcon seed={2} />,
  "grain-pearl-millet": () => <GrainIcon seed={3} />,
  "grain-kodo-millet": () => <GrainIcon seed={4} />,
  "grain-proso-millet": () => <GrainIcon seed={5} />,
  "grain-little-millet": () => <GrainIcon seed={6} />,
  "grain-barnyard-millet": () => <GrainIcon seed={7} />,
  "nut-almond": () => <NutIcon style="teardrop" />,
  "nut-pistachio": () => <NutIcon style="oval" />,
  "nut-cashew": () => <NutIcon style="round" />,
  "seed-pumpkin": () => <SeedIcon style="flat" />,
  "seed-chia": () => <SeedIcon style="round" />,
  "seed-flax": () => <SeedIcon style="longOval" />,
  "seed-watermelon": () => <SeedIcon style="flat" />,
  "pod-dates": () => <PodIcon style="date" />,
  "pod-peanuts": () => <PodIcon style="peanut" />,
};
