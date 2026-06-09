"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductForm from "@/components/admin/product/ProductForm";
import VlogForm from "@/components/admin/vlogs/VlogForm";
import AchievementManager from "@/components/admin/achievements/AchievementManager";
import SliderManager from "@/components/admin/slider/SliderManager";
import { API_URL, BACKEND_URL } from "@/lib/api";

interface Product {
  _id: string;
  pName: string;
  pPrice: number;
  pQuantity: number;
  pStatus: string;
}

interface Category {
  _id: string;
  cName: string;
  cDescription: string;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  allProduct: Array<{
    id: {
      _id: string;
      pName: string;
      pImages: string[];
      pPrice: number;
    };
    quantitiy: number;
  }>;
  amount: number;
  status: string;
  paymentStatus: string;
  paymentGateway: string;
  transactionId: string;
  shipmentTrackingId?: string;
  refundStatus: string;
  address: string;
  phone: string;
  createdAt: string;
}

interface AnalyticsData {
  revenue: number;
  ordersCount: number;
  lowStockAlerts: number;
  lowStockProducts: Array<{
    _id: string;
    pName: string;
    pQuantity: number;
    pPrice: number;
  }>;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders" | "settings" | "vlogs" | "vlogCategories" | "achievements" | "sliders">("overview");
  
  // Vlog states
  const [vlogs, setVlogs] = useState<any[]>([]);
  const [vlogCategories, setVlogCategories] = useState<any[]>([]);
  const [editingVlog, setEditingVlog] = useState<any | null>(null);
  const [showVlogForm, setShowVlogForm] = useState(false);
  const [vCatName, setVCatName] = useState("");
  const [vCatDesc, setVCatDesc] = useState("");
  
  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  // Catalog Lists
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Product Form states
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Payment configuration management states
  const [phonePeEnabled, setPhonePeEnabled] = useState(true);
  const [payUEnabled, setPayUEnabled] = useState(true);
  const [savingPayment, setSavingPayment] = useState(false);

  // Admin Order Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerTrackingId, setDrawerTrackingId] = useState("");
  const [drawerPaymentStatus, setDrawerPaymentStatus] = useState("");
  const [drawerStatus, setDrawerStatus] = useState("");
  const [drawerSaving, setDrawerSaving] = useState(false);
  const [drawerMsg, setDrawerMsg] = useState("");
  
  const [cName, setCName] = useState("");
  const [cDescription, setCDescription] = useState("");
  const [cImage, setCImage] = useState<File | null>(null);

  // Action status
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // 1. Fetch Analytics Overview
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API_URL}/admin/analytics`, { credentials: "include" });
        const json = await res.json();
        if (json.error) {
          setAnalyticsError(json.error);
        } else {
          setAnalytics(json);
        }
      } catch (err) {
        setAnalyticsError("Failed to connect to backend server.");
      } finally {
        setLoadingAnalytics(false);
      }
    }
    fetchAnalytics();
  }, []);

  // 2. Fetch Dynamic Catalog Lists
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/product/all-product`);
      const json = await res.json();
      setProducts(json.Products || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/category/all-category`);
      const json = await res.json();
      setCategories(json.Categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/order/get-all-orders`);
      const json = await res.json();
      setOrders(json.Orders || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/vlogs`, { headers: { 'token': localStorage.getItem('token') || "" }, credentials: "include" });
      const json = await res.json();
      setVlogs(json.vlogs || []);
    } catch (e) { console.error(e); }
  };

  const fetchVlogCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/vlog-categories`);
      const json = await res.json();
      setVlogCategories(json.Categories || []);
    } catch (e) { console.error(e); }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/customize/payment-settings`);
      const json = await res.json();
      setPhonePeEnabled(json.phonePeEnabled !== false);
      setPayUEnabled(json.payUEnabled !== false);
    } catch (e) {
      console.error("Failed to load payment settings.");
    }
  };

  const handleSavePaymentSettings = async () => {
    setSavingPayment(true);
    setFormSuccess("");
    setFormError("");
    try {
      const res = await fetch(`${API_URL}/customize/update-payment-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phonePeEnabled, payUEnabled }),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess("Payment settings saved successfully!");
      } else {
        setFormError(data.error || "Failed to update payment settings.");
      }
    } catch (err) {
      setFormError("Failed to connect to backend server.");
    } finally {
      setSavingPayment(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
      fetchCategories();
    }
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "settings") fetchPaymentSettings();
    if (activeTab === "vlogs") {
      fetchVlogs();
      fetchVlogCategories();
    }
    if (activeTab === "vlogCategories") fetchVlogCategories();
  }, [activeTab]);

  // 3. CRUD: Modular Product Form Handling (Coordinated inside ProductForm component)

  // 4. CRUD: Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");

    if (!cImage) {
      setFormError("Category image file is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cName", cName);
      formData.append("cDescription", cDescription);
      formData.append("cStatus", "Active");
      formData.append("cImage", cImage);

      const res = await fetch(`${API_URL}/category/add-category`, {
        method: "POST",
        headers: { 
          "token": localStorage.getItem("token") || ""
        },
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setFormError(data.error);
      } else {
        setFormSuccess("Category created successfully!");
        fetchCategories();
        setCName("");
        setCDescription("");
        setCImage(null);
      }
    } catch (err) {
      setFormError("Failed to add category.");
    }
  };

  // Vlog Category Add
  const handleAddVlogCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");
    try {
      const res = await fetch(`${API_URL}/admin/vlog-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": localStorage.getItem('token') || "" },
        credentials: "include",
        body: JSON.stringify({ cName: vCatName, cDescription: vCatDesc, cStatus: "Active" }),
      });
      const data = await res.json();
      if (data.error) setFormError(data.error);
      else {
        setFormSuccess("Vlog Category created successfully!");
        fetchVlogCategories();
        setVCatName("");
        setVCatDesc("");
      }
    } catch (err) { setFormError("Failed to add vlog category."); }
  };

  const handleVlogPublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      const action = currentStatus ? "unpublish" : "publish";
      const res = await fetch(`${API_URL}/admin/vlogs/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') || "" },
        credentials: "include",
        body: JSON.stringify({ action })
      });
      if (res.ok) fetchVlogs();
    } catch (err) { console.error(err); }
  };

  // 5. Admin: comprehensive order update (status + payment status + tracking + refund)
  const handleAdminOrderUpdate = async (fields: {
    status?: string;
    paymentStatus?: string;
    shipmentTrackingId?: string;
    refundStatus?: string;
  }) => {
    if (!selectedOrder) return;
    setDrawerSaving(true);
    setDrawerMsg("");
    try {
      const res = await fetch(`${API_URL}/order/admin-update-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oId: selectedOrder._id, ...fields }),
      });
      const data = await res.json();
      if (data.success) {
        setDrawerMsg("✅ Order updated successfully!");
        fetchOrders();
        // Update local selected order too
        if (data.order) {
          setSelectedOrder(prev => prev ? { ...prev, ...data.order } : null);
        }
      } else {
        setDrawerMsg("❌ " + (data.error || "Update failed."));
      }
    } catch (err) {
      setDrawerMsg("❌ Failed to connect.");
    } finally {
      setDrawerSaving(false);
    }
  };

  const openOrderDrawer = (order: Order) => {
    setSelectedOrder(order);
    setDrawerTrackingId(order.shipmentTrackingId || "");
    setDrawerPaymentStatus(order.paymentStatus || "Pending");
    setDrawerStatus(order.status || "Not processed");
    setDrawerMsg("");
  };

  // Old simple update kept for backward compat
  const handleUpdateOrderStatus = async (oId: string, status: string) => {
    try {
      await fetch(`${API_URL}/order/update-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oId, status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C1A0E] flex flex-col font-sans">
      {/* Header */}
      <header className="border-b sticky top-0 bg-[#FFFDF9]/80 backdrop-blur-md z-50" style={{ borderColor: "#E8D5BC" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#6B3E26] font-serif">
            Roshini's <span className="font-sans text-lg font-light" style={{ color: "#7A5C45" }}>Admin</span>
          </Link>
          <Link href="/" className="text-xs uppercase font-bold tracking-widest text-[#6B3E26] hover:underline flex items-center gap-1">
            <span>👁️</span> View Storefront
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 space-y-4">
          <div className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-3" style={{ borderColor: "#E8D5BC" }}>
            <h3 className="font-serif font-bold text-[#6B3E26] text-lg">Admin Control</h3>
            <div className="flex flex-col gap-1.5 pt-2">
              <button 
                onClick={() => setActiveTab("overview")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "overview" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                📊 Dashboard Overview
              </button>
              <button 
                onClick={() => setActiveTab("products")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "products" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                📦 Products Manager
              </button>
              <button 
                onClick={() => setActiveTab("categories")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "categories" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                🍃 Categories Manager
              </button>
              <button 
                onClick={() => setActiveTab("orders")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "orders" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                🛒 Orders Manager
              </button>
              <button 
                onClick={() => setActiveTab("settings")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "settings" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                ⚙️ Payment Settings
              </button>
              <button 
                onClick={() => setActiveTab("vlogs")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "vlogs" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                📝 Blogs Manager
              </button>
              <button 
                onClick={() => setActiveTab("vlogCategories")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "vlogCategories" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                🏷️ Blog Categories
              </button>
              <button 
                onClick={() => setActiveTab("achievements")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "achievements" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                🏆 Achievements
              </button>
              <button 
                onClick={() => setActiveTab("sliders")} 
                className={`text-left text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                  activeTab === "sliders" 
                    ? "bg-[#6B3E26] text-[#F5E9DA] font-semibold shadow-sm" 
                    : "text-[#7A5C45] hover:bg-[#F5E9DA] hover:text-[#6B3E26]"
                }`}
              >
                🖼️ Homepage Slider
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Panels */}
        <main className="flex-1 space-y-6">
          {formSuccess && (
            <div className="bg-green-50 text-green-600 text-sm p-4 rounded-xl border border-green-100">
              {formSuccess}
            </div>
          )}
          {formError && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
              {formError}
            </div>
          )}

          {/* SLIDERS PANEL */}
          {activeTab === "sliders" && (
            <SliderManager />
          )}

          {/* ACHIEVEMENTS PANEL */}
          {activeTab === "achievements" && (
            <AchievementManager />
          )}

          {/* 1. OVERVIEW PANEL */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Overview Analytics</h2>
              
              {loadingAnalytics ? (
                <div className="text-sm py-10 text-center text-[#7A5C45]">Loading aggregates...</div>
              ) : analyticsError ? (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">{analyticsError}</div>
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#FDF6EC] border p-6 rounded-3xl" style={{ borderColor: "#E8D5BC" }}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A5C45]">Gross Turnover</span>
                      <p className="text-3xl font-serif font-bold text-[#6B3E26] mt-1">₹{analytics.revenue}</p>
                    </div>
                    <div className="bg-[#FDF6EC] border p-6 rounded-3xl" style={{ borderColor: "#E8D5BC" }}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A5C45]">Total Sales count</span>
                      <p className="text-3xl font-serif font-bold text-[#6B3E26] mt-1">{analytics.ordersCount}</p>
                    </div>
                    <div className="bg-[#FDF6EC] border p-6 rounded-3xl" style={{ borderColor: "#E8D5BC" }}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A5C45]">Stock Alerts</span>
                      <p className="text-3xl font-serif font-bold text-[#6B3E26] mt-1">{analytics.lowStockAlerts}</p>
                    </div>
                  </div>

                  {analytics.lowStockProducts && analytics.lowStockProducts.length > 0 && (
                    <div className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
                      <div>
                        <h3 className="font-serif font-bold text-[#B23A2A] text-lg flex items-center gap-2">
                          ⚠️ Low Stock Alerts
                        </h3>
                        <p className="text-xs text-[#7A5C45]">The following products have fewer than 10 units in stock and need replenishment.</p>
                      </div>
                      <div className="overflow-hidden rounded-2xl border bg-[#FFFDF9]" style={{ borderColor: "#E8D5BC" }}>
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                              <th className="px-4 py-3">Product Name</th>
                              <th className="px-4 py-3 text-right">Price</th>
                              <th className="px-4 py-3 text-right">Stock Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.lowStockProducts.map((p) => (
                              <tr key={p._id} className="border-b last:border-0 hover:bg-[#F5E9DA]/40 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                                <td className="px-4 py-3 font-semibold text-[#6B3E26]">{p.pName}</td>
                                <td className="px-4 py-3 text-right">₹{p.pPrice}</td>
                                <td className="px-4 py-3 text-right font-bold text-[#B23A2A]">
                                  {p.pQuantity} units remaining
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#FDF6EC] border p-6 rounded-3xl flex items-center justify-between" style={{ borderColor: "#E8D5BC" }}>
                    <div>
                      <h3 className="font-serif font-bold text-[#6B3E26]">Financial Exports</h3>
                      <p className="text-xs text-[#7A5C45]">Download sales database entries as CSV sheets.</p>
                    </div>
                    <a href={`${API_URL}/admin/orders/export`} className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-semibold rounded-full hover:bg-[#4e2c18] transition-all">
                      Export CSV
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* 2. PRODUCTS PANEL */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {showProductForm ? (
                <ProductForm
                  initialProduct={editingProduct}
                  categoriesList={categories}
                  allProductsList={products.map(p => ({ _id: p._id, pName: p.pName }))}
                  onSuccess={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    fetchProducts();
                  }}
                  onCancel={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Products Catalog</h2>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setShowProductForm(true);
                      }}
                      className="px-5 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-semibold rounded-full hover:bg-[#4e2c18] transition-all cursor-pointer"
                    >
                      + Add Product
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                          <th className="px-6 py-3">Product Name</th>
                          <th className="px-6 py-3 text-right">Price</th>
                          <th className="px-6 py-3 text-right">Stock</th>
                          <th className="px-6 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr
                            key={p._id}
                            onClick={() => {
                              setEditingProduct(p);
                              setShowProductForm(true);
                            }}
                            className="border-b hover:bg-[#F5E9DA]/40 cursor-pointer transition-colors"
                            style={{ borderColor: "#E8D5BC" }}
                          >
                            <td className="px-6 py-4 font-semibold text-[#6B3E26]">{p.pName}</td>
                            <td className="px-6 py-4 text-right">₹{p.pPrice}</td>
                            <td className="px-6 py-4 text-right">{p.pQuantity} units</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.pStatus === "Active" ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}>
                                {p.pStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. CATEGORIES PANEL */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Categories Manager</h2>
              
              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
                <h3 className="font-serif font-bold text-[#6B3E26] text-lg">Add New Category</h3>
                <div className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="Category Name" 
                    value={cName} 
                    onChange={e => setCName(e.target.value)} 
                    required 
                    className="px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26]"
                    style={{ borderColor: "#E8D5BC" }}
                  />
                  <textarea 
                    placeholder="Category Description" 
                    value={cDescription} 
                    onChange={e => setCDescription(e.target.value)} 
                    required 
                    className="px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26]"
                    style={{ borderColor: "#E8D5BC" }}
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#7A5C45] uppercase tracking-wider block">Category Image</label>
                    <input 
                      type="file" 
                      onChange={e => setCImage(e.target.files ? e.target.files[0] : null)}
                      required 
                      className="px-4 py-2 rounded-xl border bg-white text-xs w-full focus:outline-none focus:border-[#6B3E26]"
                      style={{ borderColor: "#E8D5BC" }}
                    />
                  </div>
                </div>
                <button type="submit" className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] cursor-pointer transition-all">
                  Create Category
                </button>
              </form>

              {/* Categories Table */}
              <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                      <th className="px-6 py-3">Category Name</th>
                      <th className="px-6 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c._id} className="border-b hover:bg-[#F5E9DA]/20" style={{ borderColor: "#E8D5BC" }}>
                        <td className="px-6 py-4 font-semibold text-[#6B3E26]">{c.cName}</td>
                        <td className="px-6 py-4 text-[#2C1A0E]/80">{c.cDescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ORDERS PANEL */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Orders Management</h2>
                <span className="text-xs text-[#7A5C45] bg-[#FDF6EC] border px-4 py-1.5 rounded-full" style={{ borderColor: "#E8D5BC" }}>{orders.length} total orders</span>
              </div>

              {/* Orders Summary Table */}
              <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                      <th className="px-5 py-3">Order</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3">Fulfillment</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-[#7A5C45]">No orders yet.</td></tr>
                    ) : orders.map(o => {
                      const payBadge: Record<string, string> = {
                        Paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
                        Pending: "bg-amber-50 text-amber-700 border-amber-100",
                        Failed: "bg-red-50 text-red-600 border-red-100",
                        Refunded: "bg-purple-50 text-purple-700 border-purple-100",
                      };
                      const stBadge: Record<string, string> = {
                        "Not processed": "bg-gray-100 text-gray-600 border-gray-200",
                        Processing: "bg-blue-50 text-blue-700 border-blue-100",
                        Shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
                        Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
                        Cancelled: "bg-red-50 text-red-600 border-red-100",
                      };
                      return (
                        <tr
                          key={o._id}
                          onClick={() => openOrderDrawer(o)}
                          className="border-b hover:bg-[#F5E9DA]/40 cursor-pointer transition-colors"
                          style={{ borderColor: "#E8D5BC" }}
                        >
                          <td className="px-5 py-4 font-mono text-[10px] text-[#2C1A0E]/50">#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-[#6B3E26] text-xs">{o.user ? o.user.name : "N/A"}</p>
                            <p className="text-[10px] text-[#7A5C45]">{o.user ? o.user.email : ""}</p>
                          </td>
                          <td className="px-5 py-4 text-right font-serif font-bold text-[#6B3E26] text-sm">₹{o.amount}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${payBadge[o.paymentStatus] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                              {o.paymentStatus || "Pending"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stBadge[o.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[10px] text-[#7A5C45]">
                            {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
{/* Order Detail Drawer (right-side panel) */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedOrder(null)}>
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  {/* Drawer */}
                  <div
                    className="relative w-full max-w-lg bg-[#FFFDF9] h-full overflow-y-auto shadow-2xl border-l flex flex-col"
                    style={{ borderColor: "#E8D5BC" }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Drawer Header */}
                    <div className="sticky top-0 bg-[#FFFDF9]/95 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between z-10" style={{ borderColor: "#E8D5BC" }}>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">Order Detail</span>
                        <h3 className="font-serif font-bold text-[#6B3E26] text-base">#{selectedOrder._id.slice(-10).toUpperCase()}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="h-8 w-8 rounded-full bg-[#E8D5BC] flex items-center justify-center text-[#6B3E26] hover:bg-[#6B3E26]/10 transition-colors text-sm cursor-pointer"
                      >✕</button>
                    </div>

                    <div className="flex-1 p-6 space-y-6">
                      {/* Feedback */}
                      {drawerMsg && (
                        <div className={`text-xs p-3 rounded-xl border ${drawerMsg.startsWith("✅") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                          {drawerMsg}
                        </div>
                      )}

                      {/* Customer Info */}
                      <div className="bg-[#FDF6EC] border p-4 rounded-2xl space-y-2" style={{ borderColor: "#E8D5BC" }}>
                        <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">👤 Customer</span>
                        <p className="font-bold text-[#6B3E26]">{selectedOrder.user?.name || "N/A"}</p>
                        <p className="text-xs text-[#7A5C45]">{selectedOrder.user?.email || ""}</p>
                        <p className="text-xs text-[#7A5C45]">📞 {selectedOrder.phone}</p>
                        <p className="text-xs text-[#7A5C45] leading-relaxed">📍 {selectedOrder.address}</p>
                      </div>

                      {/* Products */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">📦 Items Ordered</span>
                        {selectedOrder.allProduct?.map((item, idx) => {
                          if (!item.id) return null;
                          const img = item.id.pImages?.length > 0
                            ? `${BACKEND_URL}/uploads/products/${encodeURIComponent(item.id.pImages[0])}`
                            : "/images/product-placeholder.jpg";
                          return (
                            <div key={idx} className="flex items-center gap-3 bg-white border p-3 rounded-xl" style={{ borderColor: "#E8D5BC" }}>
                              <img src={img} alt={item.id.pName} className="h-10 w-10 object-cover rounded-lg border" style={{ borderColor: "#E8D5BC" }} />
                              <div className="flex-1">
                                <p className="font-bold text-[#6B3E26] text-xs">{item.id.pName}</p>
                                <p className="text-[10px] text-[#7A5C45]">₹{item.id.pPrice} × {item.quantitiy} = ₹{item.id.pPrice * item.quantitiy}</p>
                              </div>
                            </div>
                          );
                        })}
                        <div className="flex justify-between items-center pt-3 text-sm font-bold text-[#6B3E26] border-t" style={{ borderColor: "#E8D5BC" }}>
                          <span>Order Total</span>
                          <span className="font-serif text-base">₹{selectedOrder.amount}</span>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-[#FDF6EC] border p-4 rounded-2xl space-y-2 text-xs" style={{ borderColor: "#E8D5BC" }}>
                        <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">💳 Payment</span>
                        <div className="flex justify-between"><span className="text-[#7A5C45]">Gateway</span><span className="font-semibold capitalize">{selectedOrder.paymentGateway || "—"}</span></div>
                        <div className="flex justify-between"><span className="text-[#7A5C45]">Transaction ID</span><span className="font-mono text-[10px]">{selectedOrder.transactionId}</span></div>
                        <div className="flex justify-between"><span className="text-[#7A5C45]">Refund Status</span><span className="font-semibold text-[#6B3E26]">{selectedOrder.refundStatus || "None"}</span></div>
                      </div>

                      {/* Admin Controls */}
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">⚙️ Admin Actions</span>

                        {/* Fulfillment Status */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider">Fulfillment Status</label>
                          <select
                            value={drawerStatus}
                            onChange={e => setDrawerStatus(e.target.value)}
                            className="w-full bg-white border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#6B3E26]"
                            style={{ borderColor: "#E8D5BC" }}
                          >
                            <option value="Not processed">Not Processed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Payment Status */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider">Payment Status</label>
                          <select
                            value={drawerPaymentStatus}
                            onChange={e => setDrawerPaymentStatus(e.target.value)}
                            className="w-full bg-white border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#6B3E26]"
                            style={{ borderColor: "#E8D5BC" }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>

                        {/* Tracking ID */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider">Shipment Tracking ID</label>
                          <input
                            type="text"
                            value={drawerTrackingId}
                            onChange={e => setDrawerTrackingId(e.target.value)}
                            placeholder="e.g. DTDC1234567890IN"
                            className="w-full bg-white border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#6B3E26]"
                            style={{ borderColor: "#E8D5BC" }}
                          />
                        </div>

                        {/* Save Button */}
                        <button
                          type="button"
                          onClick={() => handleAdminOrderUpdate({
                            status: drawerStatus,
                            paymentStatus: drawerPaymentStatus,
                            shipmentTrackingId: drawerTrackingId,
                          })}
                          disabled={drawerSaving}
                          className="w-full py-3 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all shadow-sm disabled:opacity-55 uppercase tracking-wider cursor-pointer"
                        >
                          {drawerSaving ? "Saving..." : "💾 Save Changes"}
                        </button>

                        {/* Refund Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to issue a refund request for this order?")) {
                              handleAdminOrderUpdate({ refundStatus: "Requested" });
                            }
                          }}
                          disabled={drawerSaving || selectedOrder.refundStatus === "Requested" || selectedOrder.refundStatus === "Processed"}
                          className="w-full py-3 bg-white border-2 border-red-200 text-red-600 text-xs font-bold rounded-full hover:border-red-400 transition-all disabled:opacity-40 uppercase tracking-wider cursor-pointer"
                        >
                          {selectedOrder.refundStatus === "Requested"
                            ? "⏳ Refund Requested"
                            : selectedOrder.refundStatus === "Processed"
                            ? "✅ Refund Processed"
                            : "↩️ Issue Refund"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VLOGS PANEL */}
          {activeTab === "vlogs" && (
            <div className="space-y-6">
              {showVlogForm ? (
                <VlogForm
                  initialVlog={editingVlog}
                  categoriesList={vlogCategories}
                  onSuccess={() => {
                    setShowVlogForm(false);
                    setEditingVlog(null);
                    fetchVlogs();
                  }}
                  onCancel={() => {
                    setShowVlogForm(false);
                    setEditingVlog(null);
                  }}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Blogs Manager</h2>
                    <button
                      onClick={() => {
                        setEditingVlog(null);
                        setShowVlogForm(true);
                      }}
                      className="px-5 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-semibold rounded-full hover:bg-[#4e2c18] transition-all cursor-pointer"
                    >
                      + Add Blog
                    </button>
                  </div>

                  <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                          <th className="px-6 py-3">Title</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3 text-center">Status</th>
                          <th className="px-6 py-3 text-right">Views</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vlogs.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-[#7A5C45]">No vlogs found.</td></tr>
                        ) : vlogs.map(v => (
                          <tr key={v._id} className="border-b hover:bg-[#F5E9DA]/40 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                            <td className="px-6 py-4 font-semibold text-[#6B3E26]">{v.title}</td>
                            <td className="px-6 py-4 text-[#7A5C45]">{v.vCategory?.cName || "Uncategorized"}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${v.isPublished ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                                {v.isPublished ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-[#7A5C45]">{v.viewCount}</td>
                            <td className="px-6 py-4 text-right space-x-3">
                              <button onClick={() => handleVlogPublishToggle(v._id, v.isPublished)} className="text-[#B23A2A] hover:underline text-xs font-bold">
                                {v.isPublished ? "Unpublish" : "Publish"}
                              </button>
                              <button onClick={() => { setEditingVlog(v); setShowVlogForm(true); }} className="text-[#6B3E26] hover:underline text-xs font-bold">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VLOG CATEGORIES PANEL */}
          {activeTab === "vlogCategories" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Blog Categories Manager</h2>
              
              <form onSubmit={handleAddVlogCategory} className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
                <h3 className="font-serif font-bold text-[#6B3E26] text-lg">Add Blog Category</h3>
                <div className="flex flex-col gap-4">
                  <input 
                    type="text" placeholder="Category Name" value={vCatName} onChange={e => setVCatName(e.target.value)} required 
                    className="px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26]" style={{ borderColor: "#E8D5BC" }}
                  />
                  <textarea 
                    placeholder="Description" value={vCatDesc} onChange={e => setVCatDesc(e.target.value)} required 
                    className="px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26]" style={{ borderColor: "#E8D5BC" }}
                  />
                </div>
                <button type="submit" className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] cursor-pointer transition-all">
                  Create Category
                </button>
              </form>

              <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                      <th className="px-6 py-3">Category Name</th>
                      <th className="px-6 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vlogCategories.map(c => (
                      <tr key={c._id} className="border-b hover:bg-[#F5E9DA]/20" style={{ borderColor: "#E8D5BC" }}>
                        <td className="px-6 py-4 font-semibold text-[#6B3E26]">{c.cName}</td>
                        <td className="px-6 py-4 text-[#2C1A0E]/80">{c.cDescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* 5. SETTINGS PANEL */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Payment Settings</h2>
              <p className="text-sm text-[#7A5C45]">Enable or disable payment gateways displayed at checkout. Changes take effect immediately for all customers.</p>

              {/* PhonePe */}
              <div className="bg-[#FDF6EC] border p-6 rounded-3xl flex items-center justify-between gap-6" style={{ borderColor: "#E8D5BC" }}>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#5f259f]/10 flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#6B3E26] text-base">PhonePe</h3>
                    <p className="text-xs text-[#7A5C45] mt-0.5">UPI, Debit/Credit cards & Wallets via PhonePe gateway</p>
                    <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      phonePeEnabled ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}>
                      {phonePeEnabled ? "ACTIVE" : "DISABLED"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhonePeEnabled(prev => !prev)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    phonePeEnabled ? "bg-[#6B3E26]" : "bg-gray-300"
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    phonePeEnabled ? "translate-x-8" : "translate-x-1"
                  }`} />
                </button>
              </div>

              {/* PayU */}
              <div className="bg-[#FDF6EC] border p-6 rounded-3xl flex items-center justify-between gap-6" style={{ borderColor: "#E8D5BC" }}>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#0065A4]/10 flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#6B3E26] text-base">PayU</h3>
                    <p className="text-xs text-[#7A5C45] mt-0.5">EMI, Net Banking, Wallets & all major cards via PayU</p>
                    <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      payUEnabled ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}>
                      {payUEnabled ? "ACTIVE" : "DISABLED"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPayUEnabled(prev => !prev)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    payUEnabled ? "bg-[#6B3E26]" : "bg-gray-300"
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    payUEnabled ? "translate-x-8" : "translate-x-1"
                  }`} />
                </button>
              </div>

              {/* Save button */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleSavePaymentSettings}
                  disabled={savingPayment}
                  className="px-8 py-3 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all shadow-sm disabled:opacity-55 uppercase tracking-wider cursor-pointer"
                >
                  {savingPayment ? "Saving..." : "Save Payment Settings"}
                </button>
                {formSuccess && <span className="text-green-600 text-xs font-semibold">{formSuccess}</span>}
                {formError && <span className="text-red-500 text-xs font-semibold">{formError}</span>}
              </div>

              {/* Info note */}
              <div className="bg-[#FDF6EC] border border-dashed p-4 rounded-2xl" style={{ borderColor: "#E8D5BC" }}>
                <p className="text-xs text-[#7A5C45]">
                  <span className="font-bold text-[#6B3E26]">Note:</span> PhonePe and PayU integrations require valid merchant API keys configured in the server environment variables (<code className="bg-[#F5E9DA] px-1.5 py-0.5 rounded text-[10px]">PHONEPE_MERCHANT_ID</code>, <code className="bg-[#F5E9DA] px-1.5 py-0.5 rounded text-[10px]">PAYU_KEY</code>, <code className="bg-[#F5E9DA] px-1.5 py-0.5 rounded text-[10px]">PAYU_SALT</code>). Contact your developer to complete the gateway onboarding.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
