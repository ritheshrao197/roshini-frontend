import React from "react";
import Link from "next/link";
import { getHomePageData } from "@/lib/api";
import IndianBorder from "@/components/decorative/IndianBorder";
import HeroSlider from "@/components/home/HeroSlider";
import HeritageIntroSection from "@/components/home/HeritageIntroSection";
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
  { sectionId: "heritage_intro" },
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
    <div className="min-h-screen flex flex-col" style={{ color: "var(--text)" }}>
      <HeroSlider sliders={heroSliders} products={products} />
      <HeritageIntroSection />
      {layout
        .filter((section) => section.sectionId !== "hero" && section.sectionId !== "heritage_intro")
        .map((section, index) => {
          switch (section.sectionId) {
            case "trust_badges":
              return <TrustBadgesSection key={`trust-${index}`} />;
            case "categories":
              return <CategoriesSection key={`categories-${index}`} categories={categories} />;
            case "featured_products":
              // Placeholder target for the "Ingredients" nav link until Phase 3
              // builds the real ingredient showcase section here.
              return (
                <React.Fragment key={`products-${index}`}>
                  <div id="ingredients" aria-hidden="true" />
                  <FeaturedProductsSection products={products} />
                </React.Fragment>
              );
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
      <IndianBorder variant="minimal" position="top" className="px-4 sm:px-6 lg:px-8" />
      <footer className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto" style={{ background: "var(--brand-brown-dark, #3C2015)", color: "var(--brand-cream)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12" style={{ borderBottom: "1px solid rgba(246, 238, 225, 0.2)" }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center font-bold text-xl shadow-sm" style={{ borderRadius: "var(--radius-lg)", background: "var(--brand-cream)", color: "var(--brand-brown-dark, #3C2015)" }}>R</div>
                <div>
                  <div className="font-bold text-lg leading-none" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-cream)" }}>Roshini&rsquo;s</div>
                  <div className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "var(--brand-cream-dark)" }}>Home Products</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--brand-cream-dark)" }}>
                Traditional nutrition crafted with love in Karnataka. Homemade quality, delivered to your door.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Shop</h4>
              <ul className="space-y-2.5">
                {[["All Products", "/shop"], ["Health Mixes", "/shop?category=health-mixes"], ["Herbal Teas", "/shop?category=herbal-tea"], ["Spice Powders", "/shop?category=spice"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Account</h4>
              <ul className="space-y-2.5">
                {[["Sign In", "/login"], ["Register", "/register"], ["My Orders", "/account/dashboard"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Contact</h4>
              <ul className="space-y-3 text-xs" style={{ color: "var(--brand-cream-dark)" }}>
                <li className="flex items-center gap-2"><span>📍</span><span>Karnataka, India</span></li>
                <li className="flex items-center gap-2"><span>📞</span><span>+91 95918 96917</span></li>
                <li className="flex items-center gap-2"><span>✉️</span><span>roshinishomeproducts@gmail.com</span></li>
                <li className="flex items-center gap-2"><span>🕐</span><span>Mon–Sat: 9am – 7pm IST</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs" style={{ color: "var(--brand-cream-dark)" }}>
            <div>© 2026 Roshini&rsquo;s Home Products. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/privacy-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Privacy Policy</Link>
              <Link href="/terms-of-service" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Terms of Service</Link>
              <Link href="/refund-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Refund Policy</Link>
              <Link href="/shipping-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Shipping Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
