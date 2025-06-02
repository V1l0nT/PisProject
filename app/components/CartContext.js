"use client";

import { createContext, useContext, useState } from "react";

/**
 * Контекст корзины для хранения состояния товаров и общей стоимости.
 */
export const CartContext = createContext();

/**
 * Провайдер контекста CartProvider оборачивает компоненты, которым нужен доступ к корзине.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - дочерние компоненты
 * @returns {JSX.Element} Провайдер контекста корзины
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  /**
   * Добавляет товар в корзину.
   * Если товар уже есть, увеличивает количество на 1.
   *
   * @param {Object} product - товар для добавления
   */
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        const updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        updateTotalCost(updatedCart);
        return updatedCart;
      } else {
        const updatedCart = [...prevCart, { ...product, quantity: 1 }];
        updateTotalCost(updatedCart);
        return updatedCart;
      }
    });
  };

  /**
   * Обновляет общую стоимость корзины.
   *
   * @param {Array} cartItems - текущие товары в корзине
   */
  const updateTotalCost = (cartItems) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalCost(total);
  };

  /**
   * Удаляет товар из корзины по его ID.
   *
   * @param {number|string} productId - ID товара для удаления
   */
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    updateTotalCost(updatedCart);
  };

  /**
   * Очищает корзину и сбрасывает общую стоимость.
   */
  const clearCart = () => {
    setCart([]);
    setTotalCost(0);
  };

  return (
    <CartContext.Provider
      value={{ cart, totalCost, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Хук для удобного доступа к состоянию корзины и методам управления.
 *
 * @returns {Object} Контекст корзины с состоянием и функциями
 */
export const useCart = () => {
  return useContext(CartContext);
};
