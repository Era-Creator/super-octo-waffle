// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Вспомогательная функция для выполнения запросов
const fetchFromAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Произошла ошибка при запросе к API");
    }
    
    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// Тестовые данные для разных стран
const mockDataByCountry = {
  UA: [
    {
      id: 101,
      title: "Современная квартира в центре Киева",
      price: 120000,
      currency: "USD",
      location: "Киев, Шевченковский район",
      bedrooms: 2,
      bathrooms: 1,
      area: 75,
      type: "apartment",
      transaction_type: "SALE",
      country: "UA",
      source: "domria",
      main_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    },
    {
      id: 102,
      title: "Просторный дом с садом в Одессе",
      price: 250000,
      currency: "USD",
      location: "Одесса, Приморский район",
      bedrooms: 4,
      bathrooms: 2,
      area: 180,
      type: "house",
      transaction_type: "SALE",
      country: "UA",
      source: "olx",
      main_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
    },
    {
      id: 103,
      title: "Уютная квартира для аренды",
      price: 800,
      currency: "USD",
      location: "Львов, центр",
      bedrooms: 1,
      bathrooms: 1,
      area: 60,
      type: "apartment",
      transaction_type: "RENT",
      country: "UA",
      source: "facebook",
      main_image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500",
    },
  ],
  PL: [
    {
      id: 201,
      title: "Nowoczesne mieszkanie w centrum Warszawy",
      price: 450000,
      currency: "PLN",
      location: "Warszawa, Śródmieście",
      bedrooms: 2,
      bathrooms: 1,
      area: 65,
      type: "apartment",
      transaction_type: "SALE",
      country: "PL",
      source: "otodom",
      main_image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500",
    },
    {
      id: 402,
      title: "სახლი ბათუმში ზღვის ხედით",
      price: 220000,
      currency: "USD",
      location: "ბათუმი, მთის ფერდობი",
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      type: "house",
      transaction_type: "SALE",
      country: "GE",
      source: "ss.ge",
      main_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
    },
    {
      id: 403,
      title: "ბინა გუდაურის სათხილამურო კურორტზე",
      price: 700,
      currency: "USD",
      location: "გუდაური, ცენტრი",
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      type: "apartment",
      transaction_type: "RENT",
      country: "GE",
      source: "place.ge",
      main_image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=500",
    },
  ],
  // Глобальные объекты (для показа, когда страна не выбрана)
  global: [
    {
      id: 1,
      title: "Современная квартира в центре",
      price: 120000,
      currency: "USD",
      location: "Москва, Центральный район",
      bedrooms: 2,
      bathrooms: 1,
      area: 75,
      type: "apartment",
      transaction_type: "SALE",
      country: "RU",
      source: "cian",
      main_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    },
    {
      id: 2,
      title: "Уютный дом с садом",
      price: 1500,
      currency: "USD",
      location: "Санкт-Петербург, Приморский район",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      type: "house",
      transaction_type: "RENT",
      country: "RU",
      source: "avito",
      main_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500",
    },
  ]
};

// Функция для имитации результатов парсинга
const simulateParsingResults = (country) => {
  // Определяем источники данных в зависимости от страны
  const sources = {
    UA: ["domria", "olx", "facebook"],
    PL: ["otodom", "olx", "gumtree"],
    AZ: ["bina.az", "kub.az"],
    GE: ["myhome.ge", "ss.ge", "place.ge"],
    global: ["cian", "avito"],
  };
  
  const countryData = mockDataByCountry[country] || mockDataByCountry.global;
  const statistics = {
    total: countryData.length,
    sources: {},
    types: {
      apartment: 0,
      house: 0,
      commercial: 0,
      land: 0
    },
    transactions: {
      SALE: 0,
      RENT: 0
    }
  };
  
  // Подсчитываем статистику
  countryData.forEach(property => {
    // Статистика по источникам
    if (!statistics.sources[property.source]) {
      statistics.sources[property.source] = 0;
    }
    statistics.sources[property.source]++;
    
    // Статистика по типам
    if (statistics.types[property.type] !== undefined) {
      statistics.types[property.type]++;
    }
    
    // Статистика по типам сделок
    if (statistics.transactions[property.transaction_type] !== undefined) {
      statistics.transactions[property.transaction_type]++;
    }
  });
  
  return {
    data: countryData,
    statistics: statistics,
    lastUpdated: new Date().toISOString(),
    availableSources: sources[country] || sources.global
  };
};

// Функция для имитации обнаружения дубликатов
const simulateDuplicateDetection = (properties) => {
  // В реальном приложении здесь была бы логика обнаружения дубликатов
  // Для демонстрации просто вернем те же данные с флагом
  return {
    originalCount: properties.length,
    uniqueCount: properties.length - 1, // Имитируем нахождение одного дубликата
    duplicatesRemoved: 1,
    properties: properties.slice(0, -1) // Удаляем последний элемент как "дубликат"
  };
};

// Функция для получения списка объектов недвижимости с фильтрами
export const fetchProperties = async (filters = {}) => {
  try {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации возвращаем тестовые данные
    await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки сети
    
    // Получаем все данные из всех стран для глобального поиска
    let allProperties = [
      ...mockDataByCountry.UA,
      ...mockDataByCountry.PL,
      ...mockDataByCountry.AZ,
      ...mockDataByCountry.GE
    ];
    
    // Фильтрация согласно параметрам
    let filtered = [...allProperties];
    
    // Фильтрация по типу недвижимости
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter(prop => prop.type === filters.type);
    }
    
    // Фильтрация по типу сделки
    if (filters.transaction && filters.transaction !== "all") {
      const transactionType = filters.transaction === "rent" ? "RENT" : "SALE";
      filtered = filtered.filter(prop => prop.transaction_type === transactionType);
    }
    
    // Фильтрация по местоположению
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(prop =>
        prop.location.toLowerCase().includes(locationLower)
      );
    }
    
    // Фильтрация по цене (мин)
    if (filters.minPrice) {
      filtered = filtered.filter(prop => prop.price >= parseFloat(filters.minPrice));
    }
    
    // Фильтрация по цене (макс)
    if (filters.maxPrice) {
      filtered = filtered.filter(prop => prop.price <= parseFloat(filters.maxPrice));
    }
    
    // Фильтрация по числу спален
    if (filters.bedrooms && filters.bedrooms !== "any") {
      filtered = filtered.filter(
        prop => prop.bedrooms && prop.bedrooms >= parseInt(filters.bedrooms, 10)
      );
    }
    
    // Фильтрация по стране
    if (filters.country) {
      filtered = filtered.filter(prop => prop.country === filters.country);
    }
    
    // Сортировка
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "area_asc":
          filtered.sort((a, b) => a.area - b.area);
          break;
        case "area_desc":
          filtered.sort((a, b) => b.area - a.area);
          break;
        default:
          filtered.sort((a, b) => b.id - a.id); // По умолчанию - по новизне
      }
    }
    
    return filtered;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Функция для получения объектов недвижимости по стране
export const fetchPropertiesByCountry = async (countryCode) => {
  try {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Преобразуем код страны в формат для тестовых данных
    const country = countryCode || "global";
    
    // Получаем данные для указанной страны или глобальные данные
    return mockDataByCountry[country] || mockDataByCountry.global;
  } catch (error) {
    console.error(`Error fetching properties for country ${countryCode}:`, error);
    throw error;
  }
};

// Функция для имитации парсинга данных для указанной страны
export const parsePropertiesFromExternalSources = async (countryCode, sources = []) => {
  try {
    // Имитация длительного процесса парсинга
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Получаем результаты парсинга для указанной страны
    const parsingResults = simulateParsingResults(countryCode);
    
    // Если указаны конкретные источники, фильтруем результаты
    if (sources.length > 0) {
      parsingResults.data = parsingResults.data.filter(property => 
        sources.includes(property.source)
      );
    }
    
    // Выполняем проверку на дубликаты
    const deduplicatedResults = simulateDuplicateDetection(parsingResults.data);
    
    return {
      ...parsingResults,
      data: deduplicatedResults.properties,
      duplicatesRemoved: deduplicatedResults.duplicatesRemoved,
    };
  } catch (error) {
    console.error(`Error parsing properties for country ${countryCode}:`, error);
    throw error;
  }
};

// Функция для получения детальной информации об объекте
export const fetchPropertyDetails = async (id) => {
  try {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Поиск объекта по ID среди всех стран
    let allProperties = [
      ...mockDataByCountry.UA,
      ...mockDataByCountry.PL,
      ...mockDataByCountry.AZ,
      ...mockDataByCountry.GE,
      ...mockDataByCountry.global
    ];
    
    const property = allProperties.find(p => p.id === parseInt(id, 10));
    
    if (!property) {
      throw new Error(`Property with id ${id} not found`);
    }
    
    // Добавляем дополнительную информацию для детальной страницы
    return {
      ...property,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nisi vel tincidunt ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Fusce euismod, nisi vel tincidunt ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
      features: ["Кондиционер", "Интернет", "Парковка", "Балкон"],
      images: [
        property.main_image,
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=500",
      ],
      contactInfo: {
        name: "Агент по недвижимости",
        phone: "+1234567890",
        email: "agent@example.com"
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 500) + 50
    };
  } catch (error) {
    console.error(`Error fetching property details for id ${id}:`, error);
    throw error;
  }
};

// Функция для авторизации пользователя
export const loginUser = async (credentials) => {
  try {
    // В реальном приложении был бы запрос к API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Имитация успешной авторизации
    return {
      token: "example_token_123456",
      user: {
        id: 1,
        name: "John Doe",
        email: credentials.email,
        role: "user"
      }
    };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
  try {
    // В реальном приложении был бы запрос к API
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Проверяем, совпадают ли пароли
    if (userData.password !== userData.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    
    // Имитация успешной регистрации
    return {
      token: "example_token_new_user_123456",
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        name: userData.name,
        email: userData.email,
        role: "user"
      }
    };
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Функция для создания нового объявления
export const createProperty = async (propertyData) => {
  try {
    // В реальном приложении был бы запрос к API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Имитация успешного создания с присвоением ID
    return {
      ...propertyData,
      id: Math.floor(Math.random() * 10000) + 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

// Функция для получения объявлений пользователя
export const fetchUserProperties = async () => {
  try {
    // В реальном приложении был бы запрос к API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Возвращаем тестовые данные для текущего пользователя
    return mockDataByCountry.UA.slice(0, 2); // Для демонстрации просто берем пару объектов
  } catch (error) {
    console.error("Error fetching user properties:", error);
    throw error;
  }
};

// Экспортируем все функции для использования в приложении
export default {
  fetchProperties,
  fetchPropertiesByCountry,
  parsePropertiesFromExternalSources,
  fetchPropertyDetails,
  loginUser,
  registerUser,
  createProperty,
  fetchUserProperties
};

    },
    {
      id: 202,
      title: "Dom jednorodzinny z ogrodem",
      price: 750000,
      currency: "PLN",
      location: "Kraków, Podgórze",
      bedrooms: 5,
      bathrooms: 2,
      area: 200,
      type: "house",
      transaction_type: "SALE",
      country: "PL",
      source: "olx",
      main_image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500",
    },
    {
      id: 203,
      title: "Apartament do wynajęcia w centrum",
      price: 2500,
      currency: "PLN",
      location: "Wrocław, Rynek",
      bedrooms: 1,
      bathrooms: 1,
      area: 50,
      type: "apartment",
      transaction_type: "RENT",
      country: "PL",
      source: "gumtree",
      main_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    },
  ],
  AZ: [
    {
      id: 301,
      title: "Элитная квартира в Баку",
      price: 180000,
      currency: "USD",
      location: "Баку, Насиминский район",
      bedrooms: 3,
      bathrooms: 2,
      area: 110,
      type: "apartment",
      transaction_type: "SALE",
      country: "AZ",
      source: "bina.az",
      main_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    },
    {
      id: 302,
      title: "Дом с видом на море",
      price: 350000,
      currency: "USD",
      location: "Баку, приморский бульвар",
      bedrooms: 4,
      bathrooms: 3,
      area: 220,
      type: "house",
      transaction_type: "SALE",
      country: "AZ",
      source: "kub.az",
      main_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500",
    },
  ],
  GE: [
    {
      id: 401,
      title: "ახალი ბინა თბილისის ცენტრში",
      price: 90000,
      currency: "USD",
      location: "თბილისი, ვაკე",
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      type: "apartment",
      transaction_type: "SALE",
      country: "GE",
      source: "myhome.ge",
      main_image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500",