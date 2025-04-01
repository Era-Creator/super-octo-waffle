// src/services/geoService.js
import { countryLanguageMap, defaultCurrencies } from "../translations";

// Сервис для определения геолокации пользователя и региональных настроек
const geoService = {
  // Определение страны пользователя по IP
  async detectUserCountry() {
    try {
      // Используем бесплатное API для определения страны по IP
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data && data.country_code) {
        return {
          countryCode: data.country_code,
          countryName: data.country_name,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          currency: data.currency,
        };
      }
    } catch (error) {
      console.error("Failed to detect user country:", error);
    }

    // Возвращаем значения по умолчанию, если не удалось определить
    return {
      countryCode: "US",
      countryName: "United States",
      city: null,
      latitude: null,
      longitude: null,
      currency: "USD",
    };
  },

  // Получение языка по умолчанию для страны
  getDefaultLanguage(countryCode) {
    const supportedLanguages =
      countryLanguageMap[countryCode] || countryLanguageMap.default;
    return supportedLanguages[0]; // Возвращаем основной язык для страны
  },

  // Получение возможных языков для страны
  getSupportedLanguages(countryCode) {
    return countryLanguageMap[countryCode] || countryLanguageMap.default;
  },

  // Получение валюты по умолчанию для страны
  getDefaultCurrency(countryCode) {
    switch (countryCode) {
      case "UA":
        return defaultCurrencies.ukraine;
      case "PL":
        return defaultCurrencies.poland;
      case "AZ":
        return defaultCurrencies.azerbaijan;
      case "GE":
        return defaultCurrencies.georgia;
      default:
        return defaultCurrencies.default;
    }
  },

  // Преобразование ISO кода страны в slug для URL
  countryCodeToSlug(countryCode) {
    const countryMap = {
      UA: "ukraine",
      PL: "poland",
      AZ: "azerbaijan",
      GE: "georgia",
    };

    return countryMap[countryCode] || "global";
  },

  // Преобразование slug страны в ISO код
  slugToCountryCode(slug) {
    const slugMap = {
      ukraine: "UA",
      poland: "PL",
      azerbaijan: "AZ",
      georgia: "GE",
      global: "US",
    };

    return slugMap[slug] || "US";
  },

  // Форматирование цены с учетом локали
  formatPrice(price, currency, locale) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  // Определение заголовка страны для SEO
  getCountrySeoTitle(countryCode, locale) {
    const countryMap = {
      UA: {
        en: "Real Estate in Ukraine - Find Properties for Rent and Sale",
        uk: "Нерухомість в Україні - Знайдіть об'єкти для оренди та продажу",
        pl: "Nieruchomości w Ukrainie - Znajdź oferty wynajmu i sprzedaży",
        ka: "უძრავი ქონება უკრაინაში - იპოვეთ ქონება გასაქირავებლად და გასაყიდად",
      },
      PL: {
        en: "Real Estate in Poland - Find Properties for Rent and Sale",
        uk: "Нерухомість у Польщі - Знайдіть об'єкти для оренди та продажу",
        pl: "Nieruchomości w Polsce - Znajdź oferty wynajmu i sprzedaży",
        ka: "უძრავი ქონება პოლონეთში - იპოვეთ ქონება გასაქირავებლად და გასაყიდად",
      },
      AZ: {
        en: "Real Estate in Azerbaijan - Find Properties for Rent and Sale",
        uk: "Нерухомість в Азербайджані - Знайдіть об'єкти для оренди та продажу",
        pl: "Nieruchomości w Azerbejdżanie - Znajdź oferty wynajmu i sprzedaży",
        ka: "უძრავი ქონება აზერბაიჯანში - იპოვეთ ქონება გასაქირავებლად და გასაყიდად",
      },
      GE: {
        en: "Real Estate in Georgia - Find Properties for Rent and Sale",
        uk: "Нерухомість у Грузії - Знайдіть об'єкти для оренди та продажу",
        pl: "Nieruchomości w Gruzji - Znajdź oferty wynajmu i sprzedaży",
        ka: "უძრავი ქონება საქართველოში - იპოვეთ ქონება გასაქირავებლად და გასაყიდად",
      },
    };

    return (
      (countryMap[countryCode] && countryMap[countryCode][locale]) ||
      "Global Real Estate - Find Properties for Rent and Sale"
    );
  },
};

export default geoService;
