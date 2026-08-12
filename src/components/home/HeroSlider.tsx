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

export default function HeroSlider({ sliders, products }: { sliders: any[]; products?: Product[] }) {
  const [variant, setVariant] = useState<"A" | "B">("A");
  const trackedImpressions = useRef(new Set<string>());
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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
      <section className="hero-fallback relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center min-h-[85vh] lg:min-h-[80vh]">
          {/* Left — editorial text content */}
          <div className="flex flex-col justify-center gap-6 animate-stagger">
            <span className="section-label">Wholesome Food, Made With Intention</span>
            <h1 className="display-heading text-[var(--color-espresso)]">
              Wholesome food.
              <br />
              Made with <em>intention</em>.
            </h1>
            <p className="site-muted text-base md:text-lg leading-relaxed max-w-lg">
              A thoughtfully crafted blend of millets, nuts, seeds and dry fruits for everyday nourishment — made the way it always was, by hand, in small batches.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
              <MagneticButton>
                <Link href={flagshipHref} className="btn-primary btn-lg rounded-xl">
                  Shop {flagship ? "Nutrimix" : "Now"}
                </Link>
              </MagneticButton>
              <Link href="#brand-story" className="btn-ghost btn-lg rounded-xl">Explore the Blend</Link>
            </div>
          </div>

          {/* Right — real flagship product photo, soft-shadowed, layered 2.5D tilt */}
          <div className="relative flex items-center justify-center" style={{ perspective: "1200px" }}>
            <div
              ref={imageWrapRef}
              className="relative w-full max-w-md aspect-square transition-transform duration-300 ease-out will-change-transform"
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
