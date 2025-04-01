// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PropertyListPage from "./pages/PropertyListPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { translations } from "./translations";
import "./styles/main.css";

function App() {
  // Определяем язык пользователя из браузера или из localStorage
  const getBrowserLanguage = () => {
    // Сначала проверяем сохраненный выбор пользователя
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && translations[savedLocale]) return savedLocale;

    // Затем проверяем языковые настройки браузера
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      const langCode = browserLang.split("-")[0].toLowerCase(); // Берем только основной код языка (en-US -> en)

      // Проверяем, поддерживается ли язык браузера
      if (translations[langCode]) return langCode;
    }

    // Используем английский как язык по умолчанию
    return "en";
  };

  const [locale, setLocale] = useState(getBrowserLanguage());

  // Функция для смены языка
  const changeLanguage = (lang) => {
    setLocale(lang);
    localStorage.setItem("locale", lang);
  };

  // Обновляем атрибут lang у html элемента при изменении языка
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={translations[locale]}>
      <Router>
        <div className="app-container">
          <Header changeLanguage={changeLanguage} currentLocale={locale} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertyListPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Footer locale={locale} />
        </div>
      </Router>
    </IntlProvider>
  );
}

export default App;
