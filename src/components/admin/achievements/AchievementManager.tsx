import React, { useState, useEffect } from "react";
import AchievementForm, { Achievement } from "./AchievementForm";

export default function AchievementManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/achievements`, {
        headers: {
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAchievements(data.achievements);
      } else {
        setError("Failed to fetch achievements");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/achievements/${id}`, {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchAchievements();
      } else {
        alert("Failed to delete achievement");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  if (showForm) {
    return (
      <AchievementForm
        initialData={editingAchievement || undefined}
        onSuccess={() => {
          setShowForm(false);
          setEditingAchievement(null);
          fetchAchievements();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingAchievement(null);
        }}
      />
    );
  }

  return (
    <div className="bg-white border rounded-3xl p-6" style={{ borderColor: "#E8D5BC" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Achievements & Recognition</h2>
          <p className="text-sm text-gray-500 mt-1">Manage awards, stats, and recognition displayed on the homepage.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 rounded-full font-semibold transition-all hover:opacity-90 flex items-center gap-2"
          style={{ background: "#6B3E26", color: "#F5E9DA" }}
        >
          <span>+ Add New</span>
        </button>
      </div>

      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading achievements...</div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-[#6B3E26]">No achievements found</h3>
          <p className="text-sm text-gray-500 mb-4">Start by adding your first award or statistic.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-[#FDF6EC] text-[#7A5C45] border-b" style={{ borderColor: "#E8D5BC" }}>
              <tr>
                <th className="px-6 py-3 rounded-tl-xl">Icon & Title</th>
                <th className="px-6 py-3">Subtitle / Value</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((item) => (
                <tr key={item._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.value ? <span className="font-bold text-[#6B3E26] mr-2">{item.value}</span> : null}
                    {item.subtitle}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{item.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {item.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingAchievement(item);
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
