# Используем официальный образ Node.js в качестве базового
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Указываем команду для запуска приложения
CMD ["npm", "run", "dev"]

# Указываем порт, который будет использоваться
EXPOSE 3000
