"use client";

import React, { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

interface CloudinaryResource {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
}

export default function MediaManagementPanel() {
  const [resources, setResources] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/admin/media`, {
        headers: { token },
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setResources(json.resources || []);
      } else {
        setError(json.error || "Failed to load media.");
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (public_id: string) => {
    if (!confirm("Are you sure you want to delete this asset from Cloudinary?")) return;
    setDeletingId(public_id);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/admin/media/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        credentials: "include",
        body: JSON.stringify({ public_id }),
      });
      const json = await res.json();
      if (json.success) {
        setResources(resources.filter((r) => r.public_id !== public_id));
      } else {
        alert(json.error || "Failed to delete media.");
      }
    } catch (err) {
      alert("Failed to connect to backend server.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return <div className="text-center py-10 text-sm text-[#7A5C45]">Loading media assets...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Media Management (Cloudinary)</h2>
        <button
          onClick={fetchMedia}
          className="px-4 py-2 bg-[#6B3E26] text-[#F5E9DA] text-xs font-semibold rounded-full hover:bg-[#4e2c18] transition-all"
        >
          Refresh Media
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {resources.map((resource) => (
          <div key={resource.public_id} className="border border-[#E8D5BC] rounded-xl overflow-hidden bg-[#FFFDF9] relative group">
            <div className="aspect-square bg-gray-100">
              <img
                src={resource.secure_url}
                alt={resource.public_id}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-[10px] font-bold text-[#6B3E26] truncate" title={resource.public_id}>
                {resource.public_id}
              </p>
              <p className="text-[10px] text-[#7A5C45] mt-1">
                {formatBytes(resource.bytes)} • {resource.format.toUpperCase()}
              </p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDelete(resource.public_id)}
                disabled={deletingId === resource.public_id}
                className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 shadow-lg disabled:bg-red-400"
                title="Delete Asset"
              >
                {deletingId === resource.public_id ? "..." : "✕"}
              </button>
            </div>
          </div>
        ))}
        {resources.length === 0 && (
          <div className="col-span-full text-center py-10 text-sm text-[#7A5C45]">No media assets found on Cloudinary.</div>
        )}
      </div>
    </div>
  );
}
