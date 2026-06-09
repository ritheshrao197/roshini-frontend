import React, { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export interface Slider {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  desktopImage?: string;
  mobileImage?: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  type: string;
  referenceId: string;
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
    badgeText: "",
    badgeColor: "#E6A817",
    showOverlayStats: false,
    animationType: "fade",
    textAlignment: "left",
    status: "published",
    experimentId: "",
    variant: "",
    displayOrder: 0,
  });

  const [desktopImage, setDesktopImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
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
        badgeText: initialData.badgeText || "",
        badgeColor: initialData.badgeColor || "#E6A817",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isDesktop: boolean) => {
    if (e.target.files && e.target.files[0]) {
      if (isDesktop) setDesktopImage(e.target.files[0]);
      else setMobileImage(e.target.files[0]);
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

      if (desktopImage) submitData.append("desktopImage", desktopImage);
      if (mobileImage) submitData.append("mobileImage", mobileImage);

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

        {/* Images */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#6B3E26]">Media Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Desktop Image *</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} className="w-full border rounded-xl p-3" />
              {isEditMode && initialData?.desktopImage && !desktopImage && <p className="text-xs text-gray-500">Current: {initialData.desktopImage}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Mobile Image (Optional Fallback)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, false)} className="w-full border rounded-xl p-3" />
              {isEditMode && initialData?.mobileImage && !mobileImage && <p className="text-xs text-gray-500">Current: {initialData.mobileImage}</p>}
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
              <label className="block text-xs font-bold text-[#E6A817] uppercase tracking-wider">A/B Test Experiment ID</label>
              <input type="text" name="experimentId" value={formData.experimentId} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="e.g. diwali-promo" />
              <p className="text-[10px] text-gray-500">To A/B test, give multiple slides the exact same Experiment ID.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#E6A817] uppercase tracking-wider">Variant Name</label>
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
