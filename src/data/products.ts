export type Category = "veg" | "nonveg" | "podi";
export type Size = "250g" | "500g" | "1kg";
export type Product = {
  id: string;
  name: string;
  category: Category;
  detail?: string;
  variants: { size: Size; price: number }[];
};
export const categories: {
  id: "all" | Category;
  label: string;
  short: string;
}[] = [
  { id: "all", label: "All", short: "All" },
  { id: "veg", label: "Veg Pickles", short: "Veg pickle" },
  { id: "nonveg", label: "Non-Veg Pickles", short: "Non-veg pickle" },
  { id: "podi", label: "Podis / Powders", short: "Podi / powder" },
];
// Verified against the supplied menu. All amounts are INR; delivery is extra.
export const products: Product[] = [
  {
    id: "mango-pickle",
    name: "Mango Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 180 }],
  },
  {
    id: "coriander-pickle",
    name: "Coriander Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "mint-pickle",
    name: "Mint Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "curry-leaf-pickle",
    name: "Curry Leaf Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "gongura-pickle",
    name: "Gongura Pickle",
    detail: "Roselle leaves",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "ginger-pickle",
    name: "Ginger Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "tomato-pickle",
    name: "Tomato Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "lemon-pickle",
    name: "Lemon Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "amla-pickle",
    name: "Amla Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 200 }],
  },
  {
    id: "garlic-pickle",
    name: "Garlic Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 200 }],
  },
  {
    id: "sweet-mango-pickle",
    name: "Sweet Mango Pickle",
    category: "veg",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "chicken-pickle",
    name: "Chicken Pickle",
    category: "nonveg",
    variants: [
      { size: "250g", price: 250 },
      { size: "500g", price: 500 },
      { size: "1kg", price: 1000 },
    ],
  },
  {
    id: "boneless-chicken-pickle",
    name: "Boneless Chicken Pickle",
    category: "nonveg",
    variants: [
      { size: "250g", price: 300 },
      { size: "500g", price: 600 },
      { size: "1kg", price: 1200 },
    ],
  },
  {
    id: "small-prawns-pickle",
    name: "Prawns Pickle",
    detail: "Small Prawns",
    category: "nonveg",
    variants: [
      { size: "250g", price: 300 },
      { size: "500g", price: 600 },
      { size: "1kg", price: 1200 },
    ],
  },
  {
    id: "big-prawns-pickle",
    name: "Prawns Pickle",
    detail: "Big Size Prawns",
    category: "nonveg",
    variants: [
      { size: "250g", price: 350 },
      { size: "500g", price: 700 },
      { size: "1kg", price: 1400 },
    ],
  },
  {
    id: "mutton-pickle",
    name: "Mutton Pickle",
    category: "nonveg",
    variants: [
      { size: "250g", price: 450 },
      { size: "500g", price: 900 },
      { size: "1kg", price: 1800 },
    ],
  },
  {
    id: "gongura-chicken-pickle",
    name: "Gongura Chicken Pickle",
    category: "nonveg",
    variants: [
      { size: "250g", price: 250 },
      { size: "500g", price: 500 },
      { size: "1kg", price: 1000 },
    ],
  },
  {
    id: "curry-leaf-podi",
    name: "Curry Leaf Podi",
    category: "podi",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "bitter-gourd-podi",
    name: "Bitter Gourd Podi",
    category: "podi",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "idli-podi",
    name: "Idli Podi",
    category: "podi",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "kandi-podi",
    name: "Kandi Podi",
    category: "podi",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "rasam-podi",
    name: "Rasam Podi",
    category: "podi",
    variants: [{ size: "250g", price: 250 }],
  },
  {
    id: "ground-nut-podi",
    name: "Ground Nut (Palli) Podi",
    category: "podi",
    variants: [{ size: "250g", price: 150 }],
  },
  {
    id: "vellulli-karam",
    name: "Vellulli Karam",
    category: "podi",
    variants: [{ size: "250g", price: 200 }],
  },
];
export const productName = (p: Product) =>
  p.detail ? `${p.name} (${p.detail})` : p.name;
