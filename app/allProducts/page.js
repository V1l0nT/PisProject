"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import ProductCard from "@/app/components/ProductCard";

export default function AllProducts({ searchParams }) {
  const { category } = searchParams;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let url = "/api/products";
        if (category) {
          url += `?category=${category}`;
        }
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (!isClient) {
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.categoryHeader}>
        <h1>{category || "Все товары"}</h1>
      </div>
      {loading ? (
        <p>Загрузка товаров...</p>
      ) : (
        <div className={styles.productList}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
