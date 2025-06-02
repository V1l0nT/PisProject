"use client";

import React, { useEffect, useState } from "react";
import styles from "./account.module.css";

/**
 * Компонент Account отображает личную информацию пользователя и историю его заказов.
 * Загружает данные с сервера и предоставляет возможность просмотра деталей каждого заказа в модальном окне.
 *
 * @component
 * @returns {JSX.Element} Разметка страницы аккаунта пользователя.
 */
export default function Account() {
  /** @type {Object|null} */
  const [userData, setUserData] = useState(null);
  /** @type {Array<Object>} */
  const [orders, setOrders] = useState([]);
  /** @type {boolean} */
  const [loading, setLoading] = useState(true);
  /** @type {boolean} */
  const [modalOpen, setModalOpen] = useState(false);
  /** @type {Object|null} */
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    /**
     * Асинхронная функция для получения данных аккаунта пользователя с сервера.
     * Загружает данные пользователя и заказы, обновляет состояние компонента.
     */
    async function fetchAccountData() {
      try {
        const response = await fetch("/api/account?userId=6");
        if (!response.ok) {
          throw new Error("Failed to fetch account data");
        }
        const data = await response.json();
        setUserData(data.user);
        setOrders(data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAccountData();
  }, []);

  /**
   * Открывает модальное окно с деталями выбранного заказа.
   * @param {Object} order - Заказ, который необходимо отобразить.
   */
  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  /**
   * Закрывает модальное окно и сбрасывает выбранный заказ.
   */
  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!userData) {
    return <div>Ошибка загрузки данных. Попробуйте снова.</div>;
  }

  return (
    <div className={styles.accountContainer}>
      <div className={styles.userInfo}>
        <h2>Личная информация</h2>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <img src="https://via.placeholder.com/150" alt="Avatar" />
          </div>
          <div className={styles.details}>
            <h3>
              {userData.firstname} {userData.lastname}
            </h3>
            <p>
              <strong>Имя пользователя:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email || "Не указан"}
            </p>
            <p>
              <strong>Телефон:</strong> {userData.phone}
            </p>
            <p>
              <strong>Компания:</strong> {userData.company || "Не указана"}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.orderHistory}>
        <h2>История заказов</h2>
        {orders.length === 0 ? (
          <p>У вас пока нет заказов.</p>
        ) : (
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Сумма</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{order.order_status}</td>
                  <td>{order.total_cost} ₽</td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => openModal(order)}
                    >
                      Смотреть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
