import { business } from "../config/business";
import { products, productName, type Size } from "../data/products";
export type CartItem = { productId: string; size: Size; quantity: number };
export type Customer = {
  name: string;
  phone: string;
  area: string;
  city: string;
  notes: string;
};
export const CART_KEY = "satya-venkata-cart-v1";
export const MAX_QUANTITY = 99;
export const money = (amount: number) =>
  new Intl.NumberFormat(business.locale, {
    style: "currency",
    currency: business.currency,
    maximumFractionDigits: 0,
  }).format(amount);
export function getLine(item: CartItem) {
  const product = products.find((p) => p.id === item.productId);
  const variant = product?.variants.find((v) => v.size === item.size);
  return product && variant
    ? {
        ...item,
        product,
        price: variant.price,
        subtotal: variant.price * item.quantity,
      }
    : null;
}
export function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const raw of value.slice(0, 200)) {
    if (
      !raw ||
      typeof raw !== "object" ||
      !Number.isInteger(raw.quantity) ||
      raw.quantity < 1
    )
      continue;
    const product = products.find((p) => p.id === raw.productId);
    if (!product?.variants.some((v) => v.size === raw.size)) continue;
    const existing = result.find(
      (i) => i.productId === raw.productId && i.size === raw.size,
    );
    const quantity = Math.min(MAX_QUANTITY, raw.quantity);
    if (existing)
      existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + quantity);
    else result.push({ productId: product.id, size: raw.size, quantity });
  }
  return result;
}
export const cartTotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + (getLine(item)?.subtotal ?? 0), 0);
export function normalizePhone(value: string) {
  let digits = value.replace(/[\s()-]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91"))
    digits = digits.slice(2);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}
export function validateCustomer(customer: Customer) {
  const errors: Partial<Record<keyof Customer, string>> = {};
  if (!customer.name.trim()) errors.name = "Please enter your name.";
  if (!normalizePhone(customer.phone))
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  return errors;
}
const clean = (s: string) => s.trim().replace(/[\r\n]+/g, " ");
export function orderSummary(cart: CartItem[], customer: Customer) {
  const lines = cart.map(getLine).filter((x) => x !== null);
  if (!lines.length) throw new Error("Your order is empty.");
  return [
    `Hello ${business.name}! 👋`,
    "",
    "I would like to place an order.",
    "",
    "ORDER",
    ...lines.map(
      (i) =>
        `• ${productName(i.product)} — ${i.size} × ${i.quantity} — ${money(i.subtotal)}`,
    ),
    "",
    `Products Total: ${money(cartTotal(cart))}`,
    "",
    "CUSTOMER",
    `Name: ${clean(customer.name)}`,
    `Phone: ${normalizePhone(customer.phone) ?? clean(customer.phone)}`,
    ...(customer.area.trim() ? [`Area: ${clean(customer.area)}`] : []),
    ...(customer.city.trim() ? [`City: ${clean(customer.city)}`] : []),
    ...(customer.notes.trim() ? [`Notes: ${clean(customer.notes)}`] : []),
    "",
    business.deliveryNotice,
    "",
    "Thank you.",
  ].join("\n");
}
export const whatsappUrl = (
  message: string,
  phone = business.primaryWhatsApp,
) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
export const specialOrderUrl = whatsappUrl(
  `Hello ${business.name},\nI would like to enquire about a special/bulk order.\n\nOccasion:\nApproximate quantity:\nRequired date:\nLocation:`,
);
