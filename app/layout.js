import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./components/CartContext";

/**
 * RootLayout — корневой лэйаут приложения.
 * Оборачивает все страницы в CartProvider, отображает Header и Footer.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - дочерние компоненты страницы
 * @param {boolean} [props.showHeader=true] - флаг для условного отображения Header
 * @returns {JSX.Element} Разметка корневого лэйаута
 */
export default function RootLayout({ children, showHeader = true }) {
  return (
    <html lang="en">
      <body>
        {/* Обертываем весь контент в CartProvider */}
        <CartProvider>
          <main>
            {showHeader && <Header />} {/* Условно рендерим Header */}
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
