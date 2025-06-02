import { useState } from "react";
import { useCart } from "./CartContext";
import styles from "./ProductCard.module.css";

/**
 * Компонент ProductCard отображает информацию о товаре и позволяет добавлять его в корзину.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.product - объект с данными о товаре
 * @returns {JSX.Element} Разметка карточки товара
 */
export default function ProductCard({ product }) {
  // Количество товара для добавления в корзину
  /** @type {number} */
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (quantity < 1) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
  };

  return (
    <div className={styles.productListItem}>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productCategory}>Категория: {product.category}</p>
        <p className={styles.productVolume}>
          Объем: {product.volume} {product.unit}
        </p>
        <p className={styles.productPrice}>Цена: {product.price} ₽</p>
      </div>
      <div className={styles.controls}>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className={styles.quantityInput}
        />
        <button className={styles.addToCart} onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </div>
  );
}
