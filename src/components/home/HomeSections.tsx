"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import NewsletterForm from "@/components/home/NewsletterForm";
import { useLanguage } from "@/lib/LanguageContext";

export function TrustBadgesSection() {
  return (
    <section
      className="py-6 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--espresso)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: "🚚", title: "Free Shipping", sub: "Orders above ₹499" },
            { icon: "🔒", title: "Secure Payment", sub: "PhonePe & PayU" },
            { icon: "♻️", title: "Eco Packaging", sub: "Sustainable materials" },
            { icon: "📞", title: "WhatsApp Support", sub: "Mon–Sat 9am–7pm" },
          ].map((b, i, arr) => (
            <div
              key={b.title}
              className="flex items-center justify-center gap-3.5 py-4 px-4 sm:px-6"
              style={{
                borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
              }}
            >
              <span className="text-2xl flex-shrink-0" aria-hidden="true">{b.icon}</span>
              <div>
                <div className="text-xs sm:text-sm font-bold leading-tight" style={{ color: "#FCFAF7" }}>{b.title}</div>
                <div className="text-[10px] sm:text-xs leading-tight mt-1" style={{ color: "rgba(245,233,218,0.75)" }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSection({ products }: { products: any[] }) {
  const { t } = useLanguage();
  return (
    <section id="featured" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4">
        <div>
          <span className="section-label">{t("home.bestsellers")}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            {t("home.featured")}
          </h2>
        </div>
        <Link href="/shop" className="text-sm font-bold flex items-center gap-1.5 hover:underline" style={{ color: "var(--brand-brown)" }}>
          {t("home.viewall")}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-3xl" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
          <div className="text-5xl mb-4">🌾</div>
          <h3 className="text-lg font-bold" style={{ color: "var(--brand-brown)" }}>Fresh Batch Coming Soon</h3>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Our artisan kitchen is preparing the next batch. Check back shortly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

// Ordered by specificity (most specific first) so we match correctly
const CATEGORY_EMOJI_MAP: Array<{ keys: string[]; emoji: string }> = [
  { keys: ["traditional", "pickle", "preserve", "murabba"],   emoji: "🏺" },
  { keys: ["spice", "masala", "powder", "chili", "chilli"],   emoji: "🌶️" },
  { keys: ["skincare", "skin", "beauty", "ubtan", "face"],     emoji: "🌸" },
  { keys: ["snack", "snacks", "cracker", "nuts", "bites"],    emoji: "🥜" },
  { keys: ["tea", "herbal", "kadha", "infusion"],              emoji: "🍃" },
  { keys: ["health", "nutri", "protein", "mix", "supplement"],emoji: "💊" },
  { keys: ["seed", "seeds"],                                   emoji: "🌻" },
  { keys: ["ragi", "millet", "grain", "flour"],                emoji: "🌾" },
  { keys: ["honey", "sweet", "jaggery"],                       emoji: "🍯" },
  { keys: ["oil", "ghee", "butter"],                           emoji: "🫙" },
];

function getCatEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const { keys, emoji } of CATEGORY_EMOJI_MAP) {
    if (keys.some((k) => lower.includes(k))) return emoji;
  }
  return "🌾";
}

export function CategoriesSection({ categories }: { categories: any[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--brand-cream)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="section-label">Browse by Type</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat._id}`}
              className="group flex flex-col items-center gap-4 p-6 sm:p-8 text-center transition-all hover:-translate-y-1"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="w-16 h-16 flex items-center justify-center text-3xl shadow-sm transition-all group-hover:scale-110 mb-1" style={{ background: "var(--surface-2)", borderRadius: "var(--radius-lg)" }}>
                {getCatEmoji(cat.cName)}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg leading-tight" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                  {cat.cName}
                </h3>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>{cat.cDescription}</p>
              </div>
              <span className="text-xs font-bold mt-auto pt-2 flex items-center gap-1" style={{ color: "var(--brand-brown)" }}>Explore Collection →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY_US = [
  { icon: "🌾", title: "No Added Sugar", desc: "Naturally sweetened with dates, jaggery, and whole fruits.", color: "var(--color-sage)" },
  { icon: "🧪", title: "Preservative Free", desc: "Crafted fresh in small batches with zero artificial preservatives.", color: "var(--color-terracotta)" },
  { icon: "🏡", title: "Homemade Quality", desc: "Every product is handcrafted with the same care as a home kitchen.", color: "var(--color-walnut)" },
  { icon: "📦", title: "Micro Batches", desc: "Small-run production ensures absolute freshness and integrity.", color: "var(--color-terracotta)" },
  { icon: "🌿", title: "Karnataka Heritage", desc: "Recipes rooted in traditional Karnataka nutrition wisdom.", color: "var(--color-sage)" },
  { icon: "🚚", title: "Pan-India Delivery", desc: "Carefully packed and shipped fresh across India.", color: "var(--color-walnut)" },
];

export function WhyUsSection() {
  return (
    <section id="values" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-warm)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="section-label">Why Families Trust Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--espresso)" }}>
            Why Choose Roshini's?
          </h2>
        </div>
        {/* auto-rows-fr makes all cards the same height in each row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" style={{ gridAutoRows: "1fr" }}>
          {WHY_US.map((item) => (
            <div
              key={item.title}
              className="flex flex-col p-6 sm:p-8 group hover:-translate-y-1 transition-all"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center text-3xl mb-5 flex-shrink-0"
                style={{ background: `${item.color}18`, border: `1px solid ${item.color}30`, borderRadius: "var(--radius-md)" }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--espresso)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed mt-auto" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandStorySection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #5D310E 0%, #3D1E08 100%)" }}>
      {/* Decorative subtle background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #C28B36 0%, transparent 70%)" }} />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #5E7D32 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full" style={{ background: "rgba(194, 139, 54, 0.2)", color: "#E5B534", border: "1px solid rgba(194, 139, 54, 0.4)" }}>
            🌿 Our Story
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "#FFFFFF" }}>
            Handmade Wellness<br />Passed Down Generations
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: "#FAF6F2" }}>
            Roshini’s Home Products is a women-led, family-run wellness brand dedicated to creating natural, preservative-free products inspired by India's rich traditions.
          </p>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#F3E8DC" }}>
            From our Nutrimix Superfood Health Mix and Bananthi Maddu (postnatal tonic) to Pure Honey, Ubtan Face Pack, and Seeds Power Pack — each product is handmade with love, care, authenticity, and purity.
          </p>
          <div className="pt-4">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold tracking-wide rounded-xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-2xl cursor-pointer" 
              style={{ background: "#C28B36", color: "#FFFFFF", boxShadow: "0 10px 25px rgba(61, 30, 8, 0.4)" }}
            >
              Explore Our Products
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { icon: "🌾", title: "Traditional Recipes", sub: "Generational wisdom" },
            { icon: "🏡", title: "Home Kitchen", sub: "Made with love" },
            { icon: "🌿", title: "Natural Ingredients", sub: "Sourced locally" },
            { icon: "💚", title: "Family Wellness", sub: "Health for all ages" },
          ].map((v) => (
            <div
              key={v.title}
              className="p-6 flex flex-col gap-2 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">{v.icon}</div>
              <div className="font-bold text-base sm:text-lg" style={{ color: "#FFFFFF" }}>{v.title}</div>
              <div className="text-xs sm:text-sm leading-relaxed" style={{ color: "#F3E8DC" }}>{v.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AchievementsSection({ achievements }: { achievements: any[] }) {
  const awards = achievements.filter(a => a.type === "Award" || a.type === "Certification" || a.type === "Media");
  const stats = achievements.filter(a => a.type === "Statistic");

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="section-label" style={{ color: "var(--brand-brown)" }}>National Acclaim</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 leading-tight" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            🏆 Award-Winning Nutrition<br />Trusted by Families Across India
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Roshini's NutriMix combines traditional wisdom with modern nutrition, earning national recognition and the trust of health-conscious families across India.
          </p>
        </div>

        {awards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {awards.map((award) => (
              <div 
                key={award._id} 
                className="p-6 sm:p-8 flex flex-col items-center text-center transition-all hover:-translate-y-1 gap-2"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="text-4xl mb-3">{award.icon}</div>
                <h3 className="font-bold text-lg leading-tight" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                  {award.title}
                </h3>
                <p className="text-xs font-bold" style={{ color: "var(--spice-red)" }}>{award.subtitle}</p>
                {award.description && (
                  <p className="text-xs mt-2 leading-relaxed opacity-85" style={{ color: "var(--text-muted)" }}>{award.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {stats.length > 0 && (
          <div className="py-12 px-6 mb-16" style={{ background: "linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-brown-light) 100%)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8" style={{ borderColor: "rgba(246, 238, 225, 0.2)" }}>
              {stats.map((stat) => (
                <div key={stat._id} className="text-center px-4 flex flex-col items-center gap-1">
                  <span className="text-3xl mb-2">{stat.icon}</span>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--on-brand)" }}>
                    {stat.value || stat.title}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brand-cream-dark)" }}>
                    {stat.value ? stat.title : stat.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recognition Statement */}
        <div className="max-w-3xl mx-auto text-center space-y-6 p-8 md:p-12" style={{ background: "var(--surface-2)", border: "1px dashed var(--border)", borderRadius: "var(--radius-xl)" }}>
          <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            Recognized for Innovation. Trusted for Results.
          </h3>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Roshini's NutriMix was recognized as an <strong style={{ color: "var(--brand-brown)" }}>Innovative Product at National Saras Mela 2024</strong> and later honored as <strong style={{ color: "var(--brand-brown)" }}>Best Product at National Saras Mela 2024-25</strong> for its quality, nutritional value, and consumer acceptance.
          </p>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Representing Karnataka at prestigious national exhibitions, Roshini's NutriMix showcases the potential of women-led entrepreneurship, traditional nutrition, and millet-based wellness solutions. Today, the product continues to earn the trust of families seeking natural, wholesome, and preservative-free nutrition.
          </p>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Priya Sharma", location: "Bengaluru", text: "The health mix is absolutely fantastic — my kids love it! No added sugar and I can actually taste the quality of real ingredients.", rating: 5, avatar: "P" },
  { name: "Anitha Rao", location: "Mysuru", text: "Finally a homemade brand that delivers what it promises. The turmeric latte mix is pure gold.", rating: 5, avatar: "A" },
  { name: "Deepak Nair", location: "Chennai", text: "Roshini's ragi malt has replaced my morning oats entirely. Rich taste, filling, and I feel genuinely energised.", rating: 5, avatar: "D" },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--brand-cream)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="section-label">Real Customers, Real Stories</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            What Families Are Saying
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="p-6 sm:p-8 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex gap-1.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: "var(--brand-brown)" }}>★</span>
                ))}
              </div>
              <p className="text-sm md:text-base leading-relaxed italic" style={{ color: "var(--text)" }}>"{t.text}"</p>
              <div className="flex items-center gap-3 mt-auto pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--brand-brown)", color: "var(--on-brand)" }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "var(--brand-brown)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <span className="section-label">Stay Connected</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
          Get Nutrition Tips & Exclusive Offers
        </h2>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Join 500+ families who receive weekly wellness tips, new product launches and exclusive member discounts.
        </p>
        <NewsletterForm />
        <p className="text-[11px]" style={{ color: "var(--text-light)" }}>No spam. Unsubscribe anytime. We respect your privacy.</p>
      </div>
    </section>
  );
}

export function HealthHubSection({ vlogs }: { vlogs: any[] }) {
  if (!vlogs || vlogs.length === 0) return null;

  // 1. Featured Blog
  const featuredBlog = vlogs.find(v => v.featured) || vlogs[0];

  // 2. Latest Blogs (exclude featured)
  const latestBlogs = vlogs.filter(v => v._id !== featuredBlog._id).slice(0, 3);

  // 3. Recipe of the Week
  const recipeOfTheWeek = vlogs.find(v => 
    v.vCategory?.cName?.toLowerCase() === "recipes" || 
    v.vTags?.some((t: any) => t.name?.toLowerCase() === "recipes")
  );

  // 4. Health Tip of the Week
  const healthTipOfTheWeek = vlogs.find(v => 
    v.vCategory?.cName?.toLowerCase() === "health tips" || 
    v.vTags?.some((t: any) => t.name?.toLowerCase() === "health tips")
  );

  // 5. Trending Blogs (sorted by viewCount desc)
  const trendingBlogs = [...vlogs].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3);

  const getBlogImageUrl = (v: any) => {
    return v.thumbnail
      ? v.thumbnail.startsWith("http")
        ? v.thumbnail
        : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/uploads/vlogs/${v.thumbnail}`
      : null;
  };

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 w-full max-w-7xl mx-auto" style={{ background: "var(--bg)" }}>
      <div className="text-center mb-16">
        <span className="section-label" style={{ color: "var(--brand-brown)" }}>Roshini Wellness Hub</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
          Health Tips, Recipes & Guides
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Featured Blog & Latest */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--spice-red)" }} /> Featured Article
            </h3>
            <div className="group overflow-hidden transition-all" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
              {getBlogImageUrl(featuredBlog) ? (
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                  <img src={getBlogImageUrl(featuredBlog) || ""} alt={featuredBlog.title} className="object-cover h-full w-full group-hover:scale-105 transition-all duration-300" />
                </div>
              ) : null}
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--spice-red)" }}>{featuredBlog.vCategory?.cName || "Wellness"}</span>
                <h4 className="text-xl md:text-2xl font-bold transition-colors" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                  <Link href={`/blogs/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                </h4>
                <p className="text-sm line-clamp-3" style={{ color: "var(--text-muted)" }}>{featuredBlog.excerpt}</p>
                <div className="flex items-center gap-4 text-xs pt-2" style={{ color: "var(--text-muted)" }}>
                  <span>{new Date(featuredBlog.publishDate || featuredBlog.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{featuredBlog.readingTime || 1} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Blogs List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--spice-red)" }} /> Latest Blogs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestBlogs.map((blog) => (
                <div key={blog._id} className="group flex flex-col p-4 hover:-translate-y-1 transition-all" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--surface)" }}>
                  {getBlogImageUrl(blog) ? (
                    <img src={getBlogImageUrl(blog) || ""} alt={blog.title} className="h-32 w-full object-cover mb-3" style={{ borderRadius: "var(--radius-md)" }} />
                  ) : null}
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--spice-red)" }}>{blog.vCategory?.cName}</span>
                  <h4 className="font-bold text-sm line-clamp-2 mt-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h4>
                  <span className="text-[10px] mt-auto pt-2" style={{ color: "var(--text-muted)" }}>{blog.readingTime || 1} min read</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Highlights & Trending */}
        <div className="space-y-8">
          {/* Highlights */}
          <div className="p-6 space-y-6" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <h3 className="text-lg font-bold pb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)", borderBottom: "1px solid var(--border)" }}>
              🎯 Weekly Highlights
            </h3>

            {healthTipOfTheWeek && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: "var(--success-light)", color: "var(--success)" }}>Health Tip of the Week</span>
                <h4 className="font-bold text-sm" style={{ color: "var(--brand-brown)" }}><Link href={`/blogs/${healthTipOfTheWeek.slug}`}>{healthTipOfTheWeek.title}</Link></h4>
                <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>{healthTipOfTheWeek.excerpt}</p>
              </div>
            )}

            {recipeOfTheWeek && (
              <div className="space-y-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>Recipe of the Week</span>
                <h4 className="font-bold text-sm" style={{ color: "var(--brand-brown)" }}><Link href={`/blogs/${recipeOfTheWeek.slug}`}>{recipeOfTheWeek.title}</Link></h4>
                <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>{recipeOfTheWeek.excerpt}</p>
              </div>
            )}
          </div>

          {/* Trending Articles */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--spice-red)" }} /> Trending Articles
            </h3>
            <div style={{ borderColor: "var(--border)" }}>
              {trendingBlogs.map((blog, idx) => (
                <div key={blog._id} className="py-3 flex items-start gap-4 group" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--border)" }}>0{idx + 1}</span>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--spice-red)" }}>{blog.vCategory?.cName}</span>
                    <h4 className="font-bold text-sm" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h4>
                    <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>{blog.viewCount} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
