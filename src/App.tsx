import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShoppingBag,
  Search,
  X,
  MessageCircle,
  Leaf,
  Heart,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  Gift,
  Check,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { toast } from "sonner";
import { business, claims, occasions } from "./config/business";
import {
  products,
  categories,
  productName,
  type Category,
  type Size,
} from "./data/products";
import { cartTotal, money, specialOrderUrl, whatsappUrl } from "./utils/order";
import { useCart } from "./hooks/useCart";
import { ProductCard } from "./components/ProductCard";
import { CartDrawer } from "./components/CartDrawer";
const claimIcons = [Leaf, Heart, Sparkles, PackageCheck, ShieldCheck];
export default function App() {
  const [category, setCategory] = useState<"all" | Category>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState("");
  const cart = useCart();
  const count = cart.cart.reduce((s, i) => s + i.quantity, 0);
  const total = cartTotal(cart.cart);
  const cartRef = useRef(cart.cart);
  cartRef.current = cart.cart;
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          `${productName(p)} ${p.category === "podi" ? "podi powder" : ""}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [category, search],
  );
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("product");
    if (id && products.some((p) => p.id === id)) {
      setHighlighted(id);
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "center" }),
      );
    }
  }, []);
  useEffect(() => {
    type Tool = {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Tool) => {
      try {
        Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {
        /* UI remains available if browser tools are unsupported. */
      }
    };
    register({
      name: "get_pickle_menu",
      description:
        "Read the verified menu and available prices. Does not place an order.",
      inputSchema: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["all", "veg", "nonveg", "podi"] },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: (input) => {
        const c = (input as { category?: string })?.category ?? "all";
        if (!["all", "veg", "nonveg", "podi"].includes(c))
          throw new Error("Unknown category");
        return products.filter((p) => c === "all" || p.category === c);
      },
    });
    register({
      name: "read_current_order",
      description:
        "Read the current local cart, products total and delivery notice. Does not send an order.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => ({
        items: cartRef.current,
        productsTotal: cartTotal(cartRef.current),
        currency: business.currency,
        deliveryNotice: business.deliveryNotice,
      }),
    });
    return () => lifecycle.abort();
  }, []);
  function add(id: string, size: Size, n: number) {
    const existing =
      cart.cart.find((i) => i.productId === id && i.size === size)?.quantity ??
      0;
    if (existing + n > 99) {
      toast.info(
        "Up to 99 packs per size. Please discuss larger orders with us on WhatsApp.",
      );
      return;
    }
    cart.add(id, size, n);
    toast.success("Added to your order", {
      description: `${products.find((p) => p.id === id)?.name} · ${size} × ${n}`,
      action: { label: "View order", onClick: () => setOpen(true) },
    });
  }
  return (
    <>
      <a className="skip-link" href="#menu">
        Skip to menu
      </a>
      <div className="announcement">
        Homemade with love <span aria-hidden="true">✦</span> Authentic Andhra
        taste
      </div>
      <header className="site-header">
        <a href="#" aria-label="Satya Venkata Pickles home" className="brand">
          <span className="brand-monogram">SV</span>
          <span className="brand-wordmark">
            SATYA VENKATA<small>PICKLES</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#menu">The menu</a>
          <a href="#from-our-home">Our home</a>
          <a href="#special-orders">Special orders</a>
        </nav>
        <button
          id="open-order"
          className="header-cart"
          onClick={() => setOpen(true)}
          aria-label={`View order, ${count} items`}
        >
          <ShoppingBag size={19} />
          <span>Order</span>
          <b>{count}</b>
        </button>
      </header>
      <main>
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-rule" /> A little taste of home
            </p>
            <h1 id="hero-title">
              Authentic Andhra taste.
              <br />
              <em>Homemade with love.</em>
            </h1>
            <p className="hero-description">
              Pickles and podis. Familiar flavours.
              <br />
              The care of a homemade meal.
            </p>
            <div className="hero-actions">
              <a href="#menu" className="button primary">
                Explore the menu
              </a>
              <span>
                <MessageCircle size={17} /> Order on WhatsApp
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-frame">
              <img
                src="/assets/menu-brand.webp"
                width="545"
                height="470"
                alt="Original Satya Venkata Pickles brand artwork from the menu, with its illustrated portrait and pickle jars"
                fetchPriority="high"
              />
            </div>
            <span className="art-caption">
              PURE INGREDIENTS <span>·</span> TRADITIONAL TASTE
            </span>
          </div>
        </section>
        <div className="promise-strip">
          <span>
            <Leaf size={17} />
            Freshly prepared after order
          </span>
          <span>
            <Heart size={17} />
            Traditional homemade taste
          </span>
          <span>
            <PackageCheck size={17} />
            Hygienically prepared & packed
          </span>
        </div>
        <section
          className="menu-section wrap"
          id="menu"
          aria-labelledby="menu-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">From our kitchen</p>
              <h2 id="menu-title">Find your favourites.</h2>
            </div>
            <p>Pick your flavour. We’ll take care of the rest.</p>
          </div>
          <div className="menu-tools">
            <div
              className="category-filters"
              aria-label="Filter products by category"
            >
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  {c.label}
                  <span>
                    {c.id === "all"
                      ? products.length
                      : products.filter((p) => p.category === c.id).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="search-box">
              <Search size={18} />
              <label className="sr-only" htmlFor="search">
                Search the menu
              </label>
              <input
                id="search"
                type="search"
                placeholder="Find a flavour…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="icon-button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
          <div className="menu-meta">
            <span aria-live="polite">
              {filtered.length}{" "}
              {filtered.length === 1 ? "favourite" : "favourites"} to choose
              from
            </span>
            <span>Prices per pack · Delivery extra</span>
          </div>
          {filtered.length ? (
            <div className="product-grid">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={add}
                  highlighted={highlighted === p.id}
                />
              ))}
            </div>
          ) : (
            <Empty className="no-results">
              <Search size={30} />
              <EmptyTitle>No flavours found</EmptyTitle>
              <EmptyDescription>
                Try mango, chicken or podi — or explore the whole menu.
              </EmptyDescription>
              <button
                className="button outline"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
              >
                Show all products
              </button>
            </Empty>
          )}
          <p className="menu-bottom-note">
            <MessageCircle size={16} /> Have a question?{" "}
            <a
              href={whatsappUrl(
                `Hello ${business.name}, I have a question about the menu.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              We’re a WhatsApp message away.
            </a>
          </p>
        </section>
        <section className="why-section">
          <div className="wrap">
            <p className="eyebrow">The care behind every order</p>
            <h2>Good food. Thoughtfully made.</h2>
            <div className="claims-grid">
              {claims.map((claim, i) => {
                const Icon = claimIcons[i];
                return (
                  <div key={claim}>
                    <Icon size={27} strokeWidth={1.3} />
                    <h3>{claim}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section id="from-our-home" className="story wrap">
          <span className="story-mark" aria-hidden="true">
            SV
          </span>
          <div>
            <p className="eyebrow">From our home</p>
            <h2>
              There’s a little home
              <br />
              in every familiar flavour.
            </h2>
          </div>
          <div className="story-copy">
            <p>
              A mother’s recipes. The care of a family meal. That familiar,
              traditional taste.
            </p>
            <p>
              These are the simple things we celebrate — and the spirit of
              homemade food, shared beyond the home.
            </p>
            <span className="story-signature">Homemade with love.</span>
          </div>
        </section>
        <section className="special-section wrap" id="special-orders">
          <div className="special-inner">
            <div className="special-title">
              <Gift size={29} strokeWidth={1.3} />
              <p className="eyebrow">Made for sharing</p>
              <h2>Planning something special?</h2>
            </div>
            <div className="special-details">
              <p>Bring a little homemade warmth to your occasion.</p>
              <ul>
                {occasions.map((o) => (
                  <li key={o}>
                    <Check size={14} />
                    {o}
                  </li>
                ))}
              </ul>
              <a
                className="button special-button"
                href={specialOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={19} />
                Discuss a special order on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className={`site-footer ${count ? "has-order" : ""}`}>
        <div className="wrap footer-main">
          <div className="footer-brand">
            <p>SATYA VENKATA</p>
            <span>PICKLES</span>
            <small>
              Authentic Andhra taste.
              <br />
              Homemade with love.
            </small>
          </div>
          <div>
            <p className="eyebrow">Let’s talk food</p>
            <a
              href={whatsappUrl(
                `Hello ${business.name}!`,
                business.primaryWhatsApp,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} />
              {business.primaryPhoneDisplay}
            </a>
            <a
              href={whatsappUrl(
                `Hello ${business.name}!`,
                business.secondaryWhatsApp,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} />
              {business.secondaryPhoneDisplay}
            </a>
          </div>
          <div className="footer-delivery">
            <p className="eyebrow">A note on delivery</p>
            <p>{business.deliveryNotice}</p>
            <p>
              Confirm delivery and payment
              <br />
              with us on WhatsApp.
            </p>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>Satya Venkata Pickles</span>
          <span>Made with care. Shared with love.</span>
        </div>
      </footer>
      {count > 0 && !open && (
        <div className="sticky-order">
          <button
            onClick={() => setOpen(true)}
            aria-label={`View order, ${count} items, ${money(total)}`}
          >
            <span className="sticky-count">
              <ShoppingBag size={19} />
              <span>
                {count} {count === 1 ? "item" : "items"} <i>·</i>{" "}
                <strong>{money(total)}</strong>
              </span>
            </span>
            <span>
              View order <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      )}
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        cart={cart.cart}
        update={cart.update}
        clear={cart.clear}
        storageIssue={cart.storageIssue}
      />
      <Toaster
        position="top-center"
        duration={2500}
        theme="light"
        closeButton
        toastOptions={{ className: "brand-toast" }}
      />
    </>
  );
}
