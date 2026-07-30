import React from "react";
import { getHomePageData } from "@/lib/api";
import HeroSlider from "@/components/home/HeroSlider";
import { 
  TrustBadgesSection, 
  CategoriesSection, 
  FeaturedProductsSection, 
  WhyUsSection, 
  BrandStorySection, 
  AchievementsSection, 
  TestimonialsSection, 
  NewsletterSection,
  HealthHubSection
} from "@/components/home/HomeSections";

export const revalidate = 300;

const DEFAULT_LAYOUT = [
  { sectionId: "hero" },
  { sectionId: "trust_badges" },
  { sectionId: "categories" },
  { sectionId: "featured_products" },
  { sectionId: "why_us" },
  { sectionId: "brand_story" },
  { sectionId: "achievements" },
  { sectionId: "testimonials" },
  { sectionId: "health_hub" },
  { sectionId: "newsletter" }
];

export default async function HomePage() {
  const { products, categories, achievements, heroSliders, sections: apiSections, vlogs } = await getHomePageData();

  // Use API sections if available, otherwise fallback to default structure
  const layout = apiSections && apiSections.length > 0 ? apiSections : DEFAULT_LAYOUT;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {layout.map((section, index) => {
        switch (section.sectionId) {
          case "hero":
            return <HeroSlider key={`hero-${index}`} sliders={heroSliders} />;
          case "trust_badges":
            return <TrustBadgesSection key={`trust-${index}`} />;
          case "categories":
            return <CategoriesSection key={`categories-${index}`} categories={categories} />;
          case "featured_products":
            return <FeaturedProductsSection key={`products-${index}`} products={products} />;
          case "why_us":
            return <WhyUsSection key={`whyus-${index}`} />;
          case "brand_story":
            return <BrandStorySection key={`brand-${index}`} />;
          case "achievements":
            return <AchievementsSection key={`achievements-${index}`} achievements={achievements} />;
          case "testimonials":
            return <TestimonialsSection key={`testimonials-${index}`} />;
          case "newsletter":
            return <NewsletterSection key={`newsletter-${index}`} />;
          case "health_hub":
            return <HealthHubSection key={`healthhub-${index}`} vlogs={vlogs} />;
          default:
            return null;
        }
      })}

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="pt-14 pb-6 px-4 sm:px-6 mt-auto" style={{ background: "var(--brand-brown-dark, #3C2015)", color: "var(--brand-cream)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10" style={{ borderBottom: "1px solid rgba(246, 238, 225, 0.2)" }}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 flex items-center justify-center font-bold text-lg" style={{ borderRadius: "var(--radius-lg)", background: "var(--brand-cream)", color: "var(--brand-brown-dark, #3C2015)" }}>R</div>
                <div>
                  <div className="font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-cream)" }}>Roshini's</div>
                  <div className="text-[10px] tracking-widest uppercase" style={{ color: "var(--brand-cream-dark)" }}>Home Products</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--brand-cream-dark)" }}>
                Traditional nutrition crafted with love in Karnataka. Homemade quality, delivered to your door.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Shop</h4>
              <ul className="space-y-2">
                {[["All Products", "/shop"], ["Health Mixes", "/shop?category=health-mixes"], ["Herbal Teas", "/shop?category=herbal-tea"], ["Spice Powders", "/shop?category=spice"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Account</h4>
              <ul className="space-y-2">
                {[["Sign In", "/login"], ["Register", "/register"], ["My Orders", "/account/dashboard"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Contact</h4>
              <ul className="space-y-2 text-xs" style={{ color: "var(--brand-cream-dark)" }}>
                <li>📍 Karnataka, India</li>
                <li>📞 +91 95918 96917</li>
                <li>✉️roshinishomeproducts@gmail.com</li>
                <li>🕐 Mon–Sat: 9am – 7pm IST</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs" style={{ color: "var(--text-light)" }}>
            <div>© 2026 Roshini's Home Products. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="transition-colors" style={{ color: "var(--brand-cream-dark)" }}>Privacy Policy</a>
              <a href="#" className="transition-colors" style={{ color: "var(--brand-cream-dark)" }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
