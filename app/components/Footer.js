import styles from "./Footer.module.css";

/**
 * Компонент Footer отображает нижний колонтитул сайта с контактной информацией,
 * меню каталога, информационными ссылками и юридическими уведомлениями.
 *
 * @component
 * @returns {JSX.Element} Разметка футера сайта
 */
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLogo}>
          <p>Винный магазин</p>
          <a href="tel:+74956625895">+7 (929) 937-25-85</a>
          <a href="mailto:patsangeniy@gmail.com">patsangeniy@gmail.com</a>
          <address>
            <p>Проспект Вернадского 86с1</p>
          </address>
        </div>
        <div className={styles.footerMenu}>
          <h3>Каталог</h3>
          <ul>
            <li>
              <a href="#">Виски</a>
            </li>
            <li>
              <a href="#">Коньяк</a>
            </li>
            <li>
              <a href="#">Шампанское</a>
            </li>
            <li>
              <a href="#">Вино</a>
            </li>
            <li>
              <a href="#">Макаллан</a>
            </li>
            <li>
              <a href="#">Хеннесси</a>
            </li>
            <li>
              <a href="#">Чивас Ригал</a>
            </li>
            <li>
              <a href="#">Моет Шандон</a>
            </li>
            <li>
              <a href="#">Джонни Уокер</a>
            </li>
            <li>
              <a href="#">Лучший алкоголь</a>
            </li>
            <li>
              <a href="#">Подарочные сертификаты</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerInfo}>
          <h3>Информация</h3>
          <ul>
            <li>
              <a href="#">О магазинах</a>
            </li>
            <li>
              <a href="#">Условия работы</a>
            </li>
            <li>
              <a href="#">Скидки</a>
            </li>
            <li>
              <a href="#">Дегустации</a>
            </li>
            <li>
              <a href="#">Гарантии</a>
            </li>
            <li>
              <a href="#">Отзывы о магазине</a>
            </li>
            <li>
              <a href="#">О компании</a>
            </li>
            <li>
              <a href="#">Корпоративным клиентам</a>
            </li>
            <li>
              <a href="#">Статьи</a>
            </li>
            <li>
              <a href="#">Вакансии</a>
            </li>
            <li>
              <a href="#">Контакты</a>
            </li>
            <li>
              <a href="#">Карта сайта</a>
            </li>
            <li>
              <a href="#">Отзывы на алкоголь</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>18+ Чрезмерное употребление алкоголя вредит вашему здоровью</p>
        <p>© 2005 - 2024 "1001 май" - Магазин элитного алкоголя</p>
        <p>
          <a href="#">Пользовательское соглашение</a> |{" "}
          <a href="#">Политика конфиденциальности</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
