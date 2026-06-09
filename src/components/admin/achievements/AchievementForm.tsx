import React, { useState, useEffect } from "react";

export interface Achievement {
  _id?: string;
  title: string;
  subtitle: string;
  type: string;
  icon: string;
  value?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

interface Props {
  initialData?: Achievement;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AchievementForm({ initialData, onSuccess, onCancel }: Props) {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState<Achievement>({
    title: "",
    subtitle: "",
    type: "Award",
    icon: "🏆",
    value: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/achievements/${initialData?._id}`
        : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/achievements`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save achievement");
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
          {isEditMode ? "Edit Achievement" : "Add Achievement"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="e.g. Best Product" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Subtitle *</label>
            <input required type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="e.g. National Saras Mela 2024" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Type *</label>
            <select required name="type" value={formData.type} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]">
              <option value="Award">Award</option>
              <option value="Certification">Certification</option>
              <option value="Media">Media Mention</option>
              <option value="Statistic">Statistic / Counter</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Icon (Emoji) *</label>
            <input required type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="e.g. 🏆" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Value / Counter (Optional)</label>
            <input type="text" name="value" value={formData.value} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="e.g. 4.84/5 or 30+" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Display Order</label>
            <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#7A5C45] uppercase">Description (Optional)</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded-xl p-3 h-20 focus:outline-none focus:border-[#6B3E26]" />
        </div>

        <div className="flex items-center gap-2 border-t pt-4" style={{ borderColor: "#E8D5BC" }}>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
          <span className="text-sm font-bold text-[#6B3E26]">Active (Visible on Website)</span>
        </div>

        <div className="pt-4 border-t flex justify-end gap-4" style={{ borderColor: "#E8D5BC" }}>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] disabled:opacity-50 transition-all">
            {loading ? "Saving..." : "Save Achievement"}
          </button>
        </div>
      </form>
    </div>
  );
}
