import React from "react";
import { getFeaturedProducts, getCategories, getAchievements, getHeroSliders, getWebsiteSections } from "@/lib/api";
import HeroSlider from "@/components/home/HeroSlider";
import { 
  TrustBadgesSection, 
  CategoriesSection, 
  FeaturedProductsSection, 
  WhyUsSection, 
  BrandStorySection, 
  AchievementsSection, 
  TestimonialsSection, 
  NewsletterSection 
} from "@/components/home/HomeSections";

export const revalidate = 60;

const DEFAULT_LAYOUT = [
  { sectionId: "hero" },
  { sectionId: "trust_badges" },
  { sectionId: "categories" },
  { sectionId: "featured_products" },
  { sectionId: "why_us" },
  { sectionId: "brand_story" },
  { sectionId: "achievements" },
  { sectionId: "testimonials" },
  { sectionId: "newsletter" }
];

export default async function HomePage() {
  const [products, categories, achievements, heroSliders, apiSections] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getAchievements(),
    getHeroSliders(),
    getWebsiteSections()
  ]);

  // Use API sections if available, otherwise fallback to default structure
  const layout = apiSections && apiSections.length > 0 ? apiSections : DEFAULT_LAYOUT;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Poppins', sans-serif" }}>
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
            // Placeholder for Health Hub (Vlogs) which we can implement in the future
            return null; 
          default:
            return null;
        }
      })}

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: "#6B3E26", color: "#F5E9DA" }} className="pt-14 pb-6 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[rgba(245,233,218,0.2)]">
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
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F5E9DA]">Shop</h4>
              <ul className="space-y-2">
                {[["All Products", "/shop"], ["Health Mixes", "/shop?category=health-mixes"], ["Herbal Teas", "/shop?category=herbal-tea"], ["Spice Powders", "/shop?category=spice"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs hover:text-[#E6A817] transition-colors" style={{ color: "#ede0cc" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F5E9DA]">Account</h4>
              <ul className="space-y-2">
                {[["Sign In", "/login"], ["Register", "/register"], ["My Orders", "/account/dashboard"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs hover:text-[#E6A817] transition-colors" style={{ color: "#ede0cc" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F5E9DA]">Contact</h4>
              <ul className="space-y-2 text-xs" style={{ color: "#ede0cc" }}>
                <li>📍 Karnataka, India</li>
                <li>📞 +91 95918 96917</li>
                <li>✉️roshinishomeproducts@gmail.com</li>
                <li>🕐 Mon–Sat: 9am – 7pm IST</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs" style={{ color: "#B0886A" }}>
            <div>© 2026 Roshini's Home Products. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#F5E9DA] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#F5E9DA] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
