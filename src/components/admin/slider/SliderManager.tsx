import React, { useState, useEffect } from "react";
import SliderForm, { Slider } from "./SliderForm";
import { API_URL } from "@/lib/api";

export default function SliderManager() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [achievementsList, setAchievementsList] = useState<any[]>([]);
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/sliders`, {
        headers: {
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSliders(data.sliders);
      } else {
        setError("Failed to fetch sliders");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceLists = async () => {
    try {
      const [prodRes, achRes] = await Promise.all([
        fetch(`${API_URL}/product/all-product`),
        fetch(`${API_URL}/achievements`)
      ]);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProductsList(prodData.Products || []);
      }
      if (achRes.ok) {
        const achData = await achRes.json();
        setAchievementsList(achData.achievements || []);
      }
    } catch (err) {
      console.error("Failed to fetch reference lists", err);
    }
  };

  useEffect(() => {
    fetchSliders();
    fetchReferenceLists();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider? This will also wipe its analytics.")) return;
    try {
      const res = await fetch(`${API_URL}/admin/sliders/${id}`, {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchSliders();
      } else {
        alert("Failed to delete slider");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  if (showForm) {
    return (
      <SliderForm
        initialData={editingSlider || undefined}
        productsList={productsList}
        achievementsList={achievementsList}
        onSuccess={() => {
          setShowForm(false);
          setEditingSlider(null);
          fetchSliders();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingSlider(null);
        }}
      />
    );
  }

  return (
    <div className="bg-white border rounded-3xl p-6" style={{ borderColor: "#E8D5BC" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Homepage Campaign Slider</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hero banners, view analytics, and schedule marketing campaigns.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 rounded-full font-semibold transition-all hover:opacity-90 flex items-center gap-2"
          style={{ background: "#6B3E26", color: "#F5E9DA" }}
        >
          <span>+ Create Campaign</span>
        </button>
      </div>

      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading sliders...</div>
      ) : sliders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-[#6B3E26]">No active campaigns</h3>
          <p className="text-sm text-gray-500 mb-4">Create your first homepage slider campaign.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-[#FDF6EC] text-[#7A5C45] border-b" style={{ borderColor: "#E8D5BC" }}>
              <tr>
                <th className="px-6 py-3 rounded-tl-xl">Campaign / Content</th>
                <th className="px-6 py-3 text-center">Type</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Analytics (Views/Clicks)</th>
                <th className="px-6 py-3 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((item) => (
                <tr key={item._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#6B3E26] text-base">{item.title || "No Title (Media Only)"}</p>
                    {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === "published" && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Active</span>}
                    {item.status === "draft" && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">Draft</span>}
                    {item.status === "scheduled" && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold uppercase">Scheduled</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold">{item.analytics?.totalImpressions || 0} V</span>
                      <span className="text-xs text-gray-500">{item.analytics?.totalClicks || 0} C</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingSlider(item);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs mx-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="text-red-600 hover:text-red-800 font-medium text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
