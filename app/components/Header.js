"use client"; // Указание, что компонент клиентский
import "@fortawesome/fontawesome-free/css/all.css";
import styles from "./Header.css";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // Импортируем usePathname
import { useCart } from "./CartContext";
import Cookies from "js-cookie"; // Импортируем библиотеку для работы с cookies

/**
 * Компонент Header - шапка сайта, содержащая логотип, каталог, поиск,
 * кнопки авторизации/личного кабинета, избранного, корзины и меню навигации.
 * Обеспечивает функциональность поиска, входа/выхода из аккаунта и отображение уведомлений.
 *
 * @component
 * @returns {JSX.Element} Разметка шапки сайта
 */
const Header = () => {
  const pathname = usePathname(); // Получаем текущий маршрут
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notification, setNotification] = useState(null);
  const { cart, totalCost } = useCart();
  const modalRef = useRef(null); // Реф для модального окна

  const token = Cookies.get("auth_token");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  /**
   * Обработчик отправки формы поиска.
   * Выполняет запрос к API и обновляет результаты поиска.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - событие отправки формы
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/products/search?search=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data);
      } else {
        setNotification({
          type: "error",
          message: data.error || "Не удалось выполнить поиск",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Ошибка сети. Проверьте соединение.",
      });
      console.error("Search error:", error);
    }
  };

  /**
   * Обработчик выхода из аккаунта.
   * Отправляет запрос на сервер и обновляет состояние авторизации.
   *
   * @async
   */
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        setIsLoggedIn(false);
        setNotification({ type: "success", message: "Вы успешно вышли." });
      } else {
        setNotification({
          type: "error",
          message: "Не удалось выйти из аккаунта.",
        });
      }
    } catch (error) {
      setNotification({ type: "error", message: "Ошибка сети при выходе." });
      console.error("Logout error:", error);
    }
  };

  /**
   * Обработчик клика на ссылку "Войти".
   * Открывает форму входа.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - событие клика
   */
  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginForm(true);
  };

  /**
   * Обработчик закрытия формы входа.
   */
  const handleClose = () => {
    setShowLoginForm(false);
  };

  /**
   * Переключает состояние мобильного меню.
   */
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  /**
   * Обработчик отправки формы входа.
   * Отправляет данные на сервер и обрабатывает ответ.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - событие отправки формы
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotification({
          type: "success",
          message: "Успешный вход. Добро пожаловать!",
        });
        console.log("Login successful:", data);
        setIsLoggedIn(true);
      } else {
        setNotification({
          type: "error",
          message: data.error || "Не удалось войти",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Ошибка сети. Проверьте соединение и попробуйте снова.",
      });
      console.error("Network error:", error);
    }

    setShowLoginForm(false);
  };

  /**
   * Обработчик кликов вне модального окна.
   * Закрывает форму входа при клике вне её.
   *
   * @param {MouseEvent} event - событие клика
   */
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowLoginForm(false);
    }
  };

  // Добавляем и удаляем обработчик кликов вне модального окна при изменении showLoginForm
  useEffect(() => {
    if (showLoginForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLoginForm]);

  /**
   * Закрывает уведомление.
   */
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="headerNavig">
      <header className="header">
        <div className="headerLogo">
          <Link href="/">1001may LOGO</Link>
        </div>
        <div className="headerKatalog">Каталог</div>
        <div className="headerSearch">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Искать..."
              className="searchInput"
            />
            <Link
              href={`/search?search=${searchTerm}`}
              passHref
              legacyBehavior
            >
              <button type="submit" className="searchButton">
                Поиск
              </button>
            </Link>
          </form>
        </div>
        <div className="searchResults">
          {searchResults.length > 0 && (
            <ul>
              {searchResults.map((product) => (
                <li key={product.id}>
                  {product.name} — {product.price} ₽
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="headerButtons">
          {!isLoggedIn && pathname !== "/registration" && !showLoginForm && (
            <a
              href="#"
              onClick={handleLoginClick}
              className={`${styles.iUserHeader} ${styles.headerNavItem}`}
            >
              <i className="fa fa-user"></i> {/* Иконка пользователя */}
              <span className={styles.headerNavItemText}>Войти</span>
            </a>
          )}

          {isLoggedIn && (
            <Link
              href="/account"
              className={`${styles.iUserHeader} ${styles.headerNavItem}`}
            >
              <i className="fa fa-user"></i> {/* Иконка пользователя */}
              <span className={styles.headerNavItemText}>Личный кабинет</span>
            </Link>
          )}

          <a
            href="#"
            className={`${styles.iFavoriteHeader} ${styles.headerNavItem}`}
          >
            <i className="fa fa-heart"></i> {/* Иконка сердца */}
            <span className={styles.headerNavItemText}>Избранное</span>
          </a>
          <Link
            href="/cart"
            className={`${styles.iCartHeader} ${styles.headerNavItem}`}
          >
            <i className="fa fa-shopping-cart"></i> {/* Иконка корзины */}
            <span className={styles.headerNavItemText}>
              Корзина ({cart.length}): {totalCost} TJS
            </span>
          </Link>
          {isLoggedIn && (
            <a
              href="#"
              onClick={handleLogout}
              className={`${styles.iUserHeader} ${styles.headerNavItem}`}
            >
              <i className="fa fa-sign-out-alt"></i> {/* Иконка выхода */}
              <span className={styles.headerNavItemText}>Выйти</span>
            </a>
          )}
        </div>
        {showLoginForm && (
          <div className="modal">
            <div className="modal-content" ref={modalRef}>
              <div className="login-box">
                <span className="close" onClick={handleClose}>
                  &times;
                </span>
                <h2>Вход</h2>
                <form onSubmit={handleSubmit}>
                  <div className="user-box">
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <label>Логин</label>
                  </div>
                  <div className="user-box">
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label>Пароль</label>
                  </div>
                  <Link href="/registration" passHref legacyBehavior>
                    <div className="registration" onClick={handleClose}>
                      Создать аккаунт
                    </div>
                  </Link>
                  <button type="submit" className="login-button">
                    Войти
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {notification && (
          <div className={`notification ${notification.type}`}>
            <div className="notification-content">
              <p>{notification.message}</p>
              <button
                onClick={closeNotification}
                className="close-notification"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </header>
      <nav>
        <div className="navigationWrapper">
          <ul className="navigation">
            <li className="navItem">
              <Link
                href="/allProducts?category=Соки"
                className={styles.navItem}
              >
                Соки
              </Link>
            </li>
            <li className="navItem">
              <Link
                href="/allProducts?category=Вода"
                className={styles.navItem}
              >
                Вода
              </Link>
            </li>
            <li className="navItem">
              <Link
                href="/allProducts?category=Энергетики"
                className={styles.navItem}
              >
                Энергетики
              </Link>
            </li>
            <li className="navItem">
              <Link
                href="/allProducts?category=Спортивные напитки"
                className={styles.navItem}
              >
                Спортивные напитки
              </Link>
            </li>
            <li className="navItem">
              <Link
                href="/allProducts?category=Чай"
                className={styles.navItem}
              >
                Чай
              </Link>
            </li>
            <li className="navItem">
              <Link
                href="/allProducts?category=Газировки"
                className={styles.navItem}
              >
                Газировки
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
