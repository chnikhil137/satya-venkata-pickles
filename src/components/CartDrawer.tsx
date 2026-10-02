import { useState, type FormEvent } from "react";
import {
  ShoppingBag,
  X,
  Trash2,
  Copy,
  MessageCircle,
  Check,
  Info,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { toast } from "sonner";
import { Quantity } from "./Quantity";
import { business } from "../config/business";
import { productName, type Size } from "../data/products";
import {
  cartTotal,
  getLine,
  money,
  orderSummary,
  validateCustomer,
  whatsappUrl,
  type CartItem,
  type Customer,
} from "../utils/order";
export function CartDrawer({
  open,
  onOpenChange,
  cart,
  update,
  clear,
  storageIssue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  update: (id: string, size: Size, n: number) => void;
  clear: () => void;
  storageIssue: boolean;
}) {
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    area: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>(
    {},
  );
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const [manualSummary, setManualSummary] = useState("");
  const total = cartTotal(cart);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  function valid() {
    const e = validateCustomer(customer);
    setErrors(e);
    if (Object.keys(e).length) {
      document
        .getElementById(e.name ? "customer-name" : "customer-phone")
        ?.focus();
      return false;
    }
    return cart.length > 0;
  }
  function checkout(event: FormEvent) {
    event.preventDefault();
    if (!valid()) return;
    window.open(
      whatsappUrl(orderSummary(cart, customer)),
      "_blank",
      "noopener,noreferrer",
    );
    setOpened(true);
  }
  async function copy() {
    if (!valid()) return;
    const text = orderSummary(cart, customer);
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      toast.success("Order summary copied");
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.append(el);
      el.select();
      const ok = document.execCommand("copy");
      el.remove();
      if (ok) {
        setCopied(true);
        toast.success("Order summary copied");
      } else {
        setManualSummary(text);
        toast.info("Select and copy your order summary below.");
      }
    }
  }
  function field(key: keyof Customer, label: string, required = false) {
    return (
      <div className={`field ${key === "notes" ? "full" : ""}`}>
        <label htmlFor={`customer-${key}`}>
          {label}
          {!required && <span>Optional</span>}
        </label>
        {key === "notes" ? (
          <textarea
            id={`customer-${key}`}
            rows={2}
            maxLength={500}
            value={customer[key]}
            onChange={(e) =>
              setCustomer({ ...customer, [key]: e.target.value })
            }
            placeholder="Anything we should know?"
          />
        ) : (
          <input
            id={`customer-${key}`}
            required={required}
            type={key === "phone" ? "tel" : "text"}
            inputMode={key === "phone" ? "tel" : "text"}
            autoComplete={
              {
                name: "name",
                phone: "tel",
                area: "address-line1",
                city: "address-level2",
              }[key]
            }
            maxLength={key === "phone" ? 18 : 80}
            aria-invalid={!!errors[key]}
            aria-describedby={errors[key] ? `${key}-error` : undefined}
            value={customer[key]}
            onChange={(e) => {
              setCustomer({ ...customer, [key]: e.target.value });
              setErrors({ ...errors, [key]: undefined });
            }}
            placeholder={
              key === "phone"
                ? "10-digit mobile number"
                : key === "name"
                  ? "Your name"
                  : key === "area"
                    ? "Area or locality"
                    : "Your city"
            }
          />
        )}{" "}
        {errors[key] && (
          <p role="alert" id={`${key}-error`} className="field-error">
            {errors[key]}
          </p>
        )}
      </div>
    );
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="order-drawer"
        showCloseButton={false}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.getElementById("open-order")?.focus();
        }}
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Made for your table</p>
            <SheetTitle className="drawer-title">
              Your order <span>({count})</span>
            </SheetTitle>
          </div>
          <SheetClose className="icon-button" aria-label="Close order">
            <X size={22} />
          </SheetClose>
        </div>
        <SheetDescription className="sr-only">
          Review your products and enter your details to send an order through
          WhatsApp.
        </SheetDescription>
        {!cart.length ? (
          <Empty className="empty-cart">
            <EmptyHeader>
              <ShoppingBag size={40} strokeWidth={1} />
              <EmptyTitle className="empty-title">
                Something lovely awaits.
              </EmptyTitle>
              <EmptyDescription>
                Your order is empty. Find a little taste of home in our menu.
              </EmptyDescription>
            </EmptyHeader>
            <button
              className="button primary"
              onClick={() => onOpenChange(false)}
            >
              Explore the menu
            </button>
          </Empty>
        ) : (
          <div className="drawer-scroll">
            <div className="cart-topline">
              <span>
                {count} {count === 1 ? "pack" : "packs"} in your order
              </span>
              <button
                className="text-button"
                onClick={() => {
                  clear();
                  setOpened(false);
                }}
              >
                Clear order
              </button>
            </div>
            <div className="cart-lines">
              {cart.map((item) => {
                const line = getLine(item);
                if (!line) return null;
                const name = productName(line.product);
                return (
                  <div
                    className="cart-line"
                    key={`${item.productId}-${item.size}`}
                  >
                    <div className={`cart-category ${line.product.category}`}>
                      <ShoppingBag size={20} strokeWidth={1.4} />
                    </div>
                    <div className="cart-line-main">
                      <h3>{name}</h3>
                      <p>
                        {item.size} <span>·</span> {money(line.price)} / pack
                      </p>
                      <Quantity
                        value={item.quantity}
                        onChange={(n) => update(item.productId, item.size, n)}
                        label={`${name}, ${item.size}`}
                      />
                    </div>
                    <div className="cart-line-end">
                      <strong>{money(line.subtotal)}</strong>
                      <button
                        className="icon-button remove-button"
                        aria-label={`Remove ${name}, ${item.size}`}
                        onClick={() => update(item.productId, item.size, 0)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="order-total">
              <span>Products total</span>
              <strong data-testid="cart-total">{money(total)}</strong>
            </div>
            <p className="delivery-notice">
              <Info size={16} />
              {business.deliveryNotice}
            </p>
            {storageIssue && (
              <p className="inline-note">
                Your browser cannot save this cart. Keep this page open until
                you order.
              </p>
            )}
            <form className="checkout-form" noValidate onSubmit={checkout}>
              <div className="checkout-heading">
                <h3>A few details</h3>
                <p>So we know who we’re cooking for.</p>
              </div>
              <div className="form-grid">
                {field("name", "Your name", true)}
                {field("phone", "Mobile number", true)}
                {field("area", "Area / locality")}
                {field("city", "City")}
                {field("notes", "Delivery notes")}
              </div>
              <p className="privacy-note">
                Your details are only included in your WhatsApp message.
              </p>
              <button type="submit" className="button primary whatsapp-order">
                <MessageCircle size={20} />
                Order on WhatsApp
              </button>
              <p className="handoff-note">
                WhatsApp opens with your order ready. Tap send there to share it
                with us.
              </p>
              {opened && (
                <p role="status" className="inline-note">
                  Continue in WhatsApp to send your order. Delivery and payment
                  can be confirmed in the chat.
                </p>
              )}
              <button
                type="button"
                className="button copy-order"
                onClick={copy}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
                {copied ? "Copied to clipboard" : "Copy order summary"}
              </button>
              {manualSummary && (
                <textarea
                  className="manual-summary"
                  aria-label="Order summary to copy"
                  readOnly
                  rows={12}
                  value={manualSummary}
                  onFocus={(e) => e.target.select()}
                />
              )}
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
