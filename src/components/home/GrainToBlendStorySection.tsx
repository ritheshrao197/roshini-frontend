"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGsapContext, gsap } from "@/lib/gsapUtils";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { GrainIcon, NutIcon, SeedIcon } from "@/components/decorative/IngredientIcons";
import type { Product } from "@/lib/api";

export default function GrainToBlendStorySection({ product }: { product: Product | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const nutRef = useRef<HTMLDivElement>(null);
  const seedRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGsapContext(
    sectionRef,
    () => {
      if (reduceMotion) return;

      // Pinned, scroll-scrubbed convergence — desktop/tablet only (matches the
      // hero's precedent for scrub-driven sequences: scrub costs battery and
      // reads as jank on the devices least able to spare it).
      gsap.matchMedia().add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
            // The homepage's root element is `flex flex-col`, and ScrollTrigger
            // silently disables pin spacing when the pinned element's parent is
            // a flex container (it would add `padding`, which flex layout
            // ignores here) — leaving the pin to consume 200vh of scroll while
            // the document reserved none, so the following sections slid up over
            // this one and covered the payoff. `"margin"` is ScrollTrigger's
            // supported alternative and works on a flex item.
            pinSpacing: "margin",
          },
        });

        // The icons' scattered starting positions come from CSS (`top-[15%]
        // left-[15%]` etc.), so their GSAP transform starts at x:0,y:0 — tweening
        // *to* 0,0 would be a no-op. Each destination below is therefore a real
        // translation aimed at the section's centre, where the product sits:
        // grain (upper-left) moves right+down, nut (upper-right) left+down, seed
        // (bottom-centre) straight up. `ease: "none"` on every scrub-driven tween
        // so scroll distance maps linearly to progress (same as HeroSlider).
        tl.to(grainRef.current, { x: 200, y: 130, scale: 0.6, opacity: 0.4, ease: "none", duration: 1 }, 0)
          .to(nutRef.current, { x: -200, y: 130, scale: 0.6, opacity: 0.4, ease: "none", duration: 1 }, 0)
          .to(seedRef.current, { x: 0, y: -230, scale: 0.6, opacity: 0.4, ease: "none", duration: 1 }, 0)
          .fromTo(productRef.current, { scale: 0.85, opacity: 0.6 }, { scale: 1, opacity: 1, ease: "none", duration: 1 }, 0.4)
          .to(labelRef.current, { opacity: 0, ease: "none", duration: 0.3 }, 0.5)
          // `autoAlpha` (not `opacity`) so the CTA inside also gets
          // `visibility: hidden` while faded out — otherwise the SHOP NOW link
          // stays keyboard-focusable while invisible, and the section is pinned
          // so a focused-but-hidden link can't even be scrolled into view.
          .fromTo(finalRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.6 }, 0.7);
      });
    },
    [reduceMotion]
  );

  const flagshipImage =
    product?.image?.secureUrl ||
    product?.images?.[0]?.secureUrl ||
    null;
  const flagshipHref = product ? `/product/${product.slug || product._id}` : "/shop";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-0 md:h-screen flex items-center justify-center"
      style={{ background: "var(--color-espresso)" }}
    >
      <div ref={labelRef} className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--color-ivory)" }}>
          Grain &middot; Nut &middot; Seed &middot; Blend
        </span>
      </div>

      <div ref={grainRef} className="absolute top-[15%] left-[15%] w-16 h-16 md:w-24 md:h-24" style={{ color: "var(--color-premium-gold)" }} aria-hidden="true">
        <GrainIcon seed={0} />
      </div>
      <div ref={nutRef} className="absolute top-[20%] right-[15%] w-16 h-16 md:w-24 md:h-24" style={{ color: "var(--color-premium-gold)" }} aria-hidden="true">
        <NutIcon style="teardrop" />
      </div>
      {/* Centred with `inset-x-0 mx-auto`, NOT `left-1/2 -translate-x-1/2`: GSAP
          animates this element's transform, and an inline GSAP transform would
          clobber Tailwind's `-translate-x-1/2` centring, snapping the icon
          half its own width to the right the moment the timeline renders. */}
      <div ref={seedRef} className="absolute bottom-[15%] inset-x-0 mx-auto w-16 h-16 md:w-24 md:h-24" style={{ color: "var(--color-premium-gold)" }} aria-hidden="true">
        <SeedIcon style="round" />
      </div>

      <div ref={productRef} className="relative z-10 flex flex-col items-center text-center px-6">
        {flagshipImage && (
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
            <img src={flagshipImage} alt={product?.pName || "Roshini's Nutrimix"} className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        )}
        <div ref={finalRef}>
          <h2 className="text-lg md:text-2xl font-serif mb-6" style={{ color: "var(--color-ivory)" }}>
            Made thoughtfully for everyday nourishment.
          </h2>
          <Link href={flagshipHref} className="btn-primary btn-lg rounded-xl">
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
