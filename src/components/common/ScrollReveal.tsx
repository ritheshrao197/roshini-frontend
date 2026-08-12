"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
  group?: boolean;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  style,
  as = "div",
  group = false,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const Tag = as as any;
  const baseClass = group ? "reveal-group" : "reveal";

  return (
    <Tag ref={ref} className={`${baseClass}${visible ? " is-visible" : ""} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
