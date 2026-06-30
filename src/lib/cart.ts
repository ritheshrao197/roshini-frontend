export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  quantitiy: number; // Spelling matches backend database models exactly
  price: number;
  // Optional client-only helpers for rendering
  pName?: string;
  pImage?: string;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(
  id: string,
  price: number,
  pName?: string,
  pImage?: string,
  quantityVal: number = 1,
  productId?: string,
  variantId?: string,
  variantName?: string
) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantitiy += quantityVal;
  } else {
    cart.push({
      id,
      productId: productId || id,
      variantId,
      variantName,
      price,
      quantitiy: quantityVal,
      pName,
      pImage,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event("cart_updated"));
}

export function updateQuantity(id: string, quantitiy: number) {
  let cart = getCart();
  if (quantitiy <= 0) {
    cart = cart.filter((item) => item.id !== id);
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) item.quantitiy = quantitiy;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart_updated"));
}

export function removeFromCart(id: string) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart_updated"));
}

export function clearCart() {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("cart_updated"));
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantitiy, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantitiy, 0);
}
