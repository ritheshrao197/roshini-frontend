"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { API_URL, BACKEND_URL } from "@/lib/api";

interface OrderItem {
  id: {
    _id: string;
    pName: string;
    pImages: string[];
    pPrice: number;
  };
  quantitiy: number;
  price: number;
}

interface Order {
  _id: string;
  allProduct: OrderItem[];
  amount: number;
  status: string;
  paymentStatus: string;
  paymentGateway: string;
  transactionId: string;
  shipmentTrackingId?: string;
  address: string;
  phone: string;
  createdAt: string;
}

const TIMELINE_STEPS = ["Pending", "Paid", "Processing", "Shipped", "Delivered"];

const TIMELINE_ICONS: Record<string, string> = {
  Pending: "⏳",
  Paid: "✅",
  Processing: "⚙️",
  Shipped: "🚚",
  Delivered: "📦",
};

function getTimelineStep(order: Order): number {
  // Build combined step based on paymentStatus + fulfillment status
  if (order.status === "Delivered") return 4;
  if (order.status === "Shipped") return 3;
  if (order.status === "Processing") return 2;
  if (order.paymentStatus === "Paid") return 1;
  return 0;
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Failed: "bg-red-50 text-red-600 border-red-200",
    Refunded: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Not processed": "bg-gray-50 text-gray-600 border-gray-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ _id: string; name: string; email: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    async function fetchUserOrders() {
      try {
        const res = await fetch(`${API_URL}/order/order-by-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || ""
          },
          body: JSON.stringify({ uId: parsedUser._id }),
        });
        const json = await res.json();
        if (json.error) {
          setOrdersError(json.error);
        } else {
          setOrders(json.Order || []);
        }
      } catch (err) {
        setOrdersError("Failed to load your purchase history.");
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchUserOrders();
  }, [router]);

  const handleReorder = (order: Order) => {
    order.allProduct.forEach((item) => {
      if (item.id) {
        addToCart(
          item.id._id,
          item.price,
          item.id.pName,
          item.id.pImages && item.id.pImages.length > 0 ? item.id.pImages[0] : undefined,
          item.quantitiy
        );
      }
    });
    router.push("/cart");
  };

  const handleDownloadInvoice = async (orderId: string) => {
    setDownloadingInvoice(orderId);
    try {
      const res = await fetch(`${API_URL}/order/invoice/${orderId}`);
      const json = await res.json();
      if (json.invoice) {
        const inv = json.invoice;
        // Build printable HTML invoice
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Invoice ${inv.invoiceNumber}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: 40px auto; color: #2d2d2d; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4a7c59; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 22px; font-weight: 800; color: #4a7c59; }
  .inv-num { font-size: 12px; color: #666; margin-top: 4px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin: 20px 0 8px; }
  .row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #f0ede4; }
  .row strong { color: #4a7c59; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  th { background: #f7f4ec; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
  td { padding: 10px 12px; border-bottom: 1px solid #f0ede4; }
  .total-row { font-weight: 700; font-size: 15px; color: #4a7c59; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; background: #e8f5e9; color: #388e3c; }
  .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #aaa; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">🌿 ${inv.storeName}</div>
    <div class="inv-num">Invoice # ${inv.invoiceNumber}</div>
    <div style="font-size:11px;color:#999;margin-top:4px">Issued: ${new Date(inv.issuedDate).toLocaleDateString()}</div>
  </div>
  <div style="text-align:right;font-size:12px;color:#666">
    <div><strong>Order Date:</strong> ${new Date(inv.orderDate).toLocaleDateString()}</div>
    <div><strong>Order ID:</strong> ${inv.orderId}</div>
    <div style="margin-top:6px"><span class="badge">${inv.paymentStatus}</span></div>
  </div>
</div>

<h2>Bill To</h2>
<div class="row"><span>${inv.customer.name}</span></div>
<div class="row"><span>${inv.customer.email}</span></div>
<div class="row"><span>📞 ${inv.customer.phone}</span></div>
<div class="row"><span>📍 ${inv.customer.address}</span></div>

<h2>Order Items</h2>
<table>
<thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
<tbody>
${inv.items.map((item: { name: string; quantity: number; unitPrice: number; total: number }) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.unitPrice}</td><td>₹${item.total}</td></tr>`).join("")}
</tbody>
</table>

<div class="row"><span>Subtotal</span><span>₹${inv.subtotal}</span></div>
<div class="row"><span>Shipping</span><span>${inv.shipping === 0 ? "FREE" : "₹" + inv.shipping}</span></div>
<div class="row total-row"><span>Total</span><span>₹${inv.total}</span></div>

<h2>Payment & Shipping</h2>
<div class="row"><span>Payment Gateway</span><strong>${inv.paymentGateway}</strong></div>
<div class="row"><span>Transaction ID</span><span>${inv.transactionId}</span></div>
${inv.trackingId ? `<div class="row"><span>Tracking ID</span><strong>${inv.trackingId}</strong></div>` : ""}
<div class="row"><span>Fulfillment Status</span><strong>${inv.fulfillmentStatus}</strong></div>

<div class="footer">Thank you for shopping with ${inv.storeName} · ${inv.storeEmail}</div>
</body></html>`;
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${inv.invoiceNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Invoice download failed", e);
    } finally {
      setDownloadingInvoice(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C1A0E] flex flex-col font-sans">
      {/* Header */}
      <header className="border-b sticky top-0 bg-[#FFFDF9]/80 backdrop-blur-md z-50" style={{ borderColor: "#E8D5BC" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#6B3E26] flex items-center justify-center text-[#F5E9DA] font-bold text-lg shadow-sm group-hover:bg-[#4e2c18] transition-colors">
              R
            </div>
            <div className="leading-none text-left">
              <div className="font-bold text-[#6B3E26] text-base tracking-tight" style={{ fontFamily: "'Merriweather', serif" }}>
                Roshini's
              </div>
              <div className="text-[10px] text-[#7A5C45] font-medium tracking-widest uppercase">
                Home Products
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-xs uppercase font-bold tracking-widest text-[#6B3E26] hover:underline">Catalog</Link>
            <Link href="/cart" className="text-xs uppercase font-bold tracking-widest text-[#7A5C45] hover:underline">Cart</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-1 space-y-8">

        {/* Profile Card */}
        {user && (
          <div className="bg-[#FDF6EC] border p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: "#E8D5BC" }}>
            <div>
              <span className="text-[9px] uppercase font-bold text-[#7A5C45] tracking-wider block">Customer Dashboard</span>
              <h1 className="text-2xl font-bold font-serif text-[#6B3E26] mt-0.5">Welcome Back, {user.name}!</h1>
              <span className="text-xs text-[#7A5C45]">{user.email}</span>
            </div>
            <div className="flex gap-3">
              <div className="bg-[#6B3E26]/5 border px-5 py-3 rounded-2xl text-center min-w-[80px]" style={{ borderColor: "#E8D5BC" }}>
                <span className="text-[9px] uppercase font-bold text-[#7A5C45] block">Orders</span>
                <span className="text-xl font-serif font-bold text-[#6B3E26]">{orders.length}</span>
              </div>
              <div className="bg-[#6B3E26]/5 border px-5 py-3 rounded-2xl text-center min-w-[80px]" style={{ borderColor: "#E8D5BC" }}>
                <span className="text-[9px] uppercase font-bold text-[#7A5C45] block">Delivered</span>
                <span className="text-xl font-serif font-bold text-[#6B3E26]">
                  {orders.filter(o => o.status === "Delivered").length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-[#6B3E26] text-xl">📦 My Orders</h2>

          {loadingOrders ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-[#FDF6EC] border h-40 rounded-3xl animate-pulse" style={{ borderColor: "#E8D5BC" }} />
              ))}
            </div>
          ) : ordersError ? (
            <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl border border-red-100">{ordersError}</div>
          ) : orders.length === 0 ? (
            <div className="text-center p-12 border border-dashed bg-[#FDF6EC] rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
              <span className="text-3xl block">🌾</span>
              <h3 className="font-serif font-bold text-[#6B3E26]">No Orders Yet</h3>
              <p className="text-xs text-[#7A5C45] max-w-xs mx-auto">Visit our wellness catalog to start your healthy journey!</p>
              <Link href="/shop" className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full inline-block hover:bg-[#4e2c18] transition-all">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const step = getTimelineStep(order);
                const isExpanded = expandedOrder === order._id;

                return (
                  <div key={order._id} className="bg-[#FDF6EC] border rounded-3xl shadow-sm overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
                    {/* Order Header Row */}
                    <div
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F5E9DA]/40 transition-colors"
                      onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={order.status} />
                          <PaymentBadge status={order.paymentStatus || "Pending"} />
                          {order.shipmentTrackingId && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">
                              🚚 {order.shipmentTrackingId}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#7A5C45] font-mono">Order #{order._id.slice(-10).toUpperCase()}</div>
                        <div className="text-xs text-[#7A5C45]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          &nbsp;·&nbsp;{order.allProduct.length} item{order.allProduct.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-serif font-bold text-[#6B3E26]">₹{order.amount}</span>
                        <span className="text-[#7A5C45] text-sm">{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="px-5 pb-4 border-t" style={{ borderColor: "#E8D5BC" }}>
                      <div className="pt-4 grid grid-cols-5 text-center text-[9px] font-bold text-[#7A5C45] relative pb-1 select-none">
                        {/* Base line */}
                        <div className="absolute top-[22px] left-[10%] right-[10%] h-0.5 bg-[#E8D5BC]" />
                        {/* Progress line */}
                        <div
                          className="absolute top-[22px] left-[10%] h-0.5 bg-[#6B3E26] transition-all duration-700"
                          style={{ width: `${step * 20}%` }}
                        />
                        {TIMELINE_STEPS.map((st, sIdx) => {
                          const active = step >= sIdx;
                          const current = step === sIdx;
                          return (
                            <div key={st} className="flex flex-col items-center gap-1.5 relative z-10">
                              <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
                                active
                                  ? "bg-[#6B3E26] border-[#6B3E26] text-white shadow-md"
                                  : "bg-white border-[#E8D5BC] text-[#2C1A0E]/30"
                              } ${current ? "ring-2 ring-[#6B3E26]/30 ring-offset-1" : ""}`}>
                                {active ? TIMELINE_ICONS[st] : "○"}
                              </div>
                              <span className={`text-[9px] leading-tight ${active ? "text-[#6B3E26] font-extrabold" : "text-[#2C1A0E]/40"}`}>
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-6 border-t space-y-5 pt-5" style={{ borderColor: "#E8D5BC" }}>
                        {/* Product Items */}
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">Items Ordered</span>
                          {order.allProduct.map((item, idx) => {
                            if (!item.id) return null;
                            const imageSrc = item.id.pImages && item.id.pImages.length > 0
                              ? `${BACKEND_URL}/uploads/products/${encodeURIComponent(item.id.pImages[0])}`
                              : "/images/product-placeholder.jpg";
                            return (
                              <div key={idx} className="flex items-center justify-between gap-4 bg-white border p-3 rounded-xl" style={{ borderColor: "#E8D5BC" }}>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={imageSrc}
                                    alt={item.id.pName}
                                    className="h-12 w-12 object-cover rounded-lg border bg-white"
                                    style={{ borderColor: "#E8D5BC" }}
                                  />
                                  <div>
                                    <span className="font-bold text-[#6B3E26] text-sm">{item.id.pName}</span>
                                    <span className="text-[10px] text-[#7A5C45] block">₹{item.id.pPrice} each</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-[#7A5C45] text-sm">{item.quantitiy} units</span>
                                  <span className="text-[10px] text-[#7A5C45]/50 block">₹{item.id.pPrice * item.quantitiy}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Shipping & Payment Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="bg-white border p-4 rounded-2xl space-y-2" style={{ borderColor: "#E8D5BC" }}>
                            <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">Delivery Details</span>
                            <p className="text-[#2C1A0E]/70 leading-relaxed">📍 {order.address}</p>
                            <p className="text-[#2C1A0E]/70">📞 {order.phone}</p>
                            {order.shipmentTrackingId && (
                              <p className="font-semibold text-indigo-700">🚚 Tracking: {order.shipmentTrackingId}</p>
                            )}
                          </div>
                          <div className="bg-white border p-4 rounded-2xl space-y-2" style={{ borderColor: "#E8D5BC" }}>
                            <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">Payment</span>
                            <div className="flex justify-between"><span className="text-[#2C1A0E]/60">Gateway</span><span className="font-semibold capitalize">{order.paymentGateway || "—"}</span></div>
                            <div className="flex justify-between"><span className="text-[#2C1A0E]/60">Status</span><PaymentBadge status={order.paymentStatus || "Pending"} /></div>
                            <div className="flex justify-between"><span className="text-[#2C1A0E]/60">Total</span><span className="font-bold text-[#6B3E26]">₹{order.amount}</span></div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="px-5 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all cursor-pointer"
                          >
                            🔄 Reorder
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order._id)}
                            disabled={downloadingInvoice === order._id}
                            className="px-5 py-2.5 bg-white border text-[#6B3E26] text-xs font-bold rounded-full hover:bg-[#FDF6EC] transition-all disabled:opacity-60 cursor-pointer"
                            style={{ borderColor: "#E8D5BC" }}
                          >
                            {downloadingInvoice === order._id ? "Generating..." : "🧾 Download Invoice"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
