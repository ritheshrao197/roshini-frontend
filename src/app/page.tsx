import React from "react";
import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import Header from "@/components/partials/Header";
import NewsletterForm from "@/components/home/NewsletterForm";

export const revalidate = 60;

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Bengaluru",
    text: "The health mix is absolutely fantastic — my kids love it! No added sugar and I can actually taste the quality of real ingredients. Will definitely reorder.",
    rating: 5,
    avatar: "P",
  },
  {
    name: "Anitha Rao",
    location: "Mysuru",
    text: "Finally a homemade brand that delivers what it promises. The turmeric latte mix is pure gold. Been ordering every month for the past year!",
    rating: 5,
    avatar: "A",
  },
  {
    name: "Deepak Nair",
    location: "Chennai",
    text: "Roshini's ragi malt has replaced my morning oats entirely. Rich taste, filling, and I feel genuinely energised. Fantastic Karnataka flavours.",
    rating: 5,
    avatar: "D",
  },
];

const WHY_US = [
  {
    icon: "🌾",
    title: "No Added Sugar",
    desc: "Naturally sweetened with dates, jaggery, and whole fruits. Zero refined sugar in every product.",
    color: "#4CAF50",
  },
  {
    icon: "🧪",
    title: "Preservative Free",
    desc: "Crafted fresh in small batches with zero artificial preservatives, colours, or flavours.",
    color: "#E6A817",
  },
  {
    icon: "🏡",
    title: "Homemade Quality",
    desc: "Every product is handcrafted with the same care as a home kitchen — because it starts in one.",
    color: "#6B3E26",
  },
  {
    icon: "📦",
    title: "Micro Batches",
    desc: "Small-run production ensures absolute freshness and maximum nutritional integrity.",
    color: "#B23A2A",
  },
  {
    icon: "🌿",
    title: "Karnataka Heritage",
    desc: "Recipes rooted in traditional Karnataka nutrition wisdom, passed down through generations.",
    color: "#4CAF50",
  },
  {
    icon: "🚚",
    title: "Pan-India Delivery",
    desc: "Carefully packed and shipped fresh across India. Free shipping on orders above ₹999.",
    color: "#6B3E26",
  },
];

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

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Poppins', sans-serif" }}>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────── */}
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

      {/* ── TRUST BADGES ─────────────────────────────────────── */}
      <section style={{ background: "#6B3E26" }} className="py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: "🚚", title: "Free Shipping", sub: "Orders above ₹999" },
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

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section id="featured" className="py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="section-label">Our Bestsellers</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-1" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
              Featured Products
            </h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold flex items-center gap-1 hover:underline" style={{ color: "#6B3E26" }}>
            View All Products →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#E8D5BC] rounded-3xl" style={{ background: "#FDF6EC" }}>
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-lg font-bold" style={{ color: "#6B3E26" }}>Fresh Batch Coming Soon</h3>
            <p className="text-sm mt-1" style={{ color: "#7A5C45" }}>Our artisan kitchen is preparing the next batch. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      {categories.length > 0 && (
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
      )}

      {/* ── WHY CHOOSE ROSHINI'S ─────────────────────────────── */}
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

      {/* ── BRAND STORY ──────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #6B3E26 0%, #8a5438 100%)" }} className="py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(245,233,218,0.15)", color: "#F5E9DA" }}>
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#F5E9DA" }}>
              From Roshini's Kitchen<br />to Your Family Table
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#ede0cc" }}>
              Born from a passion for authentic nutrition and a deep respect for Karnataka's food heritage, Roshini's Home Products brings time-tested recipes to modern families across India.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#ede0cc" }}>
              Every product is crafted in small, loving batches — ensuring the same quality and care your grandmother would approve of.
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

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
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

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
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

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: "#6B3E26", color: "#F5E9DA" }} className="pt-14 pb-6 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[rgba(245,233,218,0.2)]">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#F5E9DA] flex items-center justify-center text-[#6B3E26] font-bold text-lg">R</div>
                <div>
                  <div className="font-bold text-[#F5E9DA]" style={{ fontFamily: "'Merriweather', serif" }}>Roshini's</div>
                  <div className="text-[10px] text-[#ede0cc] tracking-widest uppercase">Home Products</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#ede0cc" }}>
                Traditional nutrition crafted with love in Karnataka. Homemade quality, delivered to your door.
              </p>
              <div className="flex gap-3">
                {["📘", "📸", "💬"].map((s, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-[rgba(245,233,218,0.15)] transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F5E9DA]">Shop</h4>
              <ul className="space-y-2">
                {[["All Products", "/shop"], ["Health Mixes", "/shop?category=health-mixes"], ["Herbal Teas", "/shop?category=herbal-tea"], ["Spice Powders", "/shop?category=spice"], ["Seed Mixes", "/shop?category=seed-mixes"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-xs hover:text-[#E6A817] transition-colors" style={{ color: "#ede0cc" }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F5E9DA]">Account</h4>
              <ul className="space-y-2">
                {[["Sign In", "/login"], ["Register", "/register"], ["My Orders", "/dashboard"], ["Track Order", "/dashboard"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-xs hover:text-[#E6A817] transition-colors" style={{ color: "#ede0cc" }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F5E9DA]">Contact</h4>
              <ul className="space-y-2 text-xs" style={{ color: "#ede0cc" }}>
                <li>📍 Karnataka, India</li>
                <li>📞 <a href="tel:+919999999999" className="hover:text-[#E6A817] transition-colors">+91 99999 99999</a></li>
                <li>✉️ <a href="mailto:hello@roshinishomeproducts.com" className="hover:text-[#E6A817] transition-colors">hello@roshinishomeproducts.com</a></li>
                <li>🕐 Mon–Sat: 9am – 7pm IST</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs" style={{ color: "#B0886A" }}>
            <div>© 2026 Roshini's Home Products. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#F5E9DA] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#F5E9DA] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#F5E9DA] transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
