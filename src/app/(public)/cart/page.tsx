"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, updateQuantity, removeFromCart, clearCart, getCartTotal } from "@/lib/cart";
import { API_URL, BACKEND_URL } from "@/lib/api";

interface CartItem {
  id: string;
  quantitiy: number;
  price: number;
  pName?: string;
  pImage?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ _id: string; name: string; email: string } | null>(null);
  
  // Checkout inputs
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  // Payment methods
  const [phonePeEnabled, setPhonePeEnabled] = useState(false);
  const [payUEnabled, setPayUEnabled] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"phonepe" | "payu" | "">("")

  const refreshCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    // 1. Initial Load
    refreshCart();

    // 2. Auth Session Check
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Session error.");
      }
    }

    // 3. Load payment gateway settings
    fetch(`${API_URL}/customize/payment-settings`)
      .then(r => r.json())
      .then(json => {
        const pe = json.phonePeEnabled !== false;
        const pu = json.payUEnabled !== false;
        setPhonePeEnabled(pe);
        setPayUEnabled(pu);
        // Auto-select first available
        if (pe) setSelectedPayment("phonepe");
        else if (pu) setSelectedPayment("payu");
      })
      .catch(() => {});

    // 4. Listener
    window.addEventListener("cart_updated", refreshCart);
    return () => window.removeEventListener("cart_updated", refreshCart);
  }, []);

  const totalCost = getCartTotal();
  const isFreeShipping = totalCost >= 1000;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    setCheckoutSuccess("");

    if (!user) {
      setCheckoutError("You must be signed in to place an order.");
      return;
    }
    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }
    if (!selectedPayment) {
      setCheckoutError("Please select a payment method.");
      return;
    }

    setIsSubmitting(true);
    const orderAmount = totalCost + (isFreeShipping ? 0 : 99);
    const orderProducts = cartItems.map(item => ({
      id: item.id,
      quantitiy: item.quantitiy,
      price: item.price,
    }));

    try {
      /* ── PhonePe Flow ─────────────────────────────────────────── */
      if (selectedPayment === "phonepe") {
        const res = await fetch(`${API_URL}/payment/phonepe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "",
          },
          credentials: "include",
          body: JSON.stringify({
            allProduct: orderProducts,
            user,
            amount: orderAmount,
            address,
            phone,
          }),
        });

        const data = await res.json();
        if (data.error || !data.redirectUrl) {
          setCheckoutError(data.error || "Failed to initiate PhonePe payment. Please try again.");
          return;
        }

        // Clear cart BEFORE redirect so it's clean when user returns
        clearCart();
        setCheckoutSuccess("Redirecting to PhonePe...");
        // Hard redirect to PhonePe hosted checkout
        window.location.href = data.redirectUrl;
        return;
      }

      /* ── PayU Flow ────────────────────────────────────────────── */
      if (selectedPayment === "payu") {
        const res = await fetch(`${API_URL}/payment/payu`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "",
          },
          credentials: "include",
          body: JSON.stringify({
            allProduct: orderProducts,
            user,
            amount: orderAmount,
            address,
            phone,
          }),
        });

        const data = await res.json();
        if (data.error) {
          setCheckoutError(data.error);
          return;
        }

        // Build a hidden form and auto-submit to PayU
        clearCart();
        setCheckoutSuccess("Redirecting to PayU...");

        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.action;

        const fields: Record<string, string> = {
          key:         data.key,
          txnid:       data.txnid,
          amount:      data.amount,
          productinfo: data.productinfo,
          firstname:   data.firstname,
          email:       data.email,
          phone:       data.phone,
          surl:        data.surl,
          furl:        data.furl,
          hash:        data.hash,
        };

        Object.entries(fields).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type  = "hidden";
          input.name  = name;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

    } catch (err) {
      setCheckoutError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
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
            <div className="leading-none">
              <div className="font-bold text-[#6B3E26] text-base tracking-tight" style={{ fontFamily: "'Merriweather', serif" }}>
                Roshini's
              </div>
              <div className="text-[10px] text-[#7A5C45] font-medium tracking-widest uppercase">
                Home Products
              </div>
            </div>
          </Link>
          <Link href="/shop" className="text-xs uppercase font-bold tracking-widest text-[#6B3E26] hover:underline">
            Continue Shopping
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row gap-8">
        {cartItems.length === 0 ? (
          <div className="w-full text-center space-y-6 border border-dashed rounded-3xl p-12 bg-[#FDF6EC] my-auto" style={{ borderColor: "#E8D5BC" }}>
            <span className="text-6xl block">🌾</span>
            <h1 className="text-3xl font-bold font-serif text-[#6B3E26]">Your Wellness Cart is Empty</h1>
            <p className="text-sm text-[#7A5C45] max-w-md mx-auto">
              Explore our natural organic micro-batches of sugar-free and preservative-free wellness formulations to kickstart your healthy journey.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="px-8 py-3.5 bg-[#6B3E26] text-[#F5E9DA] rounded-full font-medium hover:bg-[#4e2c18] transition-all text-center inline-block">
                Shop Formulations
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items List (Left Side) */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Shopping Cart ({cartItems.length})</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const imageSrc = item.pImage 
                    ? `${BACKEND_URL}/uploads/products/${encodeURIComponent(item.pImage)}` 
                    : "/images/product-placeholder.jpg";
                  return (
                    <div key={item.id} className="bg-[#FDF6EC] border p-4 rounded-2xl flex items-center justify-between gap-4" style={{ borderColor: "#E8D5BC" }}>
                      {/* Product details preview */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={imageSrc} 
                          alt={item.pName || "Product"} 
                          className="h-16 w-16 object-cover rounded-xl border bg-white"
                          style={{ borderColor: "#E8D5BC" }}
                        />
                        <div>
                          <h3 className="font-serif font-bold text-[#6B3E26] text-sm">{item.pName || "Wellness Blend"}</h3>
                          <span className="text-xs text-[#7A5C45] block mt-0.5">₹{item.price} each</span>
                        </div>
                      </div>

                      {/* Quantity adjustments */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white border rounded-xl px-2 py-1" style={{ borderColor: "#E8D5BC" }}>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.quantitiy - 1)}
                            className="text-xs font-bold text-[#7A5C45] hover:text-[#6B3E26] px-1 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantitiy}</span>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.quantitiy + 1)}
                            className="text-xs font-bold text-[#7A5C45] hover:text-[#6B3E26] px-1 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-bold text-[#B23A2A] hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  type="button" 
                  onClick={clearCart} 
                  className="text-xs uppercase font-bold tracking-widest text-[#B23A2A] hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary & Checkout Form (Right Side) */}
            <aside className="w-full lg:w-96 space-y-6">
              <div className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
                <h3 className="font-serif font-bold text-[#6B3E26] text-lg">Order Summary</h3>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7A5C45]">Cart Subtotal</span>
                    <span className="font-semibold text-[#6B3E26]">₹{totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5C45]">Shipping Delivery</span>
                    <span className="font-medium">{isFreeShipping ? "FREE" : "₹99"}</span>
                  </div>
                  {!isFreeShipping && (
                    <div className="text-[10px] text-[#7A5C45] font-medium bg-white p-2.5 rounded-xl border border-dashed" style={{ borderColor: "#E8D5BC" }}>
                      💡 Add <span className="font-bold text-[#6B3E26]">₹{1000 - totalCost}</span> more to unlock **FREE SHIPPING**!
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-base font-bold text-[#6B3E26]" style={{ borderColor: "#E8D5BC" }}>
                    <span>Total Amount</span>
                    <span className="font-serif text-lg">₹{totalCost + (isFreeShipping ? 0 : 99)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="bg-[#FDF6EC] border p-6 rounded-3xl space-y-4" style={{ borderColor: "#E8D5BC" }}>
                <h3 className="font-serif font-bold text-[#6B3E26] text-lg">Checkout Information</h3>
                
                {checkoutSuccess && (
                  <div className="bg-green-50 text-green-600 text-xs p-3 rounded-xl border border-green-100">
                    {checkoutSuccess}
                  </div>
                )}
                {checkoutError && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">
                    {checkoutError}
                  </div>
                )}

                {user ? (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider">Recipient Address *</label>
                      <textarea 
                        required
                        placeholder="House No, Street, Landmark, Pin code" 
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        rows={3}
                        className="px-3 py-2.5 rounded-xl border bg-white text-xs focus:outline-none focus:border-[#6B3E26] resize-none"
                        style={{ borderColor: "#E8D5BC" }}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider">Contact Number *</label>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border bg-white text-xs focus:outline-none focus:border-[#6B3E26]"
                        style={{ borderColor: "#E8D5BC" }}
                      />
                    </div>

                    {/* Payment Method Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider">Payment Method *</label>
                      <div className="space-y-2">
                        {phonePeEnabled && (
                          <button
                            type="button"
                            onClick={() => setSelectedPayment("phonepe")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer ${
                              selectedPayment === "phonepe"
                                ? "border-[#5f259f] bg-[#5f259f]/5 text-[#5f259f]"
                                : "border-[#E8D5BC] bg-white text-foreground/75 hover:border-[#5f259f]/40"
                            }`}
                          >
                            <span className="text-lg">📱</span>
                            <div className="text-left">
                              <p className="font-bold">PhonePe</p>
                              <p className="text-[10px] font-normal opacity-70">UPI · Cards · Wallets</p>
                            </div>
                            {selectedPayment === "phonepe" && <span className="ml-auto text-[#5f259f]">✓</span>}
                          </button>
                        )}
                        {payUEnabled && (
                          <button
                            type="button"
                            onClick={() => setSelectedPayment("payu")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer ${
                              selectedPayment === "payu"
                                ? "border-[#0065A4] bg-[#0065A4]/5 text-[#0065A4]"
                                : "border-[#E8D5BC] bg-white text-foreground/75 hover:border-[#0065A4]/40"
                            }`}
                          >
                            <span className="text-lg">💳</span>
                            <div className="text-left">
                              <p className="font-bold">PayU</p>
                              <p className="text-[10px] font-normal opacity-70">EMI · Net Banking · Cards</p>
                            </div>
                            {selectedPayment === "payu" && <span className="ml-auto text-[#0065A4]">✓</span>}
                          </button>
                        )}
                        {!phonePeEnabled && !payUEnabled && (
                          <div className="text-xs text-foreground/60 text-center p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            No payment methods are currently active. Please contact the store admin.
                          </div>
                        )}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting || !selectedPayment}
                      className="w-full py-3 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all shadow-sm uppercase tracking-wider disabled:opacity-55 cursor-pointer"
                    >
                      {isSubmitting ? "Processing..." : `Pay with ${selectedPayment === "phonepe" ? "PhonePe" : selectedPayment === "payu" ? "PayU" : "..."}`}
                    </button>
                  </form>
                ) : (
                  <div className="text-center p-4 bg-white border rounded-2xl space-y-3" style={{ borderColor: "#E8D5BC" }}>
                    <p className="text-xs text-[#7A5C45]">You must be logged in to complete your purchase.</p>
                    <Link href="/login" className="px-5 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full inline-block hover:bg-[#4e2c18] transition-all w-full text-center">
                      Sign In to Checkout
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
