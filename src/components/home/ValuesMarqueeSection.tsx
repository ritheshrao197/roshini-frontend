import React from "react";

const VALUES = [
  "Stone-Ground",
  "Small-Batch",
  "Rooted in Tradition",
  "No Preservatives",
  "Family Recipe",
  "100% Natural",
  "Karnataka Heritage",
  "Homemade Quality",
];

function ValuesList({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center flex-shrink-0" aria-hidden={ariaHidden}>
      {VALUES.map((value, i) => (
        <React.Fragment key={i}>
          <span
            className="text-2xl md:text-4xl font-bold whitespace-nowrap px-6 md:px-10"
            style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--color-espresso)" }}
          >
            {value}
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" style={{ color: "var(--color-terracotta)" }} aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" d="M10 3 C 6 3 6 10 10 10 C 14 10 14 17 10 17" />
          </svg>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ValuesMarqueeSection() {
  return (
    <section className="py-10 md:py-14 overflow-hidden" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="heritage-marquee-track">
        <ValuesList />
        <ValuesList ariaHidden />
      </div>
    </section>
  );
}
