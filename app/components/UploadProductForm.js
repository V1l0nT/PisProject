import { useState } from "react";

/**
 * Компонент UploadProductForm предоставляет форму для загрузки Excel-файла с товарами.
 *
 * @component
 * @returns {JSX.Element} Разметка формы загрузки товаров
 */
export default function UploadProductForm() {
  // Выбранный файл
  /** @type {File|null} */
  const [file, setFile] = useState(null);
  // Состояние загрузки
  /** @type {boolean} */
  const [isUploading, setIsUploading] = useState(false);
  // Сообщение о результате загрузки
  /** @type {string} */
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Пожалуйста, выберите файл");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Товары успешно добавлены!");
      } else {
        setMessage("Ошибка при добавлении товаров");
      }
    } catch {
      setMessage("Ошибка при загрузке файла");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Загрузить товары через Excel</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        <button type="submit" disabled={isUploading}>
          Загрузить
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
