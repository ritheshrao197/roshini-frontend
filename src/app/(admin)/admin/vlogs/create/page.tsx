"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VlogCategory, getVlogCategories } from "@/lib/api";

export default function CreateVlogPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<VlogCategory[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    vCategory: "",
    thumbnail: "",
    seoTitle: "",
    seoDescription: "",
    featured: false,
    isPublished: false,
    tags: "" // comma separated for simplicity
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVlogCategories().then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { ...formData, tags: tagsArray };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/vlogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push("/admin/vlogs");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create vlog");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Vlog</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-lg p-2" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select required name="vCategory" value={formData.vCategory} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.cName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Excerpt *</label>
          <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full border rounded-lg p-2 h-20" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Content (HTML allowed) *</label>
          <textarea required name="content" value={formData.content} onChange={handleChange} className="w-full border rounded-lg p-2 h-48" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="https://..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SEO Title</label>
            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full border rounded-lg p-2" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SEO Description</label>
            <input type="text" name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="w-full border rounded-lg p-2" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Healthy, Sugar Free, Diet" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            <span className="text-sm font-medium text-gray-700">Featured Vlog</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
            <span className="text-sm font-medium text-gray-700">Publish Immediately</span>
          </label>
        </div>

        <div className="pt-4 border-t flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Vlog"}
          </button>
        </div>
      </form>
    </div>
  );
}
