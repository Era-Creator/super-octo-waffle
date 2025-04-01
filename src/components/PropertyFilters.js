import React from "react";
import { FormattedMessage } from "react-intl";

const PropertyFilters = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="property-filters">
      <h3>Фильтры поиска</h3>

      <div className="filter-group">
        <label>Местоположение</label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Город, район"
        />
      </div>

      <div className="filter-group">
        <label>Тип недвижимости</label>
        <select
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="all">Все типы</option>
          <option value="apartment">Квартира</option>
          <option value="house">Дом</option>
          <option value="commercial">Коммерческая</option>
          <option value="land">Земельный участок</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Тип сделки</label>
        <select
          value={filters.transaction}
          onChange={(e) => handleChange("transaction", e.target.value)}
        >
          <option value="all">Все сделки</option>
          <option value="buy">Покупка</option>
          <option value="rent">Аренда</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Цена от</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => handleChange("minPrice", e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="filter-group">
        <label>Цена до</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
          placeholder="Любая"
        />
      </div>

      <div className="filter-group">
        <label>Количество спален</label>
        <select
          value={filters.bedrooms}
          onChange={(e) => handleChange("bedrooms", e.target.value)}
        >
          <option value="any">Любое</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Сортировка</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
        >
          <option value="newest">Сначала новые</option>
          <option value="price_asc">Цена (низкая - высокая)</option>
          <option value="price_desc">Цена (высокая - низкая)</option>
          <option value="area_asc">Площадь (возрастание)</option>
          <option value="area_desc">Площадь (убывание)</option>
        </select>
      </div>

      <button
        className="clear-filters-button"
        onClick={() =>
          onFilterChange({
            location: "",
            type: "all",
            transaction: "all",
            minPrice: "",
            maxPrice: "",
            bedrooms: "any",
            sortBy: "newest",
          })
        }
      >
        Сбросить фильтры
      </button>
    </div>
  );
};

export default PropertyFilters;
