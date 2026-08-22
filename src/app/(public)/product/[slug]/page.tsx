import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, BACKEND_URL } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInteractiveDetails from "@/components/product/ProductInteractiveDetails";
import ProductReviews from "@/components/product/ProductReviews";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.seoTitle || product.pName} | Roshini's Home Products`,
    description: product.seoDescription || product.pDescription.slice(0, 155),
    openGraph: {
      title: product.pName,
      description: product.pDescription,
      images: product.image?.secureUrl 
        ? [{ url: product.image.secureUrl }]
        : product.images?.[0]?.secureUrl
        ? [{ url: product.images[0].secureUrl }]
        : product.pImages?.length 
        ? [{ url: product.pImages[0] }] 
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product);

  // Full gallery: primary `image` first, then every `images[]` entry (deduped),
  // falling back to legacy `pImages` strings only when neither newer field has
  // anything — matches the fallback order already used for the single-image
  // case elsewhere (ProductCard, AddToCartButton), just collecting all of
  // them instead of stopping at the first.
  const galleryImages: string[] = [];
  if (product.image?.secureUrl) galleryImages.push(product.image.secureUrl);
  if (product.images?.length) {
    for (const img of product.images) {
      if (img.secureUrl && !galleryImages.includes(img.secureUrl)) galleryImages.push(img.secureUrl);
    }
  }
  if (galleryImages.length === 0 && product.pImages?.length) {
    for (const p of product.pImages) {
      galleryImages.push(p.startsWith("http") ? p : `${BACKEND_URL}/uploads/products/${encodeURIComponent(p)}`);
    }
  }

  const imageUrl = galleryImages[0] || "/images/product-placeholder.jpg";

  const isOutOfStock = product.pQuantity === 0;
  const categoryName = typeof product.pCategory === "object" ? product.pCategory.cName : "Homemade";

  const reviewCount = product.pRatingsReviews?.length || 0;
  const averageRating = reviewCount
    ? product.pRatingsReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviewCount
    : 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.pName,
    image: imageUrl,
    description: product.pDescription,
    sku: product._id,
    brand: { "@type": "Brand", name: "Roshini's Home Products" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.pPrice,
      availability: isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      priceValidUntil: "2029-12-31",
    },
    // Only include real reviews — fabricated ratings/counts violate Google's
    // structured data guidelines and mislead shoppers.
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (Math.round(averageRating * 10) / 10).toString(),
        reviewCount: String(reviewCount),
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://roshinis.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": "https://roshinis.com/shop"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.pName,
        "item": `https://roshinis.com/product/${product.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF9", color: "#2C1A0E", fontFamily: "'Poppins', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 py-3 border-b" style={{ borderColor: "#E8D5BC", background: "#FDF6EC" }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs" style={{ color: "#7A5C45" }}>
          <Link href="/" className="hover:text-[#6B3E26] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[#6B3E26] transition-colors">Shop</Link>
          <span>›</span>
          <span style={{ color: "#6B3E26", fontWeight: 600 }}>{product.pName}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        {/* Core Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">

          {/* Image Gallery */}
          <div className="space-y-3">
            <ProductImageGallery
              images={galleryImages}
              alt={product.pName}
              offerPercent={Number(product.pOffer)}
              isOutOfStock={isOutOfStock}
            />

            {/* Quality badges strip */}
            <div className="grid grid-cols-3 gap-2">
              {[["🌿", "100% Natural"], ["🍬", "No Sugar Added"], ["🏡", "Homemade"]].map(([icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-1 py-3 rounded-2xl text-center" style={{ background: "#F5E9DA", border: "1px solid #E8D5BC" }}>
                  <span className="text-xl">{icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#6B3E26" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <ProductInteractiveDetails product={product} />
        </div>

        {/* Nutritional Info */}
        {product.nutritionalInfo && (
          <div className="rounded-3xl p-8 mb-12" style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}>
            <h3 className="text-2xl font-bold mb-5" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
              Nutritional Insights
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(product.nutritionalInfo).map(([key, val]) => (
                <div key={key} className="text-center p-4 rounded-2xl" style={{ background: "#FFFDF9", border: "1px solid #E8D5BC" }}>
                  <span className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#7A5C45" }}>{key}</span>
                  <span className="block text-xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <ProductReviews product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ borderTop: "1.5px solid #E8D5BC" }} className="pt-12 space-y-6">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
                You May Also Like
              </h3>
              <Link href="/shop" className="text-sm font-semibold hover:underline" style={{ color: "#6B3E26" }}>
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer mini */}
      <footer className="py-6 px-4 sm:px-6 text-center text-xs mt-auto" style={{ borderTop: "1px solid #E8D5BC", color: "#7A5C45" }}>
        © 2026 Roshini's Home Products · Handcrafted in Karnataka · All Natural
      </footer>
    </div>
  );
}
