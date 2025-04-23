"use client";

import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";
import UploadProductForm from "../components/UploadProductForm";

/**
 * Компонент AdminPage предоставляет административную панель для управления пользователями и заказами.
 * Позволяет авторизоваться по паролю, просматривать список пользователей и заказов,
 * верифицировать пользователей и просматривать детали заказов.
 *
 * @component
 * @returns {JSX.Element} Разметка страницы админки.
 */
export default function AdminPage() {
  /** @type {Array<Object>} */
  const [users, setUsers] = useState([]);
  /** @type {Array<Object>} */
  const [orders, setOrders] = useState([]);
  /** @type {Object|null} */
  const [selectedOrder, setSelectedOrder] = useState(null);
  /** @type {string} */
  const [password, setPassword] = useState("");
  /** @type {boolean} */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  /** @type {string} */
  const [error, setError] = useState("");

  /**
   * Обработчик формы входа.
   * Проверяет введённый пароль и устанавливает статус авторизации.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - событие отправки формы
   */
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin") {
      // TODO: заменить на безопасную авторизацию
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Неверный пароль");
    }
  };

  /**
   * Загружает список пользователей с сервера при монтировании компонента.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
      }
    };

    fetchUsers();
  }, []);

  /**
   * Загружает список заказов с сервера при монтировании компонента.
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders");
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Ошибка при получении заказов:", error);
      }
    };

    fetchOrders();
  }, []);

  /**
   * Отправляет запрос на верификацию пользователя по ID.
   * Обновляет состояние пользователей после успешной верификации.
   *
   * @param {number|string} id - ID пользователя для верификации
   */
  const handleVerify = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Ошибка верификации: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      alert("Пользователь успешно верифицирован!");
    } catch (error) {
      console.error(error);
      alert(`Ошибка при верификации: ${error.message}`);
    }
  };

  /**
   * Открывает модальное окно с деталями выбранного заказа.
   *
   * @param {Object} order - Заказ для просмотра
   */
  const openOrderDetails = (order) => setSelectedOrder(order);

  /**
   * Закрывает модальное окно с деталями заказа.
   */
  const closeOrderDetails = () => setSelectedOrder(null);

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <h2>Введите пароль для доступа в админку</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />
          <button type="submit">Войти</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.header}>Админка</h1>
      <h2 className={styles.subHeader}>Список пользователей</h2>

      {/* Форма для загрузки Excel с товарами */}
      <UploadProductForm />

      {/* Таблица пользователей */}
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя пользователя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Компания</th>
            <th>Должность</th>
            <th>Статус активации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email || "Не указан"}</td>
              <td>{user.phone || "Не указан"}</td>
              <td>{user.company || "Не указана"}</td>
              <td>{user.position || "Не указана"}</td>
              <td>{user.isactivated ? "Активен" : "Неактивен"}</td>
              <td>
                {!user.isactivated ? (
                  <button onClick={() => handleVerify(user.id)}>
                    Верифицировать
                  </button>
                ) : (
                  <p>Верифицирован</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.subHeader}>Список заказов</h2>

      {/* Таблица заказов */}
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>№ Заказа</th>
            <th>Заказчик</th>
            <th>Товары</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.customer_name}</td>
              <td>{order.items.length} товаров</td>
              <td>{order.total_cost} TJS</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>{order.status}</td>
              <td>
                <button
                  onClick={() => openOrderDetails(order)}
                  className={styles.showMoreButton}
                >
                  Просмотр
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно с деталями заказа */}
      {selectedOrder && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Товары в заказе №{selectedOrder.order_id}</h3>
            <ul>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.category} {item.name} ({item.quantity} x{" "}
                    {item.volume || "не указано"} {item.unit || ""})
                  </li>
                ))
              ) : (
                <p>Товары отсутствуют.</p>
              )}
            </ul>
            <button onClick={closeOrderDetails} className={styles.closeButton}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
