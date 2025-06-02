"use client";

import { useCart } from "./CartContext";
import styles from "./Cart.module.css";
import Link from "next/link";

/**
 * Компонент Cart отображает содержимое корзины, позволяет удалять товары и перейти к оформлению заказа.
 *
 * @component
 * @returns {JSX.Element} Разметка корзины
 */
const Cart = () => {
  const { cart, removeFromCart, totalCost } = useCart(); // Получаем корзину, функцию удаления и общую стоимость

  return (
    <div className={styles.cartContainer}>
      <h2>Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div className={styles.cartItems}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img src={"https://via.placeholder.com/150"} alt={item.name} />
              <div className={styles.cartItemDetails}>
                <p>{item.name}</p>
                <p>Цена: {item.price} ₽</p>
                <p>Количество: {item.quantity}</p>
                <p>Общая стоимость: {item.price * item.quantity} ₽</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                  aria-label={`Удалить ${item.name} из корзины`}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          <div className={styles.totalCost}>
            <p>Общая стоимость: {totalCost} ₽</p>
          </div>
          <div className={styles.checkoutButton}>
            <Link href="/checkout" passHref>
              <button className={styles.orderButton}>Оформить заказ</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
