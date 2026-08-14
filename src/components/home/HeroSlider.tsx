"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BACKEND_URL, Product, trackSliderAnalytics } from "@/lib/api";
import MagneticButton from "@/components/common/MagneticButton";
import RevealText from "@/components/motion/RevealText";
import { FadeUp } from "@/components/motion/FadeUp";
import { MilletSprig, AlmondBranch, FlowerCluster, LeafPair, SeedScatter } from "@/components/decorative/HeroBotanicals";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { useGsapContext, gsap } from "@/lib/gsapUtils";

export default function HeroSlider({ sliders, products }: { sliders: any[]; products?: Product[] }) {
  const [variant, setVariant] = useState<"A" | "B">("A");
  const trackedImpressions = useRef(new Set<string>());
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const botanicalsScrollRef = useRef<HTMLDivElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const trackImpression = (id: string) => {
    if (!trackedImpressions.current.has(id)) {
      trackedImpressions.current.add(id);
      trackSliderAnalytics(id, "impression");
    }
  };

  useEffect(() => {
    const match = document.cookie.match(new RegExp("(^| )ab_variant=([^;]+)"));
    if (match) setVariant(match[2] as "A" | "B");
    if (sliders?.[0]) trackImpression(sliders[0]._id);
  }, [sliders]);

  useEffect(() => {
    if (sliders?.length) return;
    const el = imageWrapRef.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      // Product image: near layer — tilts as a flat 2.5D plane toward the cursor.
      el.style.transform = `perspective(1200px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(0)`;
      // Ambient glow: far layer — drifts opposite and slower, reinforcing depth between the two.
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${-x * 24}px, ${-y * 24}px)`;
      }
    };
    const handleLeave = () => {
      el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      if (glowRef.current) glowRef.current.style.transform = "translate(0, 0)";
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [sliders]);

  // Scroll-linked animation targets productScrollRef/botanicalsScrollRef — dedicated
  // GSAP-owned wrappers, one level above the Motion-owned nodes inside them, NOT the
  // Motion nodes themselves (which the plan draft originally called for). Verified
  // visually: scrolling within ~1s of load (before Motion's entrance settles — ~1.35s
  // for the product, ~1.55s for the botanicals) while GSAP's scrub tween also wrote to
  // the same node Motion was animating produced exactly the fight Task 3's own fix
  // comment below describes for the tilt handler — one frame showed GSAP's translateY,
  // the next frame Motion's entrance tick clobbered it back, and for the botanical layer
  // this additionally left its scale permanently stuck at its initial 0.85 instead of
  // settling at 1, because GSAP caches whatever transform components it isn't animating
  // at the moment it first renders. Giving GSAP its own dedicated wrapper removes the
  // conflict the same way Task 3 separated the tilt handler from Motion's entrance.
  // headlineRef doesn't need this: Motion never touches that div's own transform (only
  // the per-word spans nested inside RevealText), so GSAP is the sole owner there.
  //
  // Desktop/tablet only (>=768px): the spec calls for the hero's parallax to be reduced
  // on mobile, where the single-column layout leaves no room for depth to read and the
  // scrub costs battery on the very devices least able to spare it. gsap.matchMedia()
  // creates the timeline only while the query matches and tears it down when it stops —
  // and because it's constructed inside useGsapContext's gsap.context() setup, the
  // MatchMedia instance registers itself on that context's `data` (gsap-core.js:4048),
  // so the existing ctx.revert() cleanup also reverts it and its child contexts. No
  // extra teardown needed here.
  useGsapContext(
    heroSectionRef,
    () => {
      if (reduceMotion || !productScrollRef.current) return;

      gsap.matchMedia().add("(min-width: 768px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
          .to(productScrollRef.current, { y: -60, scale: 0.94, ease: "none" }, 0)
          .to(botanicalsScrollRef.current, { y: -20, ease: "none" }, 0)
          .to(headlineRef.current, { opacity: 0, y: -30, ease: "none" }, 0);
      });
    },
    [reduceMotion]
  );

  if (!sliders?.length) {
    const flagship =
      products?.find((p) => /nutrimix/i.test(p.pName)) || products?.[0] || null;

    const flagshipImage = flagship
      ? flagship.image?.secureUrl ||
        flagship.images?.[0]?.secureUrl ||
        (flagship.pImages?.[0]
          ? flagship.pImages[0].startsWith("http")
            ? flagship.pImages[0]
            : `${BACKEND_URL}/uploads/products/${encodeURIComponent(flagship.pImages[0])}`
          : null)
      : null;

    const flagshipHref = flagship
      ? `/product/${flagship.slug || flagship._id}`
      : "/shop";

    return (
      <section ref={heroSectionRef} className="hero-fallback relative overflow-hidden">
        {/*
          `relative z-10` is load-bearing, not cosmetic: `.hero-fallback::before` (the
          header-legibility scrim) is a positioned pseudo-element with `z-index: 1`, and
          this grid was `position: static`, so per CSS stacking rules the scrim painted
          *above* the hero's own content rather than behind it. Giving the content grid
          its own stacking position puts it back on top of the scrim, which is the whole
          point of a "darken what's behind" layer.
        */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center min-h-[85vh] lg:min-h-[80vh]">
          {/*
            Left — editorial text content.

            Every Motion element in this column passes `initial={false}` on purpose.
            These are the LCP-critical, above-the-fold elements: with Motion's default
            hidden initial state they server-render at `opacity: 0` and stay invisible
            until hydration runs the entrance, which is a Core Web Vitals regression
            against the pure-CSS animation this replaced. `initial={false}` makes Motion
            skip the hidden start and render at the final state from the very first
            paint, server-rendered HTML included. Do NOT reintroduce a hidden initial
            state here without re-checking the prerendered output for `opacity:0`.
          */}
          <div className="flex flex-col justify-center gap-6">
            <FadeUp initial={false}>
              <span className="section-label">CRAFTED FROM INDIA&apos;S GRAINS &amp; NUTS</span>
            </FadeUp>
            <div ref={headlineRef}>
              <RevealText as="h1" className="display-heading text-[var(--color-espresso)]" delay={0.15} initial={false}>
                Wholesome food, rooted in tradition.
              </RevealText>
            </div>
            <FadeUp delay={0.55} initial={false}>
              <p className="site-muted text-base md:text-lg leading-relaxed max-w-lg">
                Thoughtfully blended millet, nuts and seeds for everyday nourishment.
              </p>
            </FadeUp>

            <FadeUp delay={0.7} initial={false}>
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
                <MagneticButton>
                  <Link href={flagshipHref} className="btn-primary btn-lg rounded-xl">
                    {flagship ? "Shop Nutrimix" : "Shop Now"}
                  </Link>
                </MagneticButton>
                <Link href="#brand-story" className="btn-ghost btn-lg rounded-xl">Explore the Blend</Link>
              </div>
            </FadeUp>
          </div>

          {/* Right — real flagship product photo, soft-shadowed, layered 2.5D tilt */}
          <div className="relative flex items-center justify-center" style={{ perspective: "1200px" }}>
            {/*
              Botanical framing layer — behind the product, corner-anchored, restrained.
              Split the same way as the product image below: botanicalsScrollRef (outer,
              plain div) is GSAP's scroll-parallax target; the inner motion.div is
              Motion's entrance target. See the comment above the useGsapContext call.

              `relative` on the motion.div is required, not decorative: the five
              `absolute`-positioned illustration wrappers below are positioned against
              their nearest positioned ancestor, and without it that resolved two levels
              up (to the `relative` column wrapper) — correct today only because the two
              boxes happen to coincide exactly.

              This layer keeps Motion's hidden initial state (unlike the left column and
              the product image, which are `initial={false}` for LCP): it's decorative,
              `aria-hidden`, and blocks nothing from being readable before hydration.
            */}
            <div ref={botanicalsScrollRef} className="pointer-events-none absolute inset-0">
              <motion.div
                className="hero-botanical-frame relative w-full h-full"
                aria-hidden="true"
                style={{ color: "var(--color-secondary-brown)", opacity: reduceMotion ? 0.5 : undefined }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
              >
                <div className="absolute -top-4 -left-6 w-20 h-20 md:w-28 md:h-28">
                  <MilletSprig />
                </div>
                <div className="absolute -top-2 -right-4 w-16 h-16 md:w-24 md:h-24 rotate-[15deg]">
                  <AlmondBranch />
                </div>
                <div className="absolute -bottom-6 -left-4 w-16 h-16 md:w-20 md:h-20">
                  <LeafPair />
                </div>
                {/*
                  Mobile reduction (spec: "reduce the illustration layer on mobile").
                  These two are the right-edge pair: on a single-column layout the
                  product image is centred and full-width, so SeedScatter (pinned to
                  the vertical centre of the right edge) sits directly over it, and
                  FlowerCluster crowds the bottom-right corner beside it. Hiding just
                  these two leaves a balanced three — MilletSprig, AlmondBranch,
                  LeafPair — framing the product without competing with it.
                */}
                <div className="hidden md:block absolute -bottom-4 -right-6 w-14 h-14 md:w-20 md:h-20">
                  <FlowerCluster />
                </div>
                <div className="hidden md:block absolute top-1/2 -right-10 w-10 h-10 md:w-14 md:h-14 -translate-y-1/2 rotate-[30deg]">
                  <SeedScatter />
                </div>
              </motion.div>
            </div>

            {/*
              Split in two: the outer motion.div owns Motion's entrance opacity/scale,
              the inner plain div (imageWrapRef) owns the mouse-tilt effect's own
              `el.style.transform` writes. Both used to live on one node and fought
              over the same `transform` style property — verified visually: moving
              the mouse during the ~0.45s-1.35s entrance window caused the tilt
              handler's raw transform string to clobber Motion's in-flight scale
              (visible jump), and Motion's next animation frame would clobber the
              tilt rotation right back, alternating every frame until the entrance
              animation finished. Separating the two transform owners onto sibling
              nodes removes the conflict entirely.
            */}
            {/*
              productScrollRef wraps the Motion node, giving GSAP's scroll-linked
              scrub tween a transform owner of its own — see the comment above the
              useGsapContext call for why this extra layer was added after the
              inner motion.div was found to also be GSAP's target during an early draft.

              `initial={false}`: this wraps the `priority` LCP image. With Motion's
              hidden initial state it server-rendered at `opacity: 0`, so the largest
              contentful paint could not happen until hydration — the regression this
              fixes. Rendering straight at the `animate` target means there is no
              entrance tween left for the product itself, which is the intended
              trade: a visible LCP beats a 0.9s fade nobody asked for.
            */}
            <div ref={productScrollRef} className="relative w-full max-w-md aspect-square">
              <motion.div
                className="hero-product-entrance relative w-full h-full"
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
              >
                <div
                  ref={imageWrapRef}
                  className="relative w-full h-full transition-transform duration-300 ease-out will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    ref={glowRef}
                    className="absolute inset-6 rounded-full blur-2xl opacity-40 transition-transform duration-300 ease-out will-change-transform"
                    style={{ background: "radial-gradient(circle, var(--color-walnut), transparent 70%)" }}
                    aria-hidden="true"
                  />
                  {flagshipImage ? (
                    <Image
                      src={flagshipImage}
                      alt={flagship?.pName || "Roshini's Nutrimix"}
                      fill
                      sizes="(max-width: 1024px) 80vw, 40vw"
                      className="relative object-contain drop-shadow-2xl"
                      priority
                    />
                  ) : (
                    <div className="hero-panel absolute inset-0 flex flex-col items-center justify-center text-center p-10 space-y-4 rounded-3xl">
                      <h2 className="hero-title text-2xl font-bold">Handcrafted with Love</h2>
                      <p className="hero-subtitle text-sm leading-relaxed max-w-sm">
                        Every product starts with the finest Karnataka ingredients, prepared fresh in micro-batches.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <a
          href="#brand-story"
          aria-label="Scroll to learn more"
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-widest site-muted"
        >
          Scroll
          <span className="scroll-cue" aria-hidden="true" />
        </a>
      </section>
    );
  }

  return (
    <div className="hero-slide relative w-full h-[65vh] md:h-[80vh]">
      <Swiper modules={[Autoplay, Pagination, Navigation, EffectFade]} effect="fade" spaceBetween={0} slidesPerView={1} loop={sliders.length > 1} autoplay={{ delay: 6000, disableOnInteraction: false }} pagination={{ clickable: true }} navigation onSlideChange={(swiper) => { const id = sliders[swiper.realIndex]?._id; if (id) trackImpression(id); }} className="w-full h-full hero-swiper">
        {sliders.map((slide) => {
          let title = slide.title;
          let subtitle = slide.subtitle;
          let description = slide.description;
          let primaryBtnText = slide.primaryButtonText;
          let primaryBtnLink = slide.primaryButtonLink;
          let bgImage = slide.desktopImage?.secureUrl || "/images/hero-bg.jpg";
          if (slide.type === "product" && slide.productData) {
            title = title || slide.productData.pName;
            subtitle = subtitle || `₹${slide.productData.pPrice}`;
            primaryBtnText = primaryBtnText || "Shop Now";
            primaryBtnLink = primaryBtnLink || `/product/${slide.productData.slug || slide.productData._id}`;
            if (!slide.desktopImage && slide.productData.pImages?.[0]) bgImage = slide.productData.pImages[0].startsWith("http") ? slide.productData.pImages[0] : `${BACKEND_URL}/uploads/products/${slide.productData.pImages[0]}`;
          } else if (slide.type === "achievement" && slide.achievementData) {
            title = title || slide.achievementData.title;
            subtitle = subtitle || slide.achievementData.subtitle;
          }
          const alignment = slide.textAlignment === "center" ? "items-center text-center mx-auto" : slide.textAlignment === "right" ? "items-end text-right ml-auto" : "items-start text-left";
          return <SwiperSlide key={slide._id}><div className="relative h-full w-full flex items-center overflow-hidden"><img src={bgImage} alt="" aria-hidden="true" className="hero-slide-image absolute inset-0 h-full w-full" /><div className="hero-overlay absolute inset-0" /><div className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full flex flex-col ${alignment}`}>
            {slide.badgeText && <span className="badge badge-terracotta mb-4">{slide.badgeText}</span>}
            {title && <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-md">{title}</h1>}
            {subtitle && <h2 className="hero-subtitle text-xl md:text-3xl font-medium mb-6 drop-shadow-sm max-w-3xl">{subtitle}</h2>}
            {description && <p className="text-sm md:text-lg text-[var(--color-ivory)] mb-8 max-w-2xl leading-relaxed">{description}</p>}
            {slide.showOverlayStats && <div className="flex flex-wrap gap-3 mb-8"><span className="hero-stat backdrop-blur-sm px-3 py-1.5 text-sm font-semibold">⭐ 4.84/5 Rating</span><span className="hero-stat backdrop-blur-sm px-3 py-1.5 text-sm font-semibold">🌿 30+ Ingredients</span></div>}
            <div className="flex flex-wrap gap-4">{primaryBtnText && primaryBtnLink && <Link href={primaryBtnLink} onClick={() => trackSliderAnalytics(slide._id, "click")} className={variant === "B" ? "btn-primary btn-lg rounded-xl" : "btn-terracotta btn-lg rounded-xl"}>{primaryBtnText}</Link>}{slide.secondaryButtonText && slide.secondaryButtonLink && <Link href={slide.secondaryButtonLink} onClick={() => trackSliderAnalytics(slide._id, "click")} className="btn-secondary btn-lg rounded-xl">{slide.secondaryButtonText}</Link>}</div>
          </div></div></SwiperSlide>;
        })}
      </Swiper>
    </div>
  );
}
