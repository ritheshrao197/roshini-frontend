"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

interface Address {
  _id?: string;
  fullName: string;
  mobileNumber: string;
  alternateMobile?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [saving, setSaving] = useState(false);

  const initialFormState: Address = {
    fullName: "",
    mobileNumber: "",
    alternateMobile: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
    type: "Home",
  };
  const [formData, setFormData] = useState<Address>(initialFormState);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/addresses`, {
        headers: { token: token || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (address?: Address) => {
    if (address) {
      setEditId(address._id!);
      setFormData(address);
    } else {
      setEditId(null);
      setFormData(initialFormState);
    }
    setIsFormOpen(true);
    setMessage({ text: "", type: "" });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const url = editId ? `${API_URL}/account/addresses/${editId}` : `${API_URL}/account/addresses`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", token: token || "" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses);
        setMessage({ text: `Address ${editId ? "updated" : "added"} successfully!`, type: "success" });
        setIsFormOpen(false);
      } else {
        setMessage({ text: data.error || "Failed to save address", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/addresses/${id}`, {
        method: "DELETE",
        headers: { token: token || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/addresses/${id}/default`, {
        method: "PUT",
        headers: { token: token || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading addresses...</div>;

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none" +
    " bg-gray-50 border-gray-200 focus:bg-white focus:border-[#6B3E26] focus:shadow-[0_0_0_3px_rgba(107,62,38,0.1)]";

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#6B3E26]" style={{ fontFamily: "'Merriweather', serif" }}>
          Saved Addresses
        </h2>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="px-6 py-2 bg-[#6B3E26] text-[#F5E9DA] rounded-xl font-bold text-sm hover:bg-[#5A3320] transition-colors"
          >
            + Add New Address
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {isFormOpen ? (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">{editId ? "Edit Address" : "Add New Address"}</h3>
            <button onClick={handleCloseForm} className="text-gray-500 hover:text-red-500 text-sm font-bold">Cancel</button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className={inputClass} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City / District</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={inputClass} required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Address Line 1 (Flat, House no., Building, Company)</label>
              <input type="text" value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className={inputClass} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Address Line 2 (Area, Street, Sector, Village) - Optional</label>
              <input type="text" value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Landmark (Optional)</label>
                <input type="text" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={inputClass}>
                  <option value="Home">Home (7 am - 9 pm)</option>
                  <option value="Office">Office (10 am - 6 pm)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 text-[#6B3E26] rounded border-gray-300 focus:ring-[#6B3E26]" />
              <label htmlFor="isDefault" className="text-sm text-gray-700">Make this my default address</label>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={saving} className="px-8 py-3 bg-[#6B3E26] text-[#F5E9DA] rounded-xl font-bold text-sm hover:bg-[#5A3320] transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="text-4xl mb-3 text-gray-300">🏠</div>
              <p className="text-gray-500 font-medium">You haven't saved any addresses yet.</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address._id} className={`p-6 rounded-xl border transition-all ${address.isDefault ? "border-[#6B3E26] bg-[#FDF6EC]/30 shadow-sm" : "border-gray-200 bg-white"}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{address.fullName}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{address.type}</span>
                  </div>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-[#6B3E26] text-[#F5E9DA] text-[10px] font-bold rounded-full">Default</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  {address.landmark && <p>Landmark: {address.landmark}</p>}
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p>{address.country}</p>
                  <p className="pt-2 font-medium">Phone number: {address.mobileNumber}</p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button onClick={() => handleOpenForm(address)} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(address._id!)} className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors">Remove</button>
                  {!address.isDefault && (
                    <button onClick={() => handleSetDefault(address._id!)} className="text-sm font-bold text-gray-500 hover:text-[#6B3E26] ml-auto transition-colors">Set as Default</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
