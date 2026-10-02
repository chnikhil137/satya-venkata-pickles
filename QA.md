# Verification record

## Verified

- Visually compared the supplied menu (`docs/original-menu.jpg`) with the transcription; all 24 products, 36 variants, prices, weights, phone numbers, and delivery notices remain exact and unmodified.
- Cohesive premium regional food brand design system implemented:
  - Warm parchment backgrounds (`#fdfbf7`, `#f7f3eb`, `#ece4d4`), deep leaf green (`#173f31`, `#1e4d3d`), restrained chilli/burgundy (`#9e2a2b`), refined warm gold accents (`#c59b27`), and dark charcoal typography (`#212529`).
  - Sophisticated typography pairing: *Playfair Display* for serif headings and brand accents, and *Inter* for crisp, modern body text, badges, and numerals.
  - Thoughtful integration of authentic menu artwork (`public/assets/menu-brand.webp`) preserving the original illustrated portrait with dignified circular framing and gold border accent.
  - Compact, compelling mobile-first hero screen with quick badges, immediate action buttons, sticky mobile order bar with safe-area support, and responsive drawer navigation.
  - Micro-interactions with restrained CSS transitions and full `@media (prefers-reduced-motion: reduce)` accessibility support.
- 35 automated checks pass (`node tests/order.test.mjs`), including every product's expected price list, 36 variants, arithmetic, malformed saved carts, duplicate entries, unknown sizes, phone validation, optional fields, and Unicode WhatsApp URL encoding.
- Production TypeScript check (`tsc --noEmit -p tsconfig.app.json`) and Vite compilation (`vite build`) pass cleanly with 0 errors.
- Rendered and verified in Chromium:
  - Desktop (1280×900, 1024×768)
  - Mobile widths (320px, 360px, 390px, 430px)
  - Screenshots saved to repository:
    - `docs/redesign-mobile-hero.png` (Mobile hero at 390px)
    - `docs/redesign-desktop-hero.png` (Desktop hero at 1280px)
    - `docs/redesign-desktop-menu.png` (Desktop category filters and product cards)
- No horizontal document overflow at any tested viewport.
- Category filters work instantaneously: 11 veg, 6 non-veg, 7 podis, 24 all.
- Search works instantaneously; Gongura returns both Gongura Pickle and Gongura Chicken Pickle; unknown query yields graceful empty state with a reset filter button.
- Cart drawer:
  - Smooth opening/closing with focus management, backdrop blur, and escape key listener.
  - Size-specific lines: 250g mango pickle, 500g and 1kg boneless chicken pickle, and 250g idli podi operate as distinct cart lines.
  - Quantity increment, decrement, line removal, and complete cart clear function correctly.
  - Cart state persists accurately across page reloads via `localStorage`.
- Verified mathematical acceptance calculation:
  - Mango 250g × 2 = ₹360
  - Boneless Chicken 500g × 1 = ₹600
  - Idli Podi 250g × 1 = ₹150
  - Product Subtotal = ₹1,110 (exact match).
- Checkout validation:
  - Name and Indian 10-digit mobile number properly validated.
  - Optional fields (Area, City, Notes) correctly included when populated.
  - Generated WhatsApp URL targets primary number `919908116937` with properly encoded multi-line text, rupee symbols, and emoji.
  - Secondary number `919908935118` available and verified in business config.
  - Copy summary clipboard function works with resilient fallback.
- Deep linking: `?product=mango-pickle` automatically scrolls to and highlights the target card. Unknown product parameters fall back gracefully to the standard menu.

## Limits

- WhatsApp message sending, actual dispatch, stock management, and payment processing are handled between the business and customer over WhatsApp; the web client generates the pre-filled message but does not communicate with any external backend.
- Physical Android/iOS devices and varied hardware keyboards were simulated using standard viewport widths and emulation; native browser safe-area insets are respected via CSS environment variables (`env(safe-area-inset-bottom)`).
- WebMCP read tools are progressively registered when supported by the client browser; ordinary browsers utilize the complete responsive visual interface.
