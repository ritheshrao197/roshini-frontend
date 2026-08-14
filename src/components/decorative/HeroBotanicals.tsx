import React from "react";

const STROKE_WIDTH = 1.25;

/** A slender millet stalk with alternating small grain ovals along its length. */
export function MilletSprig() {
  return (
    <svg
      viewBox="0 0 40 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M20 118 C 18 90 22 70 18 40 C 16 25 20 12 20 2" />
      {[14, 26, 38, 50, 62, 74, 86, 98].map((y, i) => (
        <ellipse
          key={y}
          vectorEffect="non-scaling-stroke"
          cx={i % 2 === 0 ? 20 - 6 : 20 + 6}
          cy={y}
          rx="4.5"
          ry="2.5"
          transform={`rotate(${i % 2 === 0 ? -20 : 20} ${i % 2 === 0 ? 14 : 26} ${y})`}
        />
      ))}
    </svg>
  );
}

/** A short diagonal almond branch with three almond-shaped leaves. */
export function AlmondBranch() {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M4 56 C 30 44 60 30 96 4" />
      <path vectorEffect="non-scaling-stroke" d="M24 48 C 20 38 24 30 34 26 C 30 34 28 42 24 48 Z" />
      <path vectorEffect="non-scaling-stroke" d="M50 34 C 46 24 50 16 60 12 C 56 20 54 28 50 34 Z" />
      <path vectorEffect="non-scaling-stroke" d="M74 18 C 70 8 74 0 84 -4 C 80 4 78 12 74 18 Z" transform="translate(0 4)" />
    </svg>
  );
}

/** A small cluster of three simple 5-petal flowers on thin stems. */
export function FlowerCluster() {
  const flowers = [
    { cx: 16, cy: 40, scale: 1, r: 4, petals: [
      { px: 4, py: 0 }, { px: 1.236, py: 3.804 }, { px: -3.236, py: 2.351 },
      { px: -3.236, py: -2.351 }, { px: 1.236, py: -3.804 },
    ] },
    { cx: 34, cy: 22, scale: 0.85, r: 3.2, petals: [
      { px: 3.2, py: 0 }, { px: 0.989, py: 3.043 }, { px: -2.589, py: 1.881 },
      { px: -2.589, py: -1.881 }, { px: 0.989, py: -3.043 },
    ] },
    { cx: 48, cy: 36, scale: 0.9, r: 3.6, petals: [
      { px: 3.6, py: 0 }, { px: 1.112, py: 3.424 }, { px: -2.912, py: 2.116 },
      { px: -2.912, py: -2.116 }, { px: 1.112, py: -3.424 },
    ] },
  ];
  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M16 52 L16 40" />
      <path vectorEffect="non-scaling-stroke" d="M34 52 L34 22" />
      <path vectorEffect="non-scaling-stroke" d="M48 52 L48 36" />
      {flowers.map(({ cx, cy, r, scale, petals }, i) => (
        <g key={i} transform={`translate(${cx} ${cy}) scale(${scale})`}>
          {petals.map(({ px, py }, p) => (
            <ellipse
              key={p}
              vectorEffect="non-scaling-stroke"
              cx={px}
              cy={py}
              rx={r * 0.7}
              ry={r * 1.1}
              transform={`rotate(${p * 72} ${px} ${py})`}
            />
          ))}
          <circle vectorEffect="non-scaling-stroke" r={r * 0.4} fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

/** Two mirrored curved leaves on a short shared stem. */
export function LeafPair() {
  return (
    <svg
      viewBox="0 0 60 50"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M30 46 L30 10" />
      <path
        vectorEffect="non-scaling-stroke"
        d="M30 30 C 18 26 8 16 6 4 C 20 6 30 16 30 30 Z"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M30 30 C 42 26 52 16 54 4 C 40 6 30 16 30 30 Z"
      />
    </svg>
  );
}

/** A loose scatter of small seed ovals, varied in size and rotation. */
export function SeedScatter() {
  const seeds = [
    { x: 6, y: 8, rx: 4, ry: 2.2, rot: 15 },
    { x: 20, y: 2, rx: 3.4, ry: 1.8, rot: -25 },
    { x: 32, y: 14, rx: 4.4, ry: 2.4, rot: 40 },
    { x: 10, y: 22, rx: 3.2, ry: 1.7, rot: -10 },
    { x: 26, y: 26, rx: 3.8, ry: 2, rot: 65 },
  ];
  return (
    <svg
      viewBox="0 0 44 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      className="w-full h-full"
    >
      {seeds.map(({ x, y, rx, ry, rot }, i) => (
        <ellipse
          key={i}
          vectorEffect="non-scaling-stroke"
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          transform={`rotate(${rot} ${x} ${y})`}
        />
      ))}
    </svg>
  );
}
