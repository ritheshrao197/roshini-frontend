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
  // Every numeric attribute here is a precomputed static literal — no arithmetic at
  // render time. The petal coordinates were originally Math.cos/Math.sin calls and
  // produced a real, reproduced hydration mismatch (server `cx="-3.23606797749979"`
  // vs. client `cx="-3.2360679774997902"`). petalRx/petalRy/centerR (formerly
  // `r * 0.7` / `r * 1.1` / `r * 0.4`, for r = 4 / 3.2 / 3.6) are precomputed for the
  // same reason plus markup cleanliness: float multiplication would emit 17-digit
  // values like 3.5200000000000005 into the DOM. Do not reintroduce arithmetic here.
  const flowers = [
    { cx: 16, cy: 40, scale: 1, petalRx: 2.8, petalRy: 4.4, centerR: 1.6, petals: [
      { px: 4, py: 0 }, { px: 1.236, py: 3.804 }, { px: -3.236, py: 2.351 },
      { px: -3.236, py: -2.351 }, { px: 1.236, py: -3.804 },
    ] },
    { cx: 34, cy: 22, scale: 0.85, petalRx: 2.24, petalRy: 3.52, centerR: 1.28, petals: [
      { px: 3.2, py: 0 }, { px: 0.989, py: 3.043 }, { px: -2.589, py: 1.881 },
      { px: -2.589, py: -1.881 }, { px: 0.989, py: -3.043 },
    ] },
    { cx: 48, cy: 36, scale: 0.9, petalRx: 2.52, petalRy: 3.96, centerR: 1.44, petals: [
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
      {flowers.map(({ cx, cy, scale, petalRx, petalRy, centerR, petals }, i) => (
        <g key={i} transform={`translate(${cx} ${cy}) scale(${scale})`}>
          {petals.map(({ px, py }, p) => (
            <ellipse
              key={p}
              vectorEffect="non-scaling-stroke"
              cx={px}
              cy={py}
              rx={petalRx}
              ry={petalRy}
              transform={`rotate(${p * 72} ${px} ${py})`}
            />
          ))}
          <circle vectorEffect="non-scaling-stroke" r={centerR} fill="currentColor" stroke="none" />
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

/**
 * A single large lotus-like bloom, built the same way as `FlowerCluster`'s
 * tiny flowers (a ring of ellipse petals at precomputed unit-circle offsets,
 * each rotated 72° from the last around its own center) but scaled up into
 * a standalone hero motif with a stem. Coordinates are static literals for
 * the same reason as `FlowerCluster` — see the note on that component.
 */
export function LotusBloom() {
  const petals = [
    { px: 14, py: 0 },
    { px: 4.326, py: 13.314 },
    { px: -11.326, py: 8.229 },
    { px: -11.326, py: -8.229 },
    { px: 4.326, py: -13.314 },
  ];
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M40 78 L40 58" />
      <g transform="translate(40 40)">
        {petals.map(({ px, py }, p) => (
          <ellipse
            key={p}
            vectorEffect="non-scaling-stroke"
            cx={px}
            cy={py}
            rx="9"
            ry="19"
            transform={`rotate(${p * 72} ${px} ${py})`}
          />
        ))}
        <circle vectorEffect="non-scaling-stroke" r="6" fill="currentColor" stroke="none" />
      </g>
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
