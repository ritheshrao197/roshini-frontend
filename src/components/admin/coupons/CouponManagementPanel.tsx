"use client";

import React, { useState, useEffect } from "react";

import { API_URL } from "@/lib/api";

type Coupon = {
  _id: string;
  code: string;
  description: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  firstOrderOnly: boolean;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  isStackable: boolean;
};

export default function CouponManagementPanel() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [formData, setFormData] = useState<Partial<Coupon>>({
    type: "percentage",
    isActive: true,
    firstOrderOnly: false,
    isStackable: false,
    perUserLimit: 1,
    priority: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 30 days from now
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/coupons`, {
        headers: {
          token: localStorage.getItem("token") || ""
        }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon: Coupon | null = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        ...coupon,
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
        endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        description: "",
        type: "percentage",
        value: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        usageLimit: 0,
        perUserLimit: 1,
        firstOrderOnly: false,
        isActive: true,
        priority: 0,
        isStackable: false,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingCoupon 
        ? `${API_URL}/admin/coupon/${editingCoupon._id}` 
        : `${API_URL}/admin/coupon`;
      
      const res = await fetch(endpoint, {
        method: editingCoupon ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || ""
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/coupon/${id}`, {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token") || ""
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupons Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          + Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading coupons...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uses / Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{c.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{c.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? `₹${c.value}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.usedCount} / {c.usageLimit || "∞"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(c.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleOpenModal(c)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">No coupons found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code</label>
                  <input type="text" required value={formData.code || ""} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select value={formData.type || "percentage"} onChange={e => setFormData({...formData, type: e.target.value})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="shipping">Free Shipping</option>
                    <option value="tiered">Tiered (Buy More Save More)</option>
                  </select>
                </div>
                
                {formData.type !== "shipping" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value {formData.type === "percentage" ? "(%)" : "(₹)"}</label>
                    <input type="number" value={formData.value || 0} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Order Amount (₹)</label>
                  <input type="number" value={formData.minOrderAmount || 0} onChange={e => setFormData({...formData, minOrderAmount: Number(e.target.value)})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                </div>

                {formData.type === "percentage" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Discount (₹) [0 for unlimited]</label>
                    <input type="number" value={formData.maxDiscount || 0} onChange={e => setFormData({...formData, maxDiscount: Number(e.target.value)})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Global Usage Limit (0 for unlimited)</label>
                  <input type="number" value={formData.usageLimit || 0} onChange={e => setFormData({...formData, usageLimit: Number(e.target.value)})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Per User Limit</label>
                  <input type="number" value={formData.perUserLimit || 1} onChange={e => setFormData({...formData, perUserLimit: Number(e.target.value)})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" value={formData.startDate as string} onChange={e => setFormData({...formData, startDate: e.target.value})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" required value={formData.endDate as string} onChange={e => setFormData({...formData, endDate: e.target.value})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded border-gray-300 text-indigo-600 shadow-sm mr-2" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.firstOrderOnly} onChange={e => setFormData({...formData, firstOrderOnly: e.target.checked})} className="rounded border-gray-300 text-indigo-600 shadow-sm mr-2" />
                  <span className="text-sm font-medium text-gray-700">First Order Only</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description / Terms</label>
                <textarea rows={2} value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" placeholder="Internal notes or terms..."></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
