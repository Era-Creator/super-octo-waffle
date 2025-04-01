// src/services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

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
      // Создаем новый объект ошибки вместо изменения существующего
      throw new Error(
        errorData.message || "Произошла ошибка при запросе к API"
      );
    }

    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    // Пробрасываем ошибку дальше вместо изменения ее
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
      main_image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    },
    // Другие объекты...
  ],
  // Другие страны...
};

// Для простоты используем тестовые данные
const allProperties = [
  ...(mockDataByCountry.UA || []),
  ...(mockDataByCountry.PL || []),
  ...(mockDataByCountry.AZ || []),
  ...(mockDataByCountry.GE || []),
  ...(mockDataByCountry.global || []),
];

// Функция для получения списка объектов недвижимости с фильтрами
export const fetchProperties = async (filters = {}) => {
  try {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Возвращаем тестовые данные
    return allProperties.slice(0, 6);
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Функция для получения объектов недвижимости по стране
export const fetchPropertiesByCountry = async (countryCode) => {
  try {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Преобразуем код страны в формат для тестовых данных
    const country = countryCode || "global";

    // Получаем данные для указанной страны или глобальные данные
    return mockDataByCountry[country] || mockDataByCountry.UA || [];
  } catch (error) {
    console.error(
      `Error fetching properties for country ${countryCode}:`,
      error
    );
    throw error;
  }
};

// Имитация парсинга
export const parsePropertiesFromExternalSources = async (
  countryCode,
  sources = []
) => {
  try {
    // Имитация задержки
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      data: mockDataByCountry[countryCode] || [],
      statistics: {
        total: mockDataByCountry[countryCode]?.length || 0,
        sources: { domria: 1, olx: 2 },
        types: { apartment: 2, house: 1 },
        transactions: { SALE: 2, RENT: 1 },
      },
      lastUpdated: new Date().toISOString(),
      duplicatesRemoved: 1,
    };
  } catch (error) {
    console.error("Error parsing properties:", error);
    throw error;
  }
};

// Функция для получения детальной информации об объекте
export const fetchPropertyDetails = async (id) => {
  try {
    // Имитация запроса
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Поиск объекта по ID
    const property = allProperties.find((p) => p.id === parseInt(id, 10));

    if (!property) {
      throw new Error(`Property with id ${id} not found`);
    }

    // Добавляем демо-данные
    return {
      ...property,
      description: "Пример описания объекта недвижимости.",
      features: ["Кондиционер", "Интернет", "Парковка"],
      images: [
        property.main_image,
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
      ],
      contactInfo: {
        name: "Агент по недвижимости",
        phone: "+1234567890",
        email: "agent@example.com",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 150,
    };
  } catch (error) {
    console.error(`Error fetching property details:`, error);
    throw error;
  }
};

// Заглушки для других функций API
export const loginUser = async () => ({
  token: "demo_token",
  user: { id: 1, name: "Demo User" },
});
export const registerUser = async () => ({
  token: "demo_token",
  user: { id: 1, name: "Demo User" },
});
export const createProperty = async (data) => ({ ...data, id: Date.now() });
export const fetchUserProperties = async () => allProperties.slice(0, 2);

export default {
  fetchProperties,
  fetchPropertiesByCountry,
  parsePropertiesFromExternalSources,
  fetchPropertyDetails,
  loginUser,
  registerUser,
  createProperty,
  fetchUserProperties,
};
