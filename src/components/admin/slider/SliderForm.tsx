import React, { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export interface Slider {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  desktopImage?: { publicId: string; secureUrl: string; alt: string } | string;
  mobileImage?: { publicId: string; secureUrl: string; alt: string } | string;
  productImage?: { publicId: string; secureUrl: string; alt: string } | string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  type: string;
  referenceId: string;
  linkedProductId?: string;
  badgeText: string;
  badgeColor: string;
  showOverlayStats: boolean;
  animationType: string;
  textAlignment: string;
  status: string;
  startDate?: string;
  endDate?: string;
  experimentId?: string;
  variant?: string;
  displayOrder: number;
}

/** `desktopImage`/`mobileImage` come back from the API as `{ publicId, secureUrl, alt }`
 *  objects (see server/models/heroSlider.js) — never render them directly as JSX text. */
function imageUrl(image?: { secureUrl: string } | string): string {
  if (!image) return "";
  return typeof image === "string" ? image : image.secureUrl || "";
}

interface Props {
  initialData?: Slider;
  onSuccess: () => void;
  onCancel: () => void;
  productsList: { _id: string; pName: string }[];
  achievementsList: { _id: string; title: string }[];
}

export default function SliderForm({ initialData, onSuccess, onCancel, productsList, achievementsList }: Props) {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState<Slider>({
    title: "",
    subtitle: "",
    description: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    type: "image",
    referenceId: "",
    linkedProductId: "",
    backgroundColor: "#4A2618",
    badgeText: "",
    badgeColor: "#AE6837",
    showOverlayStats: false,
    animationType: "fade",
    textAlignment: "left",
    status: "published",
    experimentId: "",
    variant: "",
    displayOrder: 0,
  });

  const [productImage, setProductImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        primaryButtonText: initialData.primaryButtonText || "",
        primaryButtonLink: initialData.primaryButtonLink || "",
        secondaryButtonText: initialData.secondaryButtonText || "",
        secondaryButtonLink: initialData.secondaryButtonLink || "",
        type: initialData.type || "image",
        referenceId: initialData.referenceId || "",
        linkedProductId: initialData.linkedProductId || "",
        backgroundColor: initialData.backgroundColor || "#4A2618",
        badgeText: initialData.badgeText || "",
        badgeColor: initialData.badgeColor || "#AE6837",
        showOverlayStats: initialData.showOverlayStats || false,
        animationType: initialData.animationType || "fade",
        textAlignment: initialData.textAlignment || "left",
        status: initialData.status || "published",
        displayOrder: initialData.displayOrder || 0,
        experimentId: initialData.experimentId || "",
        variant: initialData.variant || "",
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditMode
        ? `${API_URL}/admin/sliders/${initialData?._id}`
        : `${API_URL}/admin/sliders`;
      const method = isEditMode ? "PUT" : "POST";

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key as keyof Slider] !== undefined && formData[key as keyof Slider] !== "") {
          submitData.append(key, String(formData[key as keyof Slider]));
        }
      });

      if (productImage) submitData.append("productImage", productImage);

      const res = await fetch(url, {
        method,
        headers: {
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
        body: submitData,
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save slider");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">
          {isEditMode ? "Edit Homepage Slide" : "Add New Slide"}
        </h2>
        <button onClick={onCancel} className="px-4 py-2 border rounded-full hover:bg-gray-50 text-xs font-bold">
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
        
        {/* Type & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">Slide Type *</label>
            <select required name="type" value={formData.type} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]">
              <option value="image">Standard Image Banner</option>
              <option value="product">Dynamic Product Banner</option>
              <option value="achievement">Dynamic Achievement Banner</option>
              <option value="promotion">Promotion/Offer</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">Status *</label>
            <select required name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]">
              <option value="published">Published (Active)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Dynamic Reference Selector */}
        {formData.type === "product" && (
          <div className="space-y-2 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <label className="block text-xs font-bold text-blue-800 uppercase">Select Product *</label>
            <select name="referenceId" value={formData.referenceId} onChange={handleChange} required className="w-full border rounded-xl p-3">
              <option value="">-- Choose Product --</option>
              {productsList.map(p => <option key={p._id} value={p._id}>{p.pName}</option>)}
            </select>
          </div>
        )}
        {formData.type === "achievement" && (
          <div className="space-y-2 p-4 rounded-xl bg-purple-50 border border-purple-100">
            <label className="block text-xs font-bold text-purple-800 uppercase">Select Achievement *</label>
            <select name="referenceId" value={formData.referenceId} onChange={handleChange} required className="w-full border rounded-xl p-3">
              <option value="">-- Choose Achievement --</option>
              {achievementsList.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
            </select>
          </div>
        )}

        {/* Product card link — available on every slide, independent of Slide Type */}
        <div className="space-y-2 p-4 rounded-xl bg-green-50 border border-green-100">
          <label className="block text-xs font-bold text-green-800 uppercase">Link to Product (optional)</label>
          <select name="linkedProductId" value={formData.linkedProductId || ""} onChange={handleChange} className="w-full border rounded-xl p-3">
            <option value="">-- None --</option>
            {productsList.map(p => <option key={p._id} value={p._id}>{p.pName}</option>)}
          </select>
          <p className="text-[10px] text-gray-500">Shows a product card (photo, name, price, link) on this slide, regardless of Slide Type.</p>
        </div>

        {/* Scheduling (Only if status is scheduled) */}
        {formData.status === "scheduled" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-orange-50 border border-orange-100">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-orange-800 uppercase">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full border rounded-xl p-3" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-orange-800 uppercase">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full border rounded-xl p-3" />
            </div>
          </div>
        )}

        <hr className="border-t border-gray-100" />

        {/* Content */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#6B3E26]">Slide Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Title</label>
              <input type="text" name="title" value={formData.title || ""} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. Award Winning Nutrition" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Subtitle</label>
              <input type="text" name="subtitle" value={formData.subtitle || ""} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. Best Product 2024" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">Description</label>
            <textarea name="description" value={formData.description || ""} onChange={handleChange} className="w-full border rounded-xl p-3 h-20" />
          </div>
        </div>

        {/* Background + Product Card */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#6B3E26]">Background &amp; Product Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange} className="w-14 h-11 border rounded-lg cursor-pointer" />
                <input type="text" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="#4A2618" />
              </div>
              <p className="text-[10px] text-gray-500">A solid color fill behind the slide content — no background photo needed.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Product Card Image</label>
              <input type="file" accept="image/*" onChange={handleProductImageChange} className="w-full border rounded-xl p-3" />
              {productImage && (
                <img src={URL.createObjectURL(productImage)} alt="Selected preview" className="h-20 w-20 object-contain border rounded-lg bg-gray-50" />
              )}
              {isEditMode && initialData?.productImage && !productImage && imageUrl(initialData.productImage) && (
                <div className="flex items-center gap-2">
                  <img src={imageUrl(initialData.productImage)} alt="Current product card" className="h-20 w-20 object-contain border rounded-lg bg-gray-50" />
                  <span className="text-xs text-gray-500">Current image</span>
                </div>
              )}
              <p className="text-[10px] text-gray-500">Shown on the product card — independent of the linked product's own catalog photo.</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#6B3E26]">Call-To-Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Primary Button Text</label>
              <input type="text" name="primaryButtonText" value={formData.primaryButtonText} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. Shop Now" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Primary Link</label>
              <input type="text" name="primaryButtonLink" value={formData.primaryButtonLink || ""} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. /products/nutrimix" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Secondary Button Text</label>
              <input type="text" name="secondaryButtonText" value={formData.secondaryButtonText || ""} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. Learn More" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Secondary Link</label>
              <input type="text" name="secondaryButtonLink" value={formData.secondaryButtonLink || ""} onChange={handleChange} className="w-full border rounded-xl p-3" />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#6B3E26]">Advanced Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Badge Text</label>
              <input type="text" name="badgeText" value={formData.badgeText} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. Bestseller" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-full border rounded-xl p-3" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Text Alignment</label>
              <select name="textAlignment" value={formData.textAlignment} onChange={handleChange} className="w-full border rounded-xl p-3">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 rounded-xl border" style={{ background: "linear-gradient(to right, #FDF6EC, #fcfcfc)", borderColor: "#E8D5BC" }}>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#AE6837" }}>A/B Test Experiment ID</label>
              <input type="text" name="experimentId" value={formData.experimentId} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. diwali-promo" />
              <p className="text-[10px] text-gray-500">To A/B test, give multiple slides the exact same Experiment ID.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#AE6837" }}>Variant Name</label>
              <input type="text" name="variant" value={formData.variant} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. A" />
              <p className="text-[10px] text-gray-500">Name this variant (e.g. 'A', 'B', 'C') for analytics tracking.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="showOverlayStats" checked={formData.showOverlayStats} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
            <span className="text-sm font-bold text-gray-700">Show Trust Overlay (e.g. 4.84/5 Rating, 30+ Ingredients)</span>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-4" style={{ borderColor: "#E8D5BC" }}>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] disabled:opacity-50 transition-all">
            {loading ? "Saving..." : "Save Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
