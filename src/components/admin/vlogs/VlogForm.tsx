import React, { useState, useEffect } from "react";
import { VlogCategory } from "@/lib/api";

interface VlogFormProps {
  initialVlog?: any;
  categoriesList: VlogCategory[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VlogForm({
  initialVlog,
  categoriesList,
  onSuccess,
  onCancel,
}: VlogFormProps) {
  const isEditMode = !!initialVlog;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    vCategory: "",
    thumbnail: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
    ogImage: "",
    featured: false,
    isPublished: false,
    status: "Draft",
    scheduledPublishDate: "",
    tags: ""
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [retainedGallery, setRetainedGallery] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Fetch all products to allow linking them
    fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/product/all-product`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data.Products || []);
      })
      .catch(err => console.error("Error loading products for linking:", err));
  }, []);

  useEffect(() => {
    if (initialVlog) {
      setFormData({
        title: initialVlog.title || "",
        content: initialVlog.content || "",
        excerpt: initialVlog.excerpt || "",
        vCategory: initialVlog.vCategory?._id || initialVlog.vCategory || "",
        thumbnail: initialVlog.thumbnail || "",
        seoTitle: initialVlog.seoTitle || "",
        seoDescription: initialVlog.seoDescription || "",
        seoKeywords: initialVlog.seoKeywords ? initialVlog.seoKeywords.join(", ") : "",
        canonicalUrl: initialVlog.canonicalUrl || "",
        ogImage: initialVlog.ogImage || "",
        featured: initialVlog.featured || false,
        isPublished: initialVlog.isPublished || false,
        status: initialVlog.status || (initialVlog.isPublished ? "Published" : "Draft"),
        scheduledPublishDate: initialVlog.scheduledPublishDate 
          ? new Date(initialVlog.scheduledPublishDate).toISOString().slice(0, 16) 
          : "",
        tags: initialVlog.vTags ? initialVlog.vTags.map((t: any) => t.name).join(", ") : ""
      });
      setSelectedProducts(initialVlog.relatedProducts ? initialVlog.relatedProducts.map((p: any) => typeof p === 'string' ? p : p._id) : []);
      setRetainedGallery(initialVlog.gallery || []);
    }
  }, [initialVlog]);

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
    setFormError("");

    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("excerpt", formData.excerpt);
      payload.append("vCategory", formData.vCategory);
      payload.append("seoTitle", formData.seoTitle);
      payload.append("seoDescription", formData.seoDescription);
      payload.append("featured", String(formData.featured));
      payload.append("isPublished", String(formData.status === "Published"));
      payload.append("status", formData.status);
      payload.append("scheduledPublishDate", formData.scheduledPublishDate);
      payload.append("canonicalUrl", formData.canonicalUrl);
      payload.append("ogImage", formData.ogImage);
      payload.append("tags", JSON.stringify(tagsArray));
      payload.append("relatedProducts", JSON.stringify(selectedProducts));
      payload.append("currentGallery", JSON.stringify(retainedGallery));

      const keywordsArray = formData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
      payload.append("seoKeywords", JSON.stringify(keywordsArray));

      if (thumbnailFile) {
        payload.append("thumbnail", thumbnailFile);
      } else {
        payload.append("thumbnail", formData.thumbnail);
      }

      if (galleryFiles && galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          payload.append("gallery", galleryFiles[i]);
        }
      }

      const url = isEditMode 
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/vlogs/${initialVlog._id}`
        : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/vlogs`;
      
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "token": localStorage.getItem('token') || ""
        },
        credentials: "include",
        body: payload
      });

      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        setFormError(error.error || "Failed to save blog");
      }
    } catch (err) {
      console.error(err);
      setFormError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">
          {isEditMode ? "Edit Blog" : "Create New Blog"}
        </h2>
        <button onClick={onCancel} className="px-4 py-2 border rounded-full hover:bg-gray-50 text-xs font-bold">
          Cancel
        </button>
      </div>

      {formError && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 col-span-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Category *</label>
            <select required name="vCategory" value={formData.vCategory} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]">
              <option value="">Select a category</option>
              {categoriesList.map(c => (
                <option key={c._id} value={c._id}>{c.cName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Scheduled Publish Date</label>
            <input type="datetime-local" name="scheduledPublishDate" value={formData.scheduledPublishDate} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#7A5C45] uppercase">Excerpt *</label>
          <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full border rounded-xl p-3 h-20 focus:outline-none focus:border-[#6B3E26]" />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#7A5C45] uppercase">Content (HTML allowed) *</label>
          <textarea required name="content" value={formData.content} onChange={handleChange} className="w-full border rounded-xl p-3 h-48 font-mono text-sm focus:outline-none focus:border-[#6B3E26]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Thumbnail Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setThumbnailFile(e.target.files[0]);
                }
              }} 
              className="w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#6B3E26] text-sm bg-white" 
            />
            {formData.thumbnail && !thumbnailFile && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <img 
                  src={formData.thumbnail.startsWith("http") ? formData.thumbnail : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/uploads/vlogs/${formData.thumbnail}`} 
                  alt="Current thumbnail" 
                  className="w-10 h-10 object-cover rounded-md border" 
                />
                <span>Current thumbnail uploaded</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Gallery Images</label>
            <input 
              type="file" 
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setGalleryFiles(Array.from(e.target.files));
                }
              }} 
              className="w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#6B3E26] text-sm bg-white" 
            />
            {retainedGallery.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {retainedGallery.map((img, i) => (
                  <div key={i} className="relative group border rounded-lg overflow-hidden h-12 w-12">
                    <img src={img.secureUrl.startsWith("http") ? img.secureUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/uploads/vlogs/${img.secureUrl}`} alt={img.alt || ""} className="object-cover h-full w-full" />
                    <button 
                      type="button" 
                      onClick={() => setRetainedGallery(retainedGallery.filter((_, idx) => idx !== i))} 
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-[8px] leading-none hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">SEO Title</label>
            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">SEO Description</label>
            <input type="text" name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">SEO Keywords (comma separated)</label>
            <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="millet, organic" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Canonical URL</label>
            <input type="text" name="canonicalUrl" value={formData.canonicalUrl} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Open Graph (OG) Image URL</label>
            <input type="text" name="ogImage" value={formData.ogImage} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="https://..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Tags (comma separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#6B3E26]" placeholder="Healthy, Sugar Free, Diet" />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#7A5C45] uppercase">Linked Roshini Products</label>
            <div className="border rounded-xl p-3 max-h-36 overflow-y-auto space-y-2 bg-white">
              {allProducts.map(prod => (
                <label key={prod._id} className="flex items-center gap-2 text-sm text-[#6B3E26] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.includes(prod._id)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, prod._id]);
                      } else {
                        setSelectedProducts(selectedProducts.filter(id => id !== prod._id));
                      }
                    }} 
                  />
                  <span>{prod.pName}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6 border-t pt-4" style={{ borderColor: "#E8D5BC" }}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4" />
            <span className="text-sm font-bold text-[#6B3E26]">Featured Blog</span>
          </label>
        </div>

        <div className="pt-4 border-t flex justify-end gap-4" style={{ borderColor: "#E8D5BC" }}>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] disabled:opacity-50 transition-all">
            {loading ? "Saving..." : (isEditMode ? "Update Blog" : "Save Blog")}
          </button>
        </div>
      </form>
    </div>
  );
}
