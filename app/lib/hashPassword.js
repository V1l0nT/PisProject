const bcrypt = require("bcrypt");

const password = "stifazno"; // Ваш пароль
const saltRounds = 10; // Количество раундов для хэширования

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("Ошибка при хэшировании пароля:", err);
    return;
  }
  console.log("Хэш пароля:", hash); // Сохраните этот хэш в поле `password` в вашей таблице users
});
