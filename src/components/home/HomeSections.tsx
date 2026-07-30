"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import NewsletterForm from "@/components/home/NewsletterForm";
import { useLanguage } from "@/lib/LanguageContext";

export function TrustBadgesSection() {
  return (
    <section className="py-8 px-4 sm:px-6" style={{ background: "var(--brand-brown)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { icon: "🚚", title: "Free Shipping", sub: "Orders above ₹499" },
          { icon: "🔒", title: "Secure Payment", sub: "PhonePe & PayU" },
          { icon: "♻️", title: "Eco Packaging", sub: "Sustainable materials" },
          { icon: "📞", title: "WhatsApp Support", sub: "Mon–Sat 9am–7pm" },
        ].map((b) => (
          <div key={b.title} className="flex items-center gap-3 justify-center md:justify-start">
            <span className="text-2xl">{b.icon}</span>
            <div className="text-left">
              <div className="text-xs font-bold" style={{ color: "var(--on-brand)" }}>{b.title}</div>
              <div className="text-[10px] opacity-80" style={{ color: "var(--brand-cream-dark)" }}>{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturedProductsSection({ products }: { products: any[] }) {
  const { t } = useLanguage();
  return (
    <section id="featured" className="py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="section-label">{t("home.bestsellers")}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            {t("home.featured")}
          </h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold flex items-center gap-1 hover:underline" style={{ color: "var(--brand-brown)" }}>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

const CATEGORY_EMOJIS: Record<string, string> = {
  default: "🌾",
  health: "💚",
  tea: "🍃",
  spice: "🌶️",
  seed: "🌻",
  herbal: "🌿",
  protein: "💪",
  ragi: "🌾",
  millet: "🌻",
};

function getCatEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_EMOJIS)) {
    if (lower.includes(key)) return val;
  }
  return CATEGORY_EMOJIS.default;
}

export function CategoriesSection({ categories }: { categories: any[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="py-16 px-4 sm:px-6" style={{ background: "var(--brand-cream)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label">Browse by Type</span>
          <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat._id}`}
              className="group flex flex-col items-center gap-3 p-6 text-center transition-all hover:-translate-y-1"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="w-14 h-14 flex items-center justify-center text-3xl shadow-sm transition-all group-hover:scale-110" style={{ background: "var(--surface-2)", borderRadius: "var(--radius-lg)" }}>
                {getCatEmoji(cat.cName)}
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                  {cat.cName}
                </h3>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>{cat.cDescription}</p>
              </div>
              <span className="text-xs font-semibold mt-1" style={{ color: "var(--brand-brown)" }}>Explore →</span>
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
    <section id="values" className="py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Why Families Trust Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            Why Choose Roshini's?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item) => (
            <div
              key={item.title}
              className="p-6 group hover:-translate-y-1 transition-all"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}
            >
              <div className="w-12 h-12 flex items-center justify-center text-2xl mb-4 shadow-sm" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30`, borderRadius: "var(--radius-md)" }}>
                {item.icon}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandStorySection() {
  return (
    <section style={{ background: "linear-gradient(135deg, var(--brand-brown-dark) 0%, var(--brand-brown-light) 100%)" }} className="py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1" style={{ background: "rgba(245,233,218,0.15)", color: "var(--on-brand)", borderRadius: "var(--radius-full)" }}>
            Our Story
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--on-brand)" }}>
            Handmade Wellness<br />Passed Down Generations
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--brand-cream-dark)" }}>
            Roshini’s Home Products is a women-led, family-run wellness brand dedicated to creating natural, preservative-free products inspired by India's rich traditions.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--brand-cream-dark)" }}>
            From our Nutrimix Superfood Health Mix and Bananthi Maddu (postnatal tonic) to Pure Honey, Ubtan Face Pack, and Seeds Power Pack — each product is handmade with love, care, authenticity, and purity.
          </p>
          <Link href="/shop" className="btn-terracotta inline-block">
            Explore Our Products
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "🌾", title: "Traditional Recipes", sub: "Generational wisdom" },
            { icon: "🏡", title: "Home Kitchen", sub: "Made with love" },
            { icon: "🌿", title: "Natural Ingredients", sub: "Sourced locally" },
            { icon: "💚", title: "Family Wellness", sub: "Health for all ages" },
          ].map((v) => (
            <div key={v.title} className="p-5" style={{ background: "rgba(245,233,218,0.1)", border: "1px solid rgba(245,233,218,0.2)", borderRadius: "var(--radius-lg)" }}>
              <div className="text-3xl mb-2">{v.icon}</div>
              <div className="font-bold text-sm" style={{ color: "var(--on-brand)" }}>{v.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--brand-cream-dark)", opacity: 0.8 }}>{v.sub}</div>
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
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label" style={{ color: "var(--brand-brown)" }}>National Acclaim</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 leading-tight" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            🏆 Award-Winning Nutrition<br />Trusted by Families Across India
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Roshini's NutriMix combines traditional wisdom with modern nutrition, earning national recognition and the trust of health-conscious families across India.
          </p>
        </div>

        {awards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {awards.map((award) => (
              <div 
                key={award._id} 
                className="p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="text-4xl mb-4">{award.icon}</div>
                <h3 className="font-bold text-lg mb-1 leading-tight" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                  {award.title}
                </h3>
                <p className="text-xs font-semibold" style={{ color: "var(--spice-red)" }}>{award.subtitle}</p>
                {award.description && (
                  <p className="text-xs mt-3 opacity-80" style={{ color: "var(--text-muted)" }}>{award.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {stats.length > 0 && (
          <div className="py-10 mb-16" style={{ background: "linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-brown-light) 100%)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8" style={{ borderColor: "rgba(246, 238, 225, 0.2)" }}>
              {stats.map((stat) => (
                <div key={stat._id} className="text-center px-4 flex flex-col items-center">
                  <span className="text-3xl mb-2">{stat.icon}</span>
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--on-brand)" }}>
                    {stat.value || stat.title}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-cream-dark)" }}>
                    {stat.value ? stat.title : stat.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recognition Statement */}
        <div className="max-w-3xl mx-auto text-center space-y-6 p-8 md:p-12" style={{ background: "var(--surface-2)", border: "1px dashed var(--border)", borderRadius: "var(--radius-xl)" }}>
          <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
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
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ background: "var(--brand-cream)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Real Customers, Real Stories</span>
          <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
            What Families Are Saying
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="p-6 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: "var(--brand-brown)" }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed italic" style={{ color: "var(--text)" }}>"{t.text}"</p>
              <div className="flex items-center gap-3 mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--brand-brown)", color: "var(--on-brand)" }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--brand-brown)" }}>{t.name}</div>
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
    <section className="py-16 px-4 sm:px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <span className="section-label">Stay Connected</span>
        <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
          Get Nutrition Tips & Exclusive Offers
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
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
