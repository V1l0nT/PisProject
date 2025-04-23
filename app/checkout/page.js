"use client";

import { useCart } from "../components/CartContext";
import { useRouter } from "next/navigation";
import styles from "./Checkout.module.css"; // Подключение стилей
import Cookies from "js-cookie"; // Импортируем библиотеку для работы с cookies

/**
 * Компонент CheckoutPage — страница оформления заказа.
 * Отображает список товаров в корзине, общую стоимость и кнопку подтверждения заказа.
 * При подтверждении отправляет заказ на сервер с авторизацией по JWT.
 *
 * @component
 * @returns {JSX.Element} Разметка страницы оформления заказа
 */
export default function CheckoutPage() {
  const { cart, totalCost, clearCart } = useCart();
  const router = useRouter();

  /**
   * Обработчик отправки заказа.
   * Проверяет наличие токена, отправляет данные заказа на сервер,
   * очищает корзину и перенаправляет на главную страницу при успехе.
   */
  const handleOrderSubmit = async () => {
    try {
      // Извлекаем токен из cookies
      const token = Cookies.get("auth_token");

      console.log("Токен:", token);

      if (!token) {
        alert("Пожалуйста, войдите в систему!");
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
        body: JSON.stringify({ cart, totalCost }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Заказ успешно оформлен! Номер заказа: " + data.orderId);
        clearCart();
        router.push("/"); // Перенаправление на главную страницу
      } else {
        const errorData = await response.json();
        alert("Ошибка: " + errorData.error);
      }
    } catch (error) {
      console.error("Ошибка отправки заказа:", error);
      alert("Не удалось оформить заказ");
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2 className={styles.checkoutTitle}>Оформление заказа</h2>
      {cart.map((item) => (
        <div key={item.id} className={styles.cartItem}>
          <div className={styles.cartItemDetails}>
            <p className={styles.cartItemName}>{item.name}</p>
            <p className={styles.cartItemPrice}>
              Количество: {item.quantity} | Цена: {item.price} ₽
            </p>
          </div>
          <p className={styles.cartItemPrice}>
            Общая стоимость: {item.price * item.quantity} ₽
          </p>
        </div>
      ))}
      <h3 className={styles.totalCost}>Общая стоимость: {totalCost} ₽</h3>
      <button onClick={handleOrderSubmit} className={styles.confirmButton}>
        Подтвердить заказ
      </button>
    </div>
  );
}
