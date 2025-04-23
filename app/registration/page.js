"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

/**
 * Компонент Registration — форма регистрации нового пользователя.
 * Позволяет ввести основные данные, имя пользователя, email (необязательно), телефон,
 * компанию и пароль. Отправляет данные на сервер для регистрации.
 *
 * @component
 * @returns {JSX.Element} Разметка страницы регистрации
 */
export default function Registration() {
  /** @type {Object} formData - состояние данных формы */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "", // Это поле для ввода имени пользователя
    email: "", // Поле для email, теперь оно необязательное
    phone: "",
    company: "",
    password: "",
  });

  /**
   * Обработчик изменения значений в форме.
   * Обновляет состояние formData при изменении любого поля формы.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - событие изменения input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Обработчик отправки формы.
   * Отправляет данные формы на сервер для регистрации.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - событие отправки формы
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data:", formData);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      return;
    }

    const result = await response.json();
    console.log("User registered:", result);
  };

  return (
    <div className={styles.registrationContainer}>
      <h1 className={styles.header}>Регистрация</h1>
      <p className={styles.textCenter}>
        Если вы уже зарегистрированы, перейдите на страницу{" "}
        <Link href="/">авторизации</Link>.
      </p>
      <form onSubmit={handleSubmit} id="f">
        <h2 className={styles.subHeader}>Основные данные</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Имя</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Фамилия</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Имя пользователя</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField} // Убираем 'required'
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <h2 className={styles.subHeader}>Дополнительно</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Компания</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitButton}>
            Продолжить
          </button>
        </div>
      </form>

      <p className={styles.textCenter}>
        Если у вас есть вопросы, обратитесь к нам.
      </p>
    </div>
  );
}
