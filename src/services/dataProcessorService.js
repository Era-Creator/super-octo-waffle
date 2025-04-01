// src/services/dataProcessorService.js

/**
 * Сервис для обработки и анализа данных, полученных из различных источников.
 * В реальном приложении здесь была бы логика очистки, нормализации и обогащения данных.
 */
const dataProcessorService = {
  /**
   * Нормализация данных объекта недвижимости из разных источников в единый формат
   * @param {Object} property - Объект недвижимости из внешнего источника
   * @param {String} source - Источник данных (например, "domria", "olx")
   * @returns {Object} - Нормализованный объект недвижимости
   */
  normalizeProperty(property, source) {
    // В реальном приложении здесь был бы код для преобразования данных
    // из разных источников в единый формат
    const normalizers = {
      domria: this.normalizeDomRiaProperty,
      olx: this.normalizeOlxProperty,
      facebook: this.normalizeFacebookProperty,
      otodom: this.normalizeOtodomProperty,
      "bina.az": this.normalizeBinaAzProperty,
      "myhome.ge": this.normalizeMyHomeGeProperty,
      default: this.normalizeGenericProperty,
    };

    // Выбираем соответствующий нормализатор или используем общий
    const normalizer = normalizers[source] || normalizers.default;
    return normalizer(property);
  },

  /**
   * Обнаружение дубликатов объектов недвижимости
   * @param {Array} properties - Массив объектов недвижимости
   * @returns {Object} - Результат с уникальными объектами и статистикой
   */
  detectDuplicates(properties) {
    // Создаем хеш-карту для обнаружения дубликатов
    const uniquePropertiesMap = new Map();
    const duplicates = [];

    properties.forEach((property) => {
      // Создаем уникальный "отпечаток" объекта на основе его свойств
      // В реальном приложении здесь был бы более сложный алгоритм,
      // учитывающий различные аспекты объекта (адрес, площадь, цена и т.д.)
      const fingerprint = this.createPropertyFingerprint(property);

      if (uniquePropertiesMap.has(fingerprint)) {
        // Нашли дубликат
        duplicates.push({
          original: uniquePropertiesMap.get(fingerprint),
          duplicate: property,
        });
      } else {
        // Новый уникальный объект
        uniquePropertiesMap.set(fingerprint, property);
      }
    });

    // Возвращаем уникальные объекты и статистику
    return {
      uniqueProperties: Array.from(uniquePropertiesMap.values()),
      duplicatesCount: duplicates.length,
      duplicates, // Для отладки и анализа
    };
  },

  /**
   * Создание "отпечатка" объекта недвижимости для обнаружения дубликатов
   * @param {Object} property - Объект недвижимости
   * @returns {String} - Уникальный отпечаток
   */
  createPropertyFingerprint(property) {
    // В простейшем случае используем комбинацию ключевых полей
    // В реальном приложении здесь был бы более сложный алгоритм
    const { location, area, bedrooms, price } = property;

    // Нормализуем строковые значения
    const normalizedLocation = (location || "").toLowerCase().trim();
    const normalizedArea = parseFloat(area || 0).toFixed(1);
    const normalizedBedrooms = bedrooms || 0;
    const normalizedPrice = Math.round(parseFloat(price || 0) / 100) * 100; // Округляем цену до сотен

    // Создаем отпечаток
    return `${normalizedLocation}|${normalizedArea}|${normalizedBedrooms}|${normalizedPrice}`;
  },

  /**
   * Проверка объекта на потенциальное мошенничество
   * @param {Object} property - Объект недвижимости
   * @returns {Object} - Результат проверки с флагом и причинами
   */
  checkForFraud(property) {
    const fraudIndicators = [];
    let fraudScore = 0;

    // Проверка цены (слишком низкая для данного типа и региона)
    if (this.isPriceTooLow(property)) {
      fraudIndicators.push("price_too_low");
      fraudScore += 30;
    }

    // Проверка описания на ключевые слова, указывающие на мошенничество
    if (this.hasSpamKeywords(property.description)) {
      fraudIndicators.push("spam_keywords");
      fraudScore += 25;
    }

    // Проверка контактных данных
    if (this.hasInvalidContacts(property)) {
      fraudIndicators.push("invalid_contacts");
      fraudScore += 40;
    }

    // Проверка изображений (одинаковые изображения в разных объявлениях)
    if (this.hasStockImages(property)) {
      fraudIndicators.push("stock_images");
      fraudScore += 20;
    }

    // Определяем, является ли объект подозрительным на основе оценки
    const isSuspicious = fraudScore >= 50;

    return {
      isSuspicious,
      fraudScore,
      fraudIndicators,
    };
  },

  // Вспомогательные методы для проверки мошенничества
  isPriceTooLow(property) {
    // Пример простой логики: цена на 50% ниже средней для данного типа и региона
    // В реальном приложении здесь был бы более сложный алгоритм
    const averagePrices = {
      UA: {
        apartment: { SALE: 50000, RENT: 500 },
        house: { SALE: 100000, RENT: 800 },
        commercial: { SALE: 80000, RENT: 1000 },
        land: { SALE: 30000, RENT: 300 },
      },
      PL: {
        apartment: { SALE: 80000, RENT: 700 },
        house: { SALE: 150000, RENT: 1000 },
        commercial: { SALE: 120000, RENT: 1500 },
        land: { SALE: 50000, RENT: 400 },
      },
      // Другие страны...
    };

    const country = property.country || "UA";
    const type = property.type || "apartment";
    const transaction = property.transaction_type || "SALE";

    // Получаем среднюю цену для данного типа и региона
    const avgPrice = averagePrices[country]?.[type]?.[transaction] || 0;

    // Если цена слишком низкая (менее 50% от средней), это подозрительно
    return property.price < avgPrice * 0.5;
  },

  hasSpamKeywords(description) {
    if (!description) return false;

    // Список ключевых слов, часто используемых в мошеннических объявлениях
    const spamKeywords = [
      "100% гарантия",
      "срочно без залога",
      "без предоплаты",
      "только по телефону",
      "не перезванивайте мне",
      "переведите деньги",
      "оплата сегодня",
      "western union",
      "money gram",
    ];

    // Проверяем наличие ключевых слов в описании
    const descLower = description.toLowerCase();
    return spamKeywords.some((keyword) =>
      descLower.includes(keyword.toLowerCase())
    );
  },

  hasInvalidContacts(property) {
    // Проверка валидности контактных данных
    // В реальном приложении здесь была бы более сложная логика

    // Проверка телефона
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const hasValidPhone = property.contactInfo?.phone
      ? phoneRegex.test(property.contactInfo.phone)
      : false;

    // Проверка электронной почты
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmail = property.contactInfo?.email
      ? emailRegex.test(property.contactInfo.email)
      : false;

    // Если нет ни валидного телефона, ни валидной почты - подозрительно
    return !hasValidPhone && !hasValidEmail;
  },

  hasStockImages(property) {
    // Проверка на использование стоковых изображений
    // В реальном приложении здесь был бы анализ изображений
    // или проверка на совпадение с известными стоковыми изображениями

    // Для примера просто используем заглушку
    return false;
  },

  // Методы нормализации для разных источников
  normalizeDomRiaProperty(property) {
    // Пример нормализации для DomRia
    return {
      ...property,
      source: "domria",
      // Специфичная логика нормализации для DomRia
      transactionType: property.operation_type === "sale" ? "SALE" : "RENT",
    };
  },

  normalizeOlxProperty(property) {
    // Пример нормализации для OLX
    return {
      ...property,
      source: "olx",
      // Специфичная логика нормализации для OLX
      transactionType: property.offer_type === "selling" ? "SALE" : "RENT",
    };
  },

  normalizeFacebookProperty(property) {
    // Пример нормализации для Facebook Marketplace
    return {
      ...property,
      source: "facebook",
      // Специфичная логика нормализации для Facebook
    };
  },

  normalizeOtodomProperty(property) {
    // Пример нормализации для Otodom (Польша)
    return {
      ...property,
      source: "otodom",
      // Специфичная логика нормализации для Otodom
    };
  },

  normalizeBinaAzProperty(property) {
    // Пример нормализации для Bina.az (Азербайджан)
    return {
      ...property,
      source: "bina.az",
      // Специфичная логика нормализации для Bina.az
    };
  },

  normalizeMyHomeGeProperty(property) {
    // Пример нормализации для MyHome.ge (Грузия)
    return {
      ...property,
      source: "myhome.ge",
      // Специфичная логика нормализации для MyHome.ge
    };
  },

  normalizeGenericProperty(property) {
    // Общая нормализация для любого источника
    return {
      ...property,
      transaction_type:
        property.transaction_type || (property.is_rent ? "RENT" : "SALE"),
    };
  },

  /**
   * Обогащение данных объекта дополнительной информацией
   * @param {Object} property - Объект недвижимости
   * @returns {Object} - Обогащенный объект
   */
  enrichPropertyData(property) {
    // В реальном приложении здесь было бы обогащение данных
    // из дополнительных источников (например, геокодирование,
    // информация о районе, транспорте, инфраструктуре и т.д.)

    // Для примера просто добавляем несколько демо-полей
    return {
      ...property,
      enriched: true,
      neighborhood_rating: Math.floor(Math.random() * 5) + 1,
      transport_accessibility: Math.floor(Math.random() * 5) + 1,
      infrastructure_score: Math.floor(Math.random() * 5) + 1,
    };
  },

  /**
   * Анализ рынка недвижимости на основе имеющихся данных
   * @param {Array} properties - Массив объектов недвижимости
   * @param {String} country - Код страны
   * @returns {Object} - Аналитические данные
   */
  analyzeMarketData(properties, country) {
    // Базовая статистика по типам недвижимости и сделок
    const stats = {
      totalProperties: properties.length,
      byType: {},
      byTransaction: {},
      priceRanges: {},
      averagePrices: {},
    };

    // Подсчет по типам недвижимости
    properties.forEach((property) => {
      const type = property.type || "unknown";
      const transaction = property.transaction_type || "unknown";

      // Статистика по типу
      if (!stats.byType[type]) {
        stats.byType[type] = 0;
      }
      stats.byType[type]++;

      // Статистика по типу сделки
      if (!stats.byTransaction[transaction]) {
        stats.byTransaction[transaction] = 0;
      }
      stats.byTransaction[transaction]++;

      // Статистика по ценовым диапазонам
      const priceRange = this.getPriceRange(property.price, transaction);
      if (!stats.priceRanges[priceRange]) {
        stats.priceRanges[priceRange] = 0;
      }
      stats.priceRanges[priceRange]++;
    });

    // Расчет средних цен по типам и транзакциям
    const priceGroups = {};
    properties.forEach((property) => {
      const key = `${property.type || "unknown"}_${
        property.transaction_type || "unknown"
      }`;

      if (!priceGroups[key]) {
        priceGroups[key] = {
          count: 0,
          sum: 0,
        };
      }

      priceGroups[key].count++;
      priceGroups[key].sum += Number(property.price) || 0;
    });

    // Вычисляем средние цены
    Object.keys(priceGroups).forEach((key) => {
      const group = priceGroups[key];
      stats.averagePrices[key] = group.count > 0 ? group.sum / group.count : 0;
    });

    return stats;
  },

  /**
   * Определение ценового диапазона для объекта
   * @param {Number} price - Цена объекта
   * @param {String} transaction - Тип сделки
   * @returns {String} - Название ценового диапазона
   */
  getPriceRange(price, transaction) {
    const numPrice = Number(price) || 0;

    if (transaction === "RENT") {
      if (numPrice < 300) return "budget";
      if (numPrice < 700) return "standard";
      if (numPrice < 1500) return "premium";
      return "luxury";
    } else {
      // Для продажи
      if (numPrice < 50000) return "budget";
      if (numPrice < 150000) return "standard";
      if (numPrice < 300000) return "premium";
      return "luxury";
    }
  },
};

export default dataProcessorService;
