# Project overview

Satya Venkata Pickles is a static React + TypeScript + Vite storefront with 24 products and 36 exact menu size/price variants.

## Included

- Full source, package manifest and dependency lockfile
- Original supplied menu and extracted brand artwork
- Verified mobile screenshot and QA report
- 35 automated checks and responsive browser test harness
- Netlify and Vercel deployment configuration
- A ready-to-host ZIP of the verified production build in `deploy/`

## Data and behavior

`src/data/products.ts` is the single product/price source. `src/config/business.ts` contains the business identity, phone numbers, currency and delivery wording. Product and size combinations are independent cart lines. The browser stores only the cart; customer details stay in memory until included in the WhatsApp message. The customer must press Send in WhatsApp. Delivery charges are additional. No online payment or order-confirmation service exists.

## Preservation

The source was exported from verified Sites commit `9929cd88a8984b4a7ae372082b8cb185635d0354`. Its original hosting identity remains in `.openai/hosting.json`. GitHub documentation adds the live link, original menu and downloadable static build without changing the application.

Local dependencies, caches, credentials and customer data are excluded.
