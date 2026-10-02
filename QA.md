# Verification record

## Verified

- Visually compared the supplied menu with the transcription; no product, weight, price, phone or delivery discrepancy found.
- 35 automated checks pass, including every product's expected price list, 36 variants, arithmetic, malformed saved carts, duplicate entries, unknown sizes, phone validation, optional fields and Unicode URL encoding.
- Production TypeScript checking and Vite compilation pass.
- Rendered in Chromium: desktop plus 320, 360, 390, 430, 768 and 1024px viewport widths. Responsive harness uses same-origin iframes, not a physical Android device.
- No document horizontal overflow at those widths. Checkout drawer is exactly viewport width and height on all four mobile widths; content scrolls inside it.
- Category results: 11 veg, 6 non-veg, 7 podis, 24 all. Search for gongura returns two products. Unknown searches show a useful empty state; reset works.
- Added 250g mango, 500g and 1kg boneless chicken, and idli podi. Verified size-specific rows, quantity increases/decreases, removal, clear order and empty cart.
- Reloaded the page and verified the cart persisted.
- Sample order: mango 250g ×2 = ₹360; boneless chicken 500g ×1 = ₹600; idli podi 250g ×1 = ₹150; total ₹1,110.
- Empty name / invalid phone show errors. Valid fields produce a complete dynamic message.
- Copied the live order and read it back from the browser clipboard, including quantities, total, name, phone, area, city and notes.
- Clicked the actual WhatsApp checkout in a local capture harness. Verified `https://wa.me/919908116937?text=...`, newlines, rupees, emoji and ampersand encoding. No test order was sent to the business.
- The `?product=mango-pickle` reorder link highlights and scrolls to the correct card.
- No application console warnings or errors were observed; browser-extension metadata errors were excluded.
- Escape closes the drawer; dialog focus is managed and restored to the order button. Enlarged-text overflow was found and corrected.

## Limits

- WhatsApp account reception, actual delivery, stock and payment handling require the business and customer; no message delivery is claimed.
- Physical Android/iOS devices and their keyboards were not available. Responsive browser viewport checks were performed.
- The browser did not expose the optional WebMCP tools; their live registration could not be tested. They do not affect the storefront or checkout.
