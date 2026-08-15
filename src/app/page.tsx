import React from "react";
import { getHomePageData } from "@/lib/api";
import Footer from "@/components/partials/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import HeritageIntroSection from "@/components/home/HeritageIntroSection";
import IngredientGallerySection from "@/components/home/IngredientGallerySection";
import GrainToBlendStorySection from "@/components/home/GrainToBlendStorySection";
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

/**
 * Sections rendered as fixed JSX below, above the CMS-driven list — never
 * admin-toggleable, and filtered out of `layout` so a CMS payload that happens to
 * list them can't duplicate them. Single source of truth for "not CMS-configurable".
 */
const FIXED_SECTIONS = new Set(["hero", "heritage_intro"]);

const DEFAULT_LAYOUT = [
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
  const { products, categories, achievements, ingredients, heroSliders, sections: apiSections, vlogs } = await getHomePageData();

  // Use API sections if available, otherwise fallback to default structure
  const layout = apiSections && apiSections.length > 0 ? apiSections : DEFAULT_LAYOUT;

  return (
    <div className="min-h-screen flex flex-col" style={{ color: "var(--text)" }}>
      <HeroSlider sliders={heroSliders} products={products} />
      <HeritageIntroSection />
      {layout
        .filter((section) => !FIXED_SECTIONS.has(section.sectionId))
        .map((section, index) => {
          switch (section.sectionId) {
            case "trust_badges":
              return <TrustBadgesSection key={`trust-${index}`} />;
            case "categories":
              return <CategoriesSection key={`categories-${index}`} categories={categories} />;
            // The two ingredient/storytelling sections are NOT CMS-configurable,
            // but the spec places them after Featured Products and before Why-Us
            // — a position `FIXED_SECTIONS` (prepend-only) can't express. Pinning
            // them to this case renders them there regardless of what the CMS
            // `sections` payload contains, matching the pattern Phase 2 used for
            // the old `#ingredients` anchor placeholder.
            case "featured_products":
              return (
                <React.Fragment key={`products-${index}`}>
                  <FeaturedProductsSection products={products} />
                  <IngredientGallerySection ingredients={ingredients} />
                  <GrainToBlendStorySection product={products?.find((p) => /nutrimix/i.test(p.pName)) || products?.[0] || null} />
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

      <Footer />
    </div>
  );
}
