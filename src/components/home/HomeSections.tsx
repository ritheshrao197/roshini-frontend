"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import NewsletterForm from "@/components/home/NewsletterForm";
import { useLanguage } from "@/lib/LanguageContext";

export function TrustBadgesSection() {
  return (
    <section style={{ background: "#6B3E26" }} className="py-8 px-4 sm:px-6">
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
              <div className="text-xs font-bold text-[#F5E9DA]">{b.title}</div>
              <div className="text-[10px] text-[#ede0cc] opacity-80">{b.sub}</div>
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
          <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
            {t("home.featured")}
          </h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold flex items-center gap-1 hover:underline" style={{ color: "#6B3E26" }}>
          {t("home.viewall")}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[#E8D5BC] rounded-3xl" style={{ background: "#FDF6EC" }}>
          <div className="text-5xl mb-4">🌾</div>
          <h3 className="text-lg font-bold" style={{ color: "#6B3E26" }}>Fresh Batch Coming Soon</h3>
          <p className="text-sm mt-1" style={{ color: "#7A5C45" }}>Our artisan kitchen is preparing the next batch. Check back shortly!</p>
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
    <section className="py-16 px-4 sm:px-6" style={{ background: "#F5E9DA" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label">Browse by Type</span>
          <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat._id}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all hover:shadow-md hover:-translate-y-1"
              style={{ background: "#FFFDF9", border: "1.5px solid #E8D5BC" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all group-hover:scale-110" style={{ background: "linear-gradient(135deg, #F5E9DA, #ede0cc)" }}>
                {getCatEmoji(cat.cName)}
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
                  {cat.cName}
                </h3>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "#7A5C45" }}>{cat.cDescription}</p>
              </div>
              <span className="text-xs font-semibold mt-1" style={{ color: "#E6A817" }}>Explore →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY_US = [
  { icon: "🌾", title: "No Added Sugar", desc: "Naturally sweetened with dates, jaggery, and whole fruits.", color: "#4CAF50" },
  { icon: "🧪", title: "Preservative Free", desc: "Crafted fresh in small batches with zero artificial preservatives.", color: "#E6A817" },
  { icon: "🏡", title: "Homemade Quality", desc: "Every product is handcrafted with the same care as a home kitchen.", color: "#6B3E26" },
  { icon: "📦", title: "Micro Batches", desc: "Small-run production ensures absolute freshness and integrity.", color: "#B23A2A" },
  { icon: "🌿", title: "Karnataka Heritage", desc: "Recipes rooted in traditional Karnataka nutrition wisdom.", color: "#4CAF50" },
  { icon: "🚚", title: "Pan-India Delivery", desc: "Carefully packed and shipped fresh across India.", color: "#6B3E26" },
];

export function WhyUsSection() {
  return (
    <section id="values" className="py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Why Families Trust Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
            Why Choose Roshini's?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl group hover:-translate-y-1 transition-all"
              style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                {item.icon}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#7A5C45" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandStorySection() {
  return (
    <section style={{ background: "linear-gradient(135deg, #5D310E 0%, #AE6837 100%)" }} className="py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(245,233,218,0.15)", color: "#F5E9DA" }}>
            Our Story
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#F5E9DA" }}>
            Handmade Wellness<br />Passed Down Generations
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#ede0cc" }}>
            Roshini’s Home Products is a women-led, family-run wellness brand dedicated to creating natural, preservative-free products inspired by India's rich traditions.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#ede0cc" }}>
            From our Nutrimix Superfood Health Mix and Bananthi Maddu (postnatal tonic) to Pure Honey, Ubtan Face Pack, and Seeds Power Pack — each product is handmade with love, care, authenticity, and purity.
          </p>
          <Link href="/shop" className="btn-gold inline-block">
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
            <div key={v.title} className="p-5 rounded-2xl" style={{ background: "rgba(245,233,218,0.1)", border: "1px solid rgba(245,233,218,0.2)" }}>
              <div className="text-3xl mb-2">{v.icon}</div>
              <div className="font-bold text-sm" style={{ color: "#F5E9DA" }}>{v.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "#ede0cc", opacity: 0.8 }}>{v.sub}</div>
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
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ background: "#FFFDF9" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label text-[#E6A817] font-bold tracking-widest uppercase text-[10px]">National Acclaim</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 leading-tight" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
            🏆 Award-Winning Nutrition<br />Trusted by Families Across India
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed" style={{ color: "#7A5C45" }}>
            Roshini's NutriMix combines traditional wisdom with modern nutrition, earning national recognition and the trust of health-conscious families across India.
          </p>
        </div>

        {awards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {awards.map((award) => (
              <div 
                key={award._id} 
                className="p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
                style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}
              >
                <div className="text-4xl mb-4">{award.icon}</div>
                <h3 className="font-bold text-lg mb-1 leading-tight" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
                  {award.title}
                </h3>
                <p className="text-xs font-semibold text-[#B23A2A]">{award.subtitle}</p>
                {award.description && (
                  <p className="text-xs mt-3 opacity-80" style={{ color: "#7A5C45" }}>{award.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {stats.length > 0 && (
          <div className="py-10 rounded-3xl mb-16" style={{ background: "linear-gradient(135deg, #6B3E26 0%, #8a5438 100%)", boxShadow: "0 10px 30px -10px rgba(107, 62, 38, 0.5)" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#F5E9DA]/20">
              {stats.map((stat) => (
                <div key={stat._id} className="text-center px-4 flex flex-col items-center">
                  <span className="text-3xl mb-2">{stat.icon}</span>
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif", color: "#F5E9DA" }}>
                    {stat.value || stat.title}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#ede0cc]">
                    {stat.value ? stat.title : stat.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recognition Statement */}
        <div className="max-w-3xl mx-auto text-center space-y-6 p-8 md:p-12 rounded-3xl" style={{ background: "rgba(245,233,218,0.3)", border: "1px dashed #E8D5BC" }}>
          <h3 className="text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
            Recognized for Innovation. Trusted for Results.
          </h3>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "#7A5C45" }}>
            Roshini's NutriMix was recognized as an <strong className="text-[#6B3E26]">Innovative Product at National Saras Mela 2024</strong> and later honored as <strong className="text-[#6B3E26]">Best Product at National Saras Mela 2024-25</strong> for its quality, nutritional value, and consumer acceptance.
          </p>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "#7A5C45" }}>
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
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ background: "#F5E9DA" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Real Customers, Real Stories</span>
          <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
            What Families Are Saying
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl flex flex-col gap-4" style={{ background: "#FFFDF9", border: "1.5px solid #E8D5BC" }}>
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: "#E6A817" }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed italic" style={{ color: "#2C1A0E" }}>"{t.text}"</p>
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-[#E8D5BC]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: "#6B3E26" }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#6B3E26" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "#7A5C45" }}>{t.location}</div>
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
    <section className="py-16 px-4 sm:px-6" style={{ background: "#FFFDF9" }}>
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <span className="section-label">Stay Connected</span>
        <h2 className="text-3xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
          Get Nutrition Tips & Exclusive Offers
        </h2>
        <p className="text-sm" style={{ color: "#7A5C45" }}>
          Join 500+ families who receive weekly wellness tips, new product launches and exclusive member discounts.
        </p>
        <NewsletterForm />
        <p className="text-[11px]" style={{ color: "#B0886A" }}>No spam. Unsubscribe anytime. We respect your privacy.</p>
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
    <section className="py-16 md:py-20 px-4 sm:px-6 w-full max-w-7xl mx-auto" style={{ background: "#FFFDF9" }}>
      <div className="text-center mb-16">
        <span className="section-label" style={{ color: "#E6A817" }}>Roshini Wellness Hub</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
          Health Tips, Recipes & Guides
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Featured Blog & Latest */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif text-[#6B3E26] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B23A2A]" /> Featured Article
            </h3>
            <div className="group border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-[#FFFDF9]" style={{ borderColor: "#E8D5BC" }}>
              {getBlogImageUrl(featuredBlog) ? (
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                  <img src={getBlogImageUrl(featuredBlog) || ""} alt={featuredBlog.title} className="object-cover h-full w-full group-hover:scale-105 transition-all duration-300" />
                </div>
              ) : null}
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B23A2A]">{featuredBlog.vCategory?.cName || "Wellness"}</span>
                <h4 className="text-xl md:text-2xl font-bold font-serif text-[#6B3E26] group-hover:text-[#B23A2A] transition-colors">
                  <Link href={`/blogs/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                </h4>
                <p className="text-sm text-[#7A5C45] line-clamp-3">{featuredBlog.excerpt}</p>
                <div className="flex items-center gap-4 text-xs pt-2" style={{ color: "#7A5C45" }}>
                  <span>{new Date(featuredBlog.publishDate || featuredBlog.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{featuredBlog.readingTime || 1} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Blogs List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-[#6B3E26] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B23A2A]" /> Latest Blogs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestBlogs.map((blog) => (
                <div key={blog._id} className="group flex flex-col p-4 border rounded-2xl bg-[#FFFDF9] hover:-translate-y-1 transition-all" style={{ borderColor: "#E8D5BC" }}>
                  {getBlogImageUrl(blog) ? (
                    <img src={getBlogImageUrl(blog) || ""} alt={blog.title} className="h-32 w-full object-cover rounded-xl mb-3" />
                  ) : null}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B23A2A]">{blog.vCategory?.cName}</span>
                  <h4 className="font-bold text-sm font-serif text-[#6B3E26] line-clamp-2 mt-1 group-hover:text-[#B23A2A]">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h4>
                  <span className="text-[10px] text-[#7A5C45] mt-auto pt-2">{blog.readingTime || 1} min read</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Highlights & Trending */}
        <div className="space-y-8">
          {/* Highlights */}
          <div className="p-6 rounded-3xl space-y-6" style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}>
            <h3 className="text-lg font-bold font-serif text-[#6B3E26] border-b pb-2 flex items-center gap-2" style={{ borderColor: "#E8D5BC" }}>
              🎯 Weekly Highlights
            </h3>

            {healthTipOfTheWeek && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-0.5 rounded-full">Health Tip of the Week</span>
                <h4 className="font-bold text-sm text-[#6B3E26] hover:text-[#B23A2A]"><Link href={`/blogs/${healthTipOfTheWeek.slug}`}>{healthTipOfTheWeek.title}</Link></h4>
                <p className="text-xs text-[#7A5C45] line-clamp-2">{healthTipOfTheWeek.excerpt}</p>
              </div>
            )}

            {recipeOfTheWeek && (
              <div className="space-y-2 pt-4 border-t" style={{ borderColor: "#E8D5BC" }}>
                <span className="text-[10px] font-bold uppercase bg-[#E6A817]/10 text-[#E6A817] px-2 py-0.5 rounded-full">Recipe of the Week</span>
                <h4 className="font-bold text-sm text-[#6B3E26] hover:text-[#B23A2A]"><Link href={`/blogs/${recipeOfTheWeek.slug}`}>{recipeOfTheWeek.title}</Link></h4>
                <p className="text-xs text-[#7A5C45] line-clamp-2">{recipeOfTheWeek.excerpt}</p>
              </div>
            )}
          </div>

          {/* Trending Articles */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-[#6B3E26] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B23A2A]" /> Trending Articles
            </h3>
            <div className="divide-y divide-[#E8D5BC]">
              {trendingBlogs.map((blog, idx) => (
                <div key={blog._id} className="py-3 flex items-start gap-4 group">
                  <span className="text-2xl font-bold text-[#E8D5BC] font-serif">0{idx + 1}</span>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#B23A2A]">{blog.vCategory?.cName}</span>
                    <h4 className="font-bold text-sm font-serif text-[#6B3E26] group-hover:text-[#B23A2A]">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h4>
                    <span className="text-[10px] text-[#7A5C45] block">{blog.viewCount} views</span>
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
