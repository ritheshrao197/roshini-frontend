"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VlogCategory, getVlogCategories, Vlog } from "@/lib/api";

export default function EditVlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
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
    tags: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getVlogCategories().then(setCategories);
    fetchVlog();
  }, []);

  const fetchVlog = async () => {
    try {
      // In a real app we'd fetch from admin by ID, for this demo we'll just fetch all and find
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/vlogs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
      });
      if (res.ok) {
        const data = await res.json();
        const vlog = data.vlogs.find((v: any) => v._id === id);
        if (vlog) {
          setFormData({
            title: vlog.title,
            content: vlog.content,
            excerpt: vlog.excerpt,
            vCategory: vlog.vCategory?._id || "",
            thumbnail: vlog.thumbnail || "",
            seoTitle: vlog.seoTitle || "",
            seoDescription: vlog.seoDescription || "",
            featured: vlog.featured || false,
            isPublished: vlog.isPublished || false,
            tags: vlog.vTags ? vlog.vTags.map((t: any) => t.name).join(", ") : ""
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { ...formData, tags: tagsArray };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/vlogs/${id}`, {
        method: "PUT",
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
        alert(error.error || "Failed to update vlog");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading vlog data...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Vlog</h1>
      
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
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>

        <div className="pt-4 border-t flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Update Vlog"}
          </button>
        </div>
      </form>
    </div>
  );
}
