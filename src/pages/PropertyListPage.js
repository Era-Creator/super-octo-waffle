import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import { fetchProperties } from "../services/api";

const PropertyListPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    type: "all",
    transaction: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "any",
    sortBy: "newest",
  });

  // Получаем параметры из URL при загрузке
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const urlFilters = {
      location: params.get("location") || "",
      type: params.get("type") || "all",
      transaction: params.get("transaction") || "all",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      bedrooms: params.get("bedrooms") || "any",
      sortBy: params.get("sortBy") || "newest",
    };

    setFilters(urlFilters);

    // Загружаем объекты недвижимости с фильтрами
    loadProperties(urlFilters);
  }, [location.search]);

  const loadProperties = async (filterParams) => {
    setLoading(true);
    try {
      const data = await fetchProperties(filterParams);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Обновляем URL с новыми фильтрами
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "any" && value !== "") {
        params.append(key, value);
      }
    });

    // Обновляем URL без перезагрузки страницы
    window.history.pushState(
      {},
      "",
      `${location.pathname}?${params.toString()}`
    );

    // Загружаем объекты с новыми фильтрами
    loadProperties(newFilters);
  };

  return (
    <div className="property-list-page">
      <div className="filters-sidebar">
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="properties-grid">
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <div className="no-results">
            Объекты недвижимости не найдены. Попробуйте изменить параметры
            поиска.
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListPage;
