import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const dir = mkdtempSync(join(tmpdir(), "svp-tests-"));
const compiled = spawnSync(
  process.execPath,
  [
    "node_modules/typescript/bin/tsc",
    "src/utils/order.ts",
    "--outDir",
    dir,
    "--module",
    "commonjs",
    "--target",
    "ES2022",
    "--skipLibCheck",
  ],
  { encoding: "utf8" },
);
assert.equal(compiled.status, 0, compiled.stdout + compiled.stderr);
const require = createRequire(import.meta.url);
const { products } = require(join(dir, "data/products.js"));
const o = require(join(dir, "utils/order.js"));
const { business } = require(join(dir, "config/business.js"));
let passed = 0;
function check(label, fn) {
  fn();
  passed++;
  console.log("PASS " + label);
}
const expected = [
  ["mango-pickle", [180]],
  ["coriander-pickle", [150]],
  ["mint-pickle", [150]],
  ["curry-leaf-pickle", [150]],
  ["gongura-pickle", [150]],
  ["ginger-pickle", [150]],
  ["tomato-pickle", [150]],
  ["lemon-pickle", [150]],
  ["amla-pickle", [200]],
  ["garlic-pickle", [200]],
  ["sweet-mango-pickle", [150]],
  ["chicken-pickle", [250, 500, 1000]],
  ["boneless-chicken-pickle", [300, 600, 1200]],
  ["small-prawns-pickle", [300, 600, 1200]],
  ["big-prawns-pickle", [350, 700, 1400]],
  ["mutton-pickle", [450, 900, 1800]],
  ["gongura-chicken-pickle", [250, 500, 1000]],
  ["curry-leaf-podi", [150]],
  ["bitter-gourd-podi", [150]],
  ["idli-podi", [150]],
  ["kandi-podi", [150]],
  ["rasam-podi", [250]],
  ["ground-nut-podi", [150]],
  ["vellulli-karam", [200]],
];
check("24 unique products, 11 veg / 6 non-veg / 7 podis", () => {
  assert.equal(products.length, 24);
  assert.equal(new Set(products.map((p) => p.id)).size, 24);
  assert.deepEqual(
    ["veg", "nonveg", "podi"].map(
      (c) => products.filter((p) => p.category === c).length,
    ),
    [11, 6, 7],
  );
});
for (const [id, prices] of expected)
  check(id + " exact menu prices and sizes", () => {
    const p = products.find((p) => p.id === id);
    assert.deepEqual(
      p.variants.map((v) => v.price),
      prices,
    );
    assert.deepEqual(
      p.variants.map((v) => v.size),
      prices.length === 1 ? ["250g"] : ["250g", "500g", "1kg"],
    );
  });
check("36 variants calculate exact subtotals at quantity 3", () => {
  assert.equal(products.flatMap((p) => p.variants).length, 36);
  for (const p of products)
    for (const v of p.variants)
      assert.equal(
        o.getLine({ productId: p.id, size: v.size, quantity: 3 }).subtotal,
        v.price * 3,
      );
});
const cart = [
  { productId: "mango-pickle", size: "250g", quantity: 2 },
  { productId: "boneless-chicken-pickle", size: "500g", quantity: 1 },
  { productId: "idli-podi", size: "250g", quantity: 1 },
];
const customer = {
  name: "QA Test",
  phone: "+91 98765 43210",
  area: "Test & Area",
  city: "Visakhapatnam",
  notes: "Call first. తెలుగు 🌶️ #1 + okay?",
};
check("sample cart total is exactly 1110", () =>
  assert.equal(o.cartTotal(cart), 1110),
);
check("empty cart totals zero and cannot generate an order", () => {
  assert.equal(o.cartTotal([]), 0);
  assert.throws(() => o.orderSummary([], customer));
});
check(
  "unknown products, invalid sizes, negative/fractional quantities are discarded",
  () => {
    assert.deepEqual(
      o.sanitizeCart([
        null,
        { productId: "unknown", size: "250g", quantity: 1 },
        { productId: "mango-pickle", size: "500g", quantity: 1 },
        { ...cart[0], quantity: -1 },
        { ...cart[0], quantity: 1.5 },
      ]),
      [],
    );
    assert.deepEqual(o.sanitizeCart({}), []);
  },
);
check("duplicates merge, quantities capped, stored prices ignored", () => {
  const clean = o.sanitizeCart([
    { ...cart[0], price: 1 },
    { ...cart[0], quantity: 10000 },
  ]);
  assert.deepEqual(clean, [
    { productId: "mango-pickle", size: "250g", quantity: 99 },
  ]);
  assert.equal(o.cartTotal(clean), 17820);
});
check("round-trip cart persistence preserves size and quantity", () =>
  assert.deepEqual(o.sanitizeCart(JSON.parse(JSON.stringify(cart))), cart),
);
check("name and Indian phone validation", () => {
  assert.deepEqual(o.validateCustomer(customer), {});
  assert.equal(
    Object.keys(o.validateCustomer({ ...customer, name: "  ", phone: "123" }))
      .length,
    2,
  );
  assert.equal(o.normalizePhone("919876543210"), "9876543210");
  assert.equal(o.normalizePhone("5876543210"), null);
  assert.equal(o.normalizePhone("98765abc10"), null);
});
check("full dynamic summary and optional fields", () => {
  const m = o.orderSummary(cart, customer);
  assert.ok(m.includes("Mango Pickle — 250g × 2 — ₹360"));
  assert.ok(m.includes("Boneless Chicken Pickle — 500g × 1 — ₹600"));
  assert.ok(m.includes("Idli Podi — 250g × 1 — ₹150"));
  assert.ok(m.includes("Products Total: ₹1,110"));
  assert.ok(m.includes("Phone: 9876543210"));
  assert.ok(m.includes(business.deliveryNotice));
  const basic = o.orderSummary(cart, {
    ...customer,
    area: "",
    city: "",
    notes: "",
  });
  assert.ok(!basic.includes("Area:"));
  assert.ok(!basic.includes("City:"));
  assert.ok(!basic.includes("Notes:"));
});
check("WhatsApp URL and Unicode encoding round-trip", () => {
  const m = o.orderSummary(cart, customer);
  const raw = o.whatsappUrl(m);
  const url = new URL(raw);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/919908116937");
  assert.equal(url.searchParams.get("text"), m);
  assert.ok(!raw.includes("\n"));
  assert.ok(raw.includes("%E2%82%B9"));
  assert.ok(raw.includes("%26"));
});
check("second number and separate special-order message", () => {
  assert.equal(
    new URL(o.whatsappUrl("Hello", business.secondaryWhatsApp)).pathname,
    "/919908935118",
  );
  const m = new URL(o.specialOrderUrl).searchParams.get("text");
  for (const label of [
    "Occasion:",
    "Approximate quantity:",
    "Required date:",
    "Location:",
  ])
    assert.ok(m.includes(label));
  assert.ok(!m.includes("Products Total"));
});
console.log(`\n${passed} checks passed.`);
rmSync(dir, { recursive: true, force: true });
