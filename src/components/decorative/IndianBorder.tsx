import React from "react";

export type IndianBorderVariant = "botanical" | "geometric" | "minimal";

interface IndianBorderProps {
  variant: IndianBorderVariant;
  position?: "top" | "bottom" | "full";
  className?: string;
}

const STROKE_WIDTH = 1.25;

function BotanicalMotif() {
  const stems = [40, 120, 200, 280, 360];
  return (
    <svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path d="M0 20 C 40 20 40 8 80 8 C 120 8 120 20 160 20 C 200 20 200 8 240 8 C 280 8 280 20 320 20 C 360 20 360 8 400 8" />
      {stems.map((cx) => (
        <g key={cx} transform={`translate(${cx} 14)`}>
          <path d="M0 0 C -4 -6 -10 -6 -10 0 C -10 6 -4 6 0 0 Z" />
          <path d="M0 0 C 4 -6 10 -6 10 0 C 10 6 4 6 0 0 Z" />
        </g>
      ))}
    </svg>
  );
}

function GeometricMotif() {
  const triangles = Array.from({ length: 20 }, (_, i) => i * 20);
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      className="w-full h-full"
    >
      <line x1="0" y1="20" x2="400" y2="20" />
      {triangles.map((x) => (
        <g key={x}>
          <path d={`M${x + 4} 20 L${x + 10} 8 L${x + 16} 20`} />
          <circle cx={x + 10} cy={4} r="1.5" fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

function MinimalMotif() {
  return (
    <svg
      viewBox="0 0 400 20"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      className="w-full h-full"
    >
      <line x1="0" y1="10" x2="176" y2="10" />
      <g transform="translate(200 10)">
        <path d="M0 -6 C -5 -6 -5 0 0 0 C 5 0 5 -6 0 -6 Z" />
        <path d="M0 6 L0 0" />
      </g>
      <line x1="224" y1="10" x2="400" y2="10" />
    </svg>
  );
}

const MOTIFS: Record<IndianBorderVariant, () => React.JSX.Element> = {
  botanical: BotanicalMotif,
  geometric: GeometricMotif,
  minimal: MinimalMotif,
};

export default function IndianBorder({
  variant,
  position = "top",
  className = "",
}: IndianBorderProps) {
  const Motif = MOTIFS[variant];
  const positionClass =
    position === "top" ? "mb-0" : position === "bottom" ? "mt-0" : "";

  return (
    <div
      className={`indian-border indian-border-${variant} ${positionClass} ${className}`.trim()}
      style={{ color: "var(--color-secondary-brown)", opacity: 0.55, width: "100%", height: "auto", overflow: "hidden" }}
      aria-hidden="true"
    >
      <Motif />
    </div>
  );
}
