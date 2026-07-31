"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BACKEND_URL, trackSliderAnalytics } from "@/lib/api";

export default function HeroSlider({ sliders }: { sliders: any[] }) {
  const [variant, setVariant] = useState<"A" | "B">("A");
  const trackedImpressions = useRef(new Set<string>());

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

  if (!sliders?.length) {
    return (
      <section className="hero-fallback relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-stretch animate-stagger">
          {/* Left — text content */}
          <div className="flex flex-col justify-center gap-6 animate-fade-up py-4">
            <span className="badge badge-primary self-start px-3.5 py-1 text-xs">Karnataka Heritage · Homemade Nutrition</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[var(--color-espresso)] my-2">
              Traditional Nutrition for Modern Families
            </h1>
            <p className="site-muted text-base md:text-lg leading-relaxed max-w-lg mb-2">
              Health mixes, seed mixes, herbal teas, spice powders and homemade nutrition products — crafted with love and rooted in tradition.
            </p>

            {/* Trust pills BEFORE the CTA buttons */}
            <div className="flex flex-wrap gap-3 my-2">
              {["No Sugar", "Preservative Free", "Homemade"].map((item) => (
                <span key={item} className="badge badge-terracotta px-3 py-1 text-xs">{item}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 pt-3">
              <Link href="/shop" className="btn-primary btn-lg">Shop Now</Link>
              <Link href="/#featured" className="btn-secondary btn-lg">Explore Collections</Link>
            </div>
          </div>

          {/* Right — decorative panel fills the full column height */}
          <div className="hero-panel shadow-xl relative overflow-hidden animate-fade-up flex flex-col" style={{ minHeight: "24rem" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 space-y-5">
              <div className="text-8xl">🌾</div>
              <h2 className="hero-title text-2xl font-bold">Handcrafted with Love</h2>
              <p className="hero-subtitle text-sm leading-relaxed max-w-sm">
                Every product starts with the finest Karnataka ingredients, prepared fresh in micro-batches for maximum nutrition.
              </p>
            </div>
          </div>
        </div>
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
            <div className="flex flex-wrap gap-4">{primaryBtnText && primaryBtnLink && <Link href={primaryBtnLink} onClick={() => trackSliderAnalytics(slide._id, "click")} className={variant === "B" ? "btn-primary btn-lg" : "btn-terracotta btn-lg"}>{primaryBtnText}</Link>}{slide.secondaryButtonText && slide.secondaryButtonLink && <Link href={slide.secondaryButtonLink} onClick={() => trackSliderAnalytics(slide._id, "click")} className="btn-secondary btn-lg">{slide.secondaryButtonText}</Link>}</div>
          </div></div></SwiperSlide>;
        })}
      </Swiper>
    </div>
  );
}
