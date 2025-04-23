"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import ProductCard from "../components/ProductCard";

/**
 * Страница поиска товаров по запросу из параметров URL.
 * Выполняет запрос к API и отображает список найденных товаров.
 *
 * @component
 * @returns {JSX.Element} Разметка страницы результатов поиска
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/products/search?search=${encodeURIComponent(searchTerm)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error("Ошибка при загрузке товаров");
        }
        const data = await res.json();
        console.log("Products fetched from search:", data);
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };

    if (searchTerm) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        style={{
          maxWidth: "1350px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {searchTerm
            ? `Результаты поиска по "${searchTerm}"`
            : "Результат поиска"}
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "center",
            pointerEvents: "auto", // Включаем перехват кликов для контейнера
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>Товар не найден!</p>
          )}
        </div>
      </div>
    </div>
  );
}
