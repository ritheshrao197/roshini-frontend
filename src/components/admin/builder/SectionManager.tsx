import React, { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

interface WebsiteSection {
  _id: string;
  sectionId: string;
  name: string;
  isVisible: boolean;
  displayOrder: number;
}

export default function SectionManager() {
  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/sections`, {
        headers: {
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
      } else {
        setError("Failed to fetch sections");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    
    // Update displayOrder based on new positions
    newSections.forEach((sec, i) => sec.displayOrder = i + 1);
    setSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    
    // Update displayOrder based on new positions
    newSections.forEach((sec, i) => sec.displayOrder = i + 1);
    setSections(newSections);
  };

  const handleToggleVisibility = (index: number) => {
    const newSections = [...sections];
    newSections[index].isVisible = !newSections[index].isVisible;
    setSections(newSections);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/admin/sections`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        credentials: "include",
        body: JSON.stringify({ sections })
      });
      if (res.ok) {
        setSuccess("Layout updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to save layout");
      }
    } catch (err) {
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading website layout...</div>;
  }

  return (
    <div className="bg-white border rounded-3xl p-6" style={{ borderColor: "#E8D5BC" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Website Builder</h2>
          <p className="text-sm text-gray-500 mt-1">Reorder and toggle homepage sections directly.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-sm font-bold rounded-full hover:bg-[#4e2c18] disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl mb-4">{success}</div>}

      <div className="space-y-3 bg-[#FDF6EC] p-6 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
        {/* Fake Header for context */}
        <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 opacity-60 flex justify-center items-center h-12">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Header (Fixed)</span>
        </div>

        {sections.map((section, index) => (
          <div 
            key={section._id} 
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border transition-all"
            style={{ borderColor: section.isVisible ? "#E8D5BC" : "#e5e7eb", opacity: section.isVisible ? 1 : 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => handleMoveUp(index)} 
                  disabled={index === 0}
                  className="w-8 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                >
                  ▲
                </button>
                <button 
                  onClick={() => handleMoveDown(index)} 
                  disabled={index === sections.length - 1}
                  className="w-8 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                >
                  ▼
                </button>
              </div>
              <div>
                <div className="font-bold text-[#6B3E26]">{section.name}</div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">ID: {section.sectionId}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold uppercase ${section.isVisible ? 'text-green-600' : 'text-gray-400'}`}>
                {section.isVisible ? 'Visible' : 'Hidden'}
              </span>
              <button 
                onClick={() => handleToggleVisibility(index)}
                className={`w-12 h-6 rounded-full relative transition-colors ${section.isVisible ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${section.isVisible ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        ))}

        {/* Fake Footer for context */}
        <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 opacity-60 flex justify-center items-center h-12">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Footer (Fixed)</span>
        </div>
      </div>
    </div>
  );
}
