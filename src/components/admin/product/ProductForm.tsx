"use client";

import React, { useState, useEffect } from "react";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricing from "./ProductPricing";
import ProductImages, { GalleryImage } from "./ProductImages";
import ProductIngredients from "./ProductIngredients";
import ProductBenefits from "./ProductBenefits";
import ProductSEO from "./ProductSEO";
import ProductShipping from "./ProductShipping";
import { API_URL } from "@/lib/api";

interface SimpleCategory {
  _id: string;
  cName: string;
}

interface SimpleProduct {
  _id: string;
  pName: string;
}

interface ProductFormProps {
  initialProduct?: any;
  categoriesList: SimpleCategory[];
  allProductsList: SimpleProduct[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  initialProduct,
  categoriesList,
  allProductsList,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const isEditMode = !!initialProduct;

  // Active form section tab
  const [activeTab, setActiveTab] = useState<
    "basic" | "pricing" | "media" | "wellness" | "labels" | "seo" | "shipping"
  >("basic");

  // Form states
  const [pName, setPName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [productType, setProductType] = useState("Health Mix");
  const [brandName, setBrandName] = useState("Roshini’s Home Products");

  const [pPrice, setPPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");
  const [pQuantity, setPQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [productWeight, setProductWeight] = useState("");

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [nutritionalInfo, setNutritionalInfo] = useState<{ [key: string]: string }>({});
  const [usageInstructions, setUsageInstructions] = useState("");
  const [storageInstructions, setStorageInstructions] = useState("");

  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [pStatus, setPStatus] = useState("Active");
  const [suitableFor, setSuitableFor] = useState<string[]>([]);
  const [trustBadges, setTrustBadges] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");

  const [shippingWeight, setShippingWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [codAvailable, setCodAvailable] = useState(true);
  const [freeShippingEligible, setFreeShippingEligible] = useState(false);
  const [allowCoupons, setAllowCoupons] = useState(true);
  const [limitedTimeOffer, setLimitedTimeOffer] = useState(false);
  const [offerExpiryDate, setOfferExpiryDate] = useState("");

  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
  const [pCategory, setPCategory] = useState("");

  // System states
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Populate data on edit mode
  useEffect(() => {
    if (initialProduct) {
      setPName(initialProduct.pName || "");
      setSlug(initialProduct.slug || "");
      setShortDescription(initialProduct.shortDescription || "");
      setPDescription(initialProduct.pDescription || "");
      setProductType(initialProduct.productType || "Health Mix");
      setBrandName(initialProduct.brandName || "Roshini’s Home Products");

      setPPrice(String(initialProduct.pPrice || ""));
      setComparePrice(String(initialProduct.comparePrice || ""));
      setSku(initialProduct.sku || "");
      setPQuantity(String(initialProduct.pQuantity || ""));
      setLowStockThreshold(String(initialProduct.lowStockThreshold || "10"));
      setProductWeight(initialProduct.productWeight || "");

      setPCategory(initialProduct.pCategory?._id || initialProduct.pCategory || "");
      setIngredients(initialProduct.ingredients || []);
      
      if (initialProduct.nutritionalInfo) {
        // Mongoose maps to JS objects
        setNutritionalInfo(
          initialProduct.nutritionalInfo instanceof Map
            ? Object.fromEntries(initialProduct.nutritionalInfo)
            : initialProduct.nutritionalInfo
        );
      } else {
        setNutritionalInfo({});
      }

      setUsageInstructions(initialProduct.usageInstructions || "");
      setStorageInstructions(initialProduct.storageInstructions || "");

      setFeatured(initialProduct.featured || false);
      setBestseller(initialProduct.bestseller || false);
      setPStatus(initialProduct.pStatus || "Active");
      setSuitableFor(initialProduct.suitableFor || []);
      setTrustBadges(initialProduct.trustBadges || []);
      setBenefits(initialProduct.benefits || []);

      setSeoTitle(initialProduct.seoTitle || "");
      setSeoDescription(initialProduct.seoDescription || "");
      setTags(initialProduct.tags || []);
      setCanonicalUrl(initialProduct.canonicalUrl || "");
      setOgImage(initialProduct.ogImage || "");

      setShippingWeight(String(initialProduct.shippingWeight || ""));
      if (initialProduct.packageDimensions) {
        setLength(String(initialProduct.packageDimensions.length || ""));
        setWidth(String(initialProduct.packageDimensions.width || ""));
        setHeight(String(initialProduct.packageDimensions.height || ""));
      }
      setCodAvailable(initialProduct.codAvailable !== false);
      setFreeShippingEligible(initialProduct.freeShippingEligible || false);
      setAllowCoupons(initialProduct.allowCoupons !== false);
      setLimitedTimeOffer(initialProduct.limitedTimeOffer || false);
      
      if (initialProduct.offerExpiryDate) {
        setOfferExpiryDate(new Date(initialProduct.offerExpiryDate).toISOString().split("T")[0]);
      }

      setRelatedProducts(initialProduct.relatedProducts || []);

      if (initialProduct.images && initialProduct.images.length > 0) {
        setGalleryImages(
          initialProduct.images.map((img: any) => ({
            id: img.publicId || Math.random().toString(36).substring(7),
            publicId: img.publicId,
            secureUrl: img.secureUrl,
            previewUrl: img.secureUrl,
            alt: img.alt || "",
            isPrimary: !!img.isPrimary,
          }))
        );
      } else if (initialProduct.image && initialProduct.image.secureUrl) {
        setGalleryImages([
          {
            id: initialProduct.image.publicId || "main",
            publicId: initialProduct.image.publicId,
            secureUrl: initialProduct.image.secureUrl,
            previewUrl: initialProduct.image.secureUrl,
            alt: initialProduct.image.alt || "",
            isPrimary: true,
          },
        ]);
      } else {
        setGalleryImages([]);
      }

      setHasChanges(false);
    } else {
      setGalleryImages([]);
    }
  }, [initialProduct]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // Change detection
  useEffect(() => {
    if (!initialProduct) {
      if (pName || pDescription || pPrice) {
        setHasChanges(true);
      }
    } else {
      setHasChanges(true);
    }
  }, [
    pName,
    slug,
    shortDescription,
    pDescription,
    productType,
    brandName,
    pPrice,
    comparePrice,
    sku,
    pQuantity,
    lowStockThreshold,
    productWeight,
    galleryImages,
    ingredients,
    nutritionalInfo,
    usageInstructions,
    storageInstructions,
    featured,
    bestseller,
    pStatus,
    suitableFor,
    trustBadges,
    benefits,
    seoTitle,
    seoDescription,
    tags,
    canonicalUrl,
    ogImage,
    shippingWeight,
    length,
    width,
    height,
    codAvailable,
    freeShippingEligible,
    allowCoupons,
    limitedTimeOffer,
    offerExpiryDate,
    relatedProducts,
    pCategory,
  ]);

  // Draft recovery from localStorage for new products
  useEffect(() => {
    if (!isEditMode) {
      const draft = localStorage.getItem("rhp_product_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setPName(parsed.pName || "");
          setPDescription(parsed.pDescription || "");
          setPPrice(parsed.pPrice || "");
          setPQuantity(parsed.pQuantity || "");
          setPCategory(parsed.pPCategory || "");
        } catch (e) {}
      }
    }
  }, [isEditMode]);

  // Auto-save draft
  useEffect(() => {
    if (!isEditMode && autoSaveEnabled && (pName || pDescription || pPrice)) {
      const timer = setTimeout(() => {
        localStorage.setItem(
          "rhp_product_draft",
          JSON.stringify({ pName, pDescription, pPrice, pQuantity, pPCategory: pCategory })
        );
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pName, pDescription, pPrice, pQuantity, pCategory, isEditMode, autoSaveEnabled]);

  // Duplicate / Clone Action
  const handleCloneProduct = () => {
    setPName(`${pName} (Copy)`);
    setSlug(`${slug}-copy`);
    setSku(`${sku}-COPY`);
    setFormSuccess("Product cloned successfully! Review the copy before saving.");
  };

  // Soft Delete Action
  const handleDeleteProduct = async () => {
    if (!initialProduct?._id) return;
    if (!confirm("Are you sure you want to soft delete this product?")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/product/delete-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pId: initialProduct._id }),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess("Product soft deleted successfully!");
        setTimeout(() => onSuccess(), 1500);
      } else {
        setFormError(data.error || "Failed to delete product.");
      }
    } catch (e) {
      setFormError("Connection error.");
    } finally {
      setIsSaving(false);
    }
  };

  // Restore Action
  const handleRestoreProduct = async () => {
    if (!initialProduct?._id) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/product/restore-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pId: initialProduct._id }),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess("Product restored successfully!");
        setTimeout(() => onSuccess(), 1500);
      } else {
        setFormError(data.error || "Failed to restore product.");
      }
    } catch (e) {
      setFormError("Connection error.");
    } finally {
      setIsSaving(false);
    }
  };

  // Main Submit Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!pCategory) {
      setFormError("Product category is required");
      return;
    }

    if (galleryImages.length === 0) {
      setFormError("Must provide at least 1 product image");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      if (isEditMode) {
        formData.append("pId", initialProduct._id);
      }
      formData.append("pName", pName);
      formData.append("slug", slug);
      formData.append("shortDescription", shortDescription);
      formData.append("pDescription", pDescription);
      formData.append("productType", productType);
      formData.append("brandName", brandName);

      formData.append("pPrice", pPrice);
      formData.append("comparePrice", comparePrice);
      formData.append("sku", sku);
      formData.append("pQuantity", pQuantity);
      formData.append("lowStockThreshold", lowStockThreshold);
      formData.append("productWeight", productWeight);

      formData.append("pCategory", pCategory);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("nutritionalInfo", JSON.stringify(nutritionalInfo));
      formData.append("usageInstructions", usageInstructions);
      formData.append("storageInstructions", storageInstructions);

      formData.append("featured", String(featured));
      formData.append("bestseller", String(bestseller));
      formData.append("pStatus", pStatus);
      formData.append("suitableFor", JSON.stringify(suitableFor));
      formData.append("trustBadges", JSON.stringify(trustBadges));
      formData.append("benefits", JSON.stringify(benefits));

      formData.append("seoTitle", seoTitle);
      formData.append("seoDescription", seoDescription);
      formData.append("tags", JSON.stringify(tags));
      formData.append("canonicalUrl", canonicalUrl);
      formData.append("ogImage", ogImage);

      formData.append("shippingWeight", shippingWeight);
      formData.append(
        "packageDimensions",
        JSON.stringify({ length: Number(length), width: Number(width), height: Number(height) })
      );
      formData.append("codAvailable", String(codAvailable));
      formData.append("freeShippingEligible", String(freeShippingEligible));
      formData.append("allowCoupons", String(allowCoupons));
      formData.append("limitedTimeOffer", String(limitedTimeOffer));
      formData.append("offerExpiryDate", offerExpiryDate);
      formData.append("relatedProducts", JSON.stringify(relatedProducts));

      const filesToUpload: File[] = [];
      const imagesMetadata: any[] = [];

      galleryImages.forEach((img) => {
        if (img.file) {
          filesToUpload.push(img.file);
          imagesMetadata.push({
            fileIndex: filesToUpload.length - 1,
            alt: img.alt,
            isPrimary: img.isPrimary,
          });
        } else if (img.publicId && img.secureUrl) {
          imagesMetadata.push({
            publicId: img.publicId,
            secureUrl: img.secureUrl,
            alt: img.alt,
            isPrimary: img.isPrimary,
          });
        }
      });

      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("imagesMetadata", JSON.stringify(imagesMetadata));

      const endpoint = isEditMode
        ? `${API_URL}/product/edit-product`
        : `${API_URL}/product/add-product`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        setFormError(data.error);
      } else {
        setFormSuccess(isEditMode ? "Product updated successfully!" : "Product created successfully!");
        setHasChanges(false);
        if (!isEditMode) {
          localStorage.removeItem("rhp_product_draft");
        }
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      setFormError("Server connection error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-accent-green">
            {isEditMode ? "Edit Product Details" : "Add New Wellness Product"}
          </h2>
          <p className="text-xs text-foreground/70">
            Configure catalog pricing, SEO tags, ingredients, and social preview properties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditMode && (
            <>
              <button
                type="button"
                onClick={handleCloneProduct}
                className="px-4 py-2 bg-[#fcfaf2] border border-[#ece7d9] text-xs font-bold text-accent-green rounded-full hover:bg-accent-cream-dark/30"
              >
                👯 Clone Product
              </button>
              {initialProduct.isDeleted ? (
                <button
                  type="button"
                  onClick={handleRestoreProduct}
                  className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 text-xs font-bold rounded-full hover:bg-green-100"
                >
                  ♻️ Restore
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-full hover:bg-red-100"
                >
                  🗑️ Archive
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-foreground/60 border border-[#ece7d9] rounded-full"
          >
            Back to Catalog
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="bg-green-50 text-green-600 text-sm p-4 rounded-xl border border-green-100">
          {formSuccess}
        </div>
      )}
      {formError && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
          {formError}
        </div>
      )}

      {/* Tabs list Navigation */}
      <div className="border-b border-[#ece7d9] flex flex-wrap gap-1">
        {[
          { id: "basic", label: "📄 Info" },
          { id: "pricing", label: "💰 Pricing" },
          { id: "media", label: "📸 Media" },
          { id: "wellness", label: "🌿 Wellness" },
          { id: "labels", label: "🏷️ Badges" },
          { id: "seo", label: "🔍 SEO" },
          { id: "shipping", label: "✈️ Shipping" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 ${
              activeTab === t.id
                ? "border-accent-green text-accent-green"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selector (Pinned at top for easy catalog routing) */}
        <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Product Category *</label>
          <select
            value={pCategory}
            onChange={(e) => setPCategory(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
          >
            <option value="">-- Choose Category --</option>
            {categoriesList.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.cName}
              </option>
            ))}
          </select>
        </div>

        {/* Tab panels */}
        {activeTab === "basic" && (
          <ProductBasicInfo
            pName={pName}
            setPName={setPName}
            slug={slug}
            setSlug={setSlug}
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
            pDescription={pDescription}
            setPDescription={setPDescription}
            productType={productType}
            setProductType={setProductType}
            brandName={brandName}
            setBrandName={setBrandName}
          />
        )}

        {activeTab === "pricing" && (
          <ProductPricing
            pPrice={pPrice}
            setPPrice={setPPrice}
            comparePrice={comparePrice}
            setComparePrice={setComparePrice}
            sku={sku}
            setSku={setSku}
            pQuantity={pQuantity}
            setPQuantity={setPQuantity}
            lowStockThreshold={lowStockThreshold}
            setLowStockThreshold={setLowStockThreshold}
            productWeight={productWeight}
            setProductWeight={setProductWeight}
          />
        )}

        {activeTab === "media" && (
          <ProductImages
            galleryImages={galleryImages}
            setGalleryImages={setGalleryImages}
          />
        )}

        {activeTab === "wellness" && (
          <ProductIngredients
            ingredients={ingredients}
            setIngredients={setIngredients}
            nutritionalInfo={nutritionalInfo}
            setNutritionalInfo={setNutritionalInfo}
            usageInstructions={usageInstructions}
            setUsageInstructions={setUsageInstructions}
            storageInstructions={storageInstructions}
            setStorageInstructions={setStorageInstructions}
          />
        )}

        {activeTab === "labels" && (
          <ProductBenefits
            featured={featured}
            setFeatured={setFeatured}
            bestseller={bestseller}
            setBestseller={setBestseller}
            pStatus={pStatus}
            setPStatus={setPStatus}
            suitableFor={suitableFor}
            setSuitableFor={setSuitableFor}
            trustBadges={trustBadges}
            setTrustBadges={setTrustBadges}
            benefits={benefits}
            setBenefits={setBenefits}
          />
        )}

        {activeTab === "seo" && (
          <ProductSEO
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            tags={tags}
            setTags={setTags}
            canonicalUrl={canonicalUrl}
            setCanonicalUrl={setCanonicalUrl}
            ogImage={ogImage}
            setOgImage={setOgImage}
          />
        )}

        {activeTab === "shipping" && (
          <ProductShipping
            shippingWeight={shippingWeight}
            setShippingWeight={setShippingWeight}
            length={length}
            setLength={setLength}
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            codAvailable={codAvailable}
            setCodAvailable={setCodAvailable}
            freeShippingEligible={freeShippingEligible}
            setFreeShippingEligible={setFreeShippingEligible}
            allowCoupons={allowCoupons}
            setAllowCoupons={setAllowCoupons}
            limitedTimeOffer={limitedTimeOffer}
            setLimitedTimeOffer={setLimitedTimeOffer}
            offerExpiryDate={offerExpiryDate}
            setOfferExpiryDate={setOfferExpiryDate}
            relatedProducts={relatedProducts}
            setRelatedProducts={setRelatedProducts}
            allProductsList={allProductsList}
            viewCount={initialProduct?.viewCount}
            purchaseCount={initialProduct?.purchaseCount}
            conversionRate={initialProduct?.conversionRate}
          />
        )}

        {/* Form Controls */}
        <div className="flex items-center justify-between bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl">
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-foreground/75">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded border-[#ece7d9] text-accent-green"
                />
                Auto-save local draft
              </label>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-background border border-[#ece7d9] text-xs font-bold rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 bg-accent-green text-background text-xs font-bold rounded-full disabled:opacity-55"
            >
              {isSaving ? "Saving..." : isEditMode ? "Save Product Changes" : "Publish Product"}
            </button>
          </div>
        </div>
      </form>

      {/* Change History (For Edit Mode only) */}
      {isEditMode && initialProduct.auditLog && initialProduct.auditLog.length > 0 && (
        <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-3">
          <h4 className="font-serif font-bold text-accent-green text-sm">📋 Change History & Audit Log</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {initialProduct.auditLog.slice().reverse().map((entry: any, index: number) => (
              <div key={index} className="text-xs bg-background p-3 rounded-xl border border-[#ece7d9] flex justify-between gap-4">
                <div>
                  <span className="font-bold text-accent-green mr-2">[{entry.action}]</span>
                  <span className="text-foreground/80">{entry.details}</span>
                </div>
                <div className="text-[10px] text-foreground/50 text-right whitespace-nowrap">
                  <div>{entry.performedBy}</div>
                  <div>{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
