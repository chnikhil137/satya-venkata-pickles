import { useState } from "react";
import { Plus, Check } from "lucide-react";
import {
  categories,
  productName,
  type Product,
  type Size,
} from "../data/products";
import { money } from "../utils/order";
import { Quantity } from "./Quantity";
export function ProductCard({
  product,
  onAdd,
  highlighted,
}: {
  product: Product;
  onAdd: (id: string, size: Size, n: number) => void;
  highlighted: boolean;
}) {
  const [size, setSize] = useState<Size>(product.variants[0].size);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const price = product.variants.find((v) => v.size === size)!.price;
  const name = productName(product);
  return (
    <article
      tabIndex={-1}
      id={product.id}
      className={`product-card ${product.category}${highlighted ? " highlighted" : ""}`}
      aria-label={name}
    >
      <div className="product-category">
        <span
          className={`food-mark ${product.category === "nonveg" ? "nonveg" : ""}`}
          aria-hidden="true"
        />
        {categories.find((c) => c.id === product.category)?.short}
      </div>
      <div className="product-heading">
        <h3>{product.name}</h3>
        {product.detail && <p>{product.detail}</p>}
      </div>
      <div className="product-selection">
        <div className="sizes" role="group" aria-label={`${name} size`}>
          {product.variants.map((v) => (
            <button
              key={v.size}
              type="button"
              aria-pressed={size === v.size}
              onClick={() => {
                setSize(v.size);
                setAdded(false);
              }}
            >
              {v.size}
            </button>
          ))}
        </div>
        <span className="price">
          {money(price)}
          <small> / pack</small>
        </span>
      </div>
      <div className="product-bottom">
        <Quantity value={quantity} onChange={setQuantity} label={name} />
        <button
          className={`add-button ${added ? "added" : ""}`}
          aria-label={`Add ${name}, ${size} to order`}
          onClick={() => {
            onAdd(product.id, size, quantity);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1500);
          }}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}{" "}
          {added ? "Added" : "Add"}
        </button>
      </div>
    </article>
  );
}
