"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { BACKEND_URL, trackSliderAnalytics } from "@/lib/api";

export default function HeroSlider({ sliders }: { sliders: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [variant, setVariant] = useState<"A" | "B">("A");
  const trackedImpressions = useRef<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
    // Read A/B testing variant from cookies
    const match = document.cookie.match(new RegExp('(^| )ab_variant=([^;]+)'));
    if (match) setVariant(match[2] as "A" | "B");

    // Track first slide on mount if exists
    if (sliders && sliders.length > 0) {
      trackImpression(sliders[0]._id);
    }
  }, [sliders]);

  const trackImpression = (id: string) => {
    if (!trackedImpressions.current.has(id)) {
      trackedImpressions.current.add(id);
      trackSliderAnalytics(id, 'impression');
    }
  };

  const handleSlideChange = (swiper: any) => {
    const slideId = sliders[swiper.realIndex]?._id;
    if (slideId) trackImpression(slideId);
  };

  const trackClick = (id: string) => {
    trackSliderAnalytics(id, 'click');
  };

  if (!mounted) return <div className="h-[70vh] bg-[#F5E9DA] flex items-center justify-center animate-pulse">Loading campaigns...</div>;
  
  if (!sliders || sliders.length === 0) {
    return (
      <section style={{ background: "linear-gradient(135deg, #F5E9DA 0%, #FFFDF9 60%, #F5E9DA 100%)" }} className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #E6A817 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #6B3E26 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          {/* Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{ background: "#6B3E26", color: "#F5E9DA" }}>
              🌿 Karnataka Heritage · Homemade Nutrition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
              Traditional Nutrition<br />
              <span style={{ color: "#E6A817" }}>for Modern</span><br />
              Families
            </h1>

            <p className="text-base md:text-lg leading-relaxed max-w-lg" style={{ color: "#7A5C45" }}>
              Health Mixes, Seed Mixes, Herbal Teas, Spice Powders and Homemade Nutrition Products — crafted with love, rooted in tradition.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/#featured" className="btn-secondary">
                Explore Collections
              </Link>
            </div>

            {/* Trust micro-stats */}
            <div className="flex gap-6 pt-2">
              {[
                { value: "500+", label: "Happy Families" },
                { value: "100%", label: "Natural" },
                { value: "0g", label: "Added Sugar" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>{s.value}</div>
                  <div className="text-xs font-medium" style={{ color: "#7A5C45" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #6B3E26 0%, #8a5438 100%)", minHeight: 400 }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 space-y-5">
                <div className="text-8xl">🌾</div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#F5E9DA" }}>
                  Handcrafted with Love
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#ede0cc" }}>
                  Every product starts with the finest Karnataka ingredients, prepared fresh in micro-batches for maximum nutrition.
                </p>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {["No Sugar", "Preservative Free", "Homemade"].map((b) => (
                    <span key={b} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "rgba(245,233,218,0.15)", color: "#F5E9DA", border: "1px solid rgba(245,233,218,0.3)" }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#E8D5BC]">
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#7A5C45" }}>Today's Pickup</div>
              <div className="text-sm font-bold" style={{ color: "#6B3E26" }}>Ragi Health Mix 🌾</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#4CAF50] rounded-2xl px-4 py-3 shadow-lg text-white">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Rating</div>
              <div className="text-sm font-bold">⭐ 4.9 / 5.0</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] bg-[#FFFDF9]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        loop={sliders.length > 1}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        onSlideChange={handleSlideChange}
        className="w-full h-full hero-swiper"
      >
        {sliders.map((slide, index) => {
          let title = slide.title;
          let subtitle = slide.subtitle;
          let description = slide.description;
          let primaryBtnText = slide.primaryButtonText;
          let primaryBtnLink = slide.primaryButtonLink;
          let bgImage = slide.desktopImage ? `${BACKEND_URL}/uploads/sliders/${slide.desktopImage}` : "/images/hero-bg.jpg"; // Default fallback if no image provided

          // Dynamic Overrides
          if (slide.type === "product" && slide.productData) {
            title = slide.title || slide.productData.pName;
            subtitle = slide.subtitle || `₹${slide.productData.pPrice}`;
            primaryBtnText = primaryBtnText || "Shop Now";
            primaryBtnLink = primaryBtnLink || `/products/${slide.productData.slug || slide.productData._id}`;
            if (!slide.desktopImage && slide.productData.pImages?.[0]) {
              bgImage = slide.productData.pImages[0].startsWith("http")
                ? slide.productData.pImages[0]
                : `${BACKEND_URL}/uploads/products/${slide.productData.pImages[0]}`;
            }
          } else if (slide.type === "achievement" && slide.achievementData) {
            title = slide.title || slide.achievementData.title;
            subtitle = slide.subtitle || slide.achievementData.subtitle;
            if (slide.achievementData.icon && !title.includes(slide.achievementData.icon)) {
              title = `${slide.achievementData.icon} ${title}`;
            }
          }

          const alignmentClass = slide.textAlignment === "center" ? "items-center text-center mx-auto" : slide.textAlignment === "right" ? "items-end text-right ml-auto" : "items-start text-left";

          return (
            <SwiperSlide key={slide._id}>
              <div 
                className="relative w-full h-full bg-cover bg-center flex items-center" 
                style={{ backgroundImage: `url(${bgImage})` }}
              >
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B3E26]/80 via-[#6B3E26]/40 to-transparent"></div>
                
                <div className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full flex flex-col ${alignmentClass}`}>
                  {slide.badgeText && (
                    <span 
                      className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
                      style={{ backgroundColor: slide.badgeColor || "#E6A817", color: "#FFFDF9" }}
                    >
                      {slide.badgeText}
                    </span>
                  )}
                  
                  {title && (
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#FFFDF9] mb-4 leading-tight drop-shadow-md" style={{ fontFamily: "'Merriweather', serif" }}>
                      {title}
                    </h1>
                  )}
                  
                  {subtitle && (
                    <h2 className="text-xl md:text-3xl text-[#F5E9DA] font-medium mb-6 drop-shadow-sm max-w-3xl">
                      {subtitle}
                    </h2>
                  )}

                  {description && (
                    <p className="text-sm md:text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
                      {description}
                    </p>
                  )}

                  {slide.showOverlayStats && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">⭐ 4.84/5 Rating</span>
                      <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">🌿 30+ Ingredients</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    {primaryBtnText && primaryBtnLink && (
                      <Link 
                        href={primaryBtnLink} 
                        onClick={() => trackClick(slide._id)}
                        className={`px-8 py-3.5 font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm uppercase tracking-wide ${
                          variant === "B"
                            ? "bg-[#4CAF50] text-white hover:bg-[#388E3C]" // Variant B: Green CTA
                            : "bg-[#E6A817] text-[#6B3E26] hover:bg-[#F5E9DA]" // Variant A: Gold CTA
                        }`}
                      >
                        {primaryBtnText}
                      </Link>
                    )}
                    {slide.secondaryButtonText && slide.secondaryButtonLink && (
                      <Link 
                        href={slide.secondaryButtonLink}
                        onClick={() => trackClick(slide._id)}
                        className="px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm uppercase tracking-wide"
                      >
                        {slide.secondaryButtonText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: #F5E9DA;
          opacity: 0.6;
          width: 10px;
          height: 10px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #E6A817;
          width: 30px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: #F5E9DA;
          transform: scale(0.7);
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .hero-swiper:hover .swiper-button-next,
        .hero-swiper:hover .swiper-button-prev {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
