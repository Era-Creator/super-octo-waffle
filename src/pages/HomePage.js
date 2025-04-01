// src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import PropertyCard from "../components/PropertyCard";
import { fetchProperties } from "../services/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: "",
    type: "all",
    transaction: "all",
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем свойства при монтировании компонента
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (searchParams.location) {
      queryParams.append("location", searchParams.location);
    }

    if (searchParams.type !== "all") {
      queryParams.append("type", searchParams.type);
    }

    if (searchParams.transaction !== "all") {
      queryParams.append("transaction", searchParams.transaction);
    }

    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <div className="home-page">
      <div className="search-section">
        <h1>
          <FormattedMessage
            id="home.title"
            defaultMessage="Find Your Perfect Property"
          />
        </h1>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input">
            <input
              type="text"
              placeholder="Город, район или адрес"
              value={searchParams.location}
              onChange={(e) =>
                setSearchParams({ ...searchParams, location: e.target.value })
              }
            />
          </div>

          <div className="search-select">
            <select
              value={searchParams.type}
              onChange={(e) =>
                setSearchParams({ ...searchParams, type: e.target.value })
              }
            >
              <option value="all">Все типы</option>
              <option value="apartment">Квартира</option>
              <option value="house">Дом</option>
              <option value="commercial">Коммерческая</option>
              <option value="land">Земля</option>
            </select>
          </div>

          <div className="search-select">
            <select
              value={searchParams.transaction}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  transaction: e.target.value,
                })
              }
            >
              <option value="all">Купить или арендовать</option>
              <option value="buy">Купить</option>
              <option value="rent">Арендовать</option>
            </select>
          </div>

          <button type="submit" className="search-button">
            Поиск
          </button>
        </form>
      </div>

      <div className="featured-section">
        <div className="section-header">
          <h2>
            <FormattedMessage
              id="home.featured"
              defaultMessage="Featured Properties"
            />
          </h2>
        </div>

        {loading ? (
          <div className="loading">Загрузка объектов...</div>
        ) : (
          <div className="featured-properties">
            {properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div className="view-all-button">
          <button onClick={() => navigate("/properties")}>
            Посмотреть все объекты
          </button>
        </div>
      </div>

      <div className="categories-section">
        <div className="section-header">
          <h2>
            <FormattedMessage
              id="home.categories"
              defaultMessage="Browse by Category"
            />
          </h2>
        </div>

        <div className="category-cards">
          <div
            className="category-card"
            onClick={() => navigate("/properties?type=apartment")}
          >
            <h3>Квартиры</h3>
          </div>
          <div
            className="category-card"
            onClick={() => navigate("/properties?type=house")}
          >
            <h3>Дома</h3>
          </div>
          <div
            className="category-card"
            onClick={() => navigate("/properties?type=commercial")}
          >
            <h3>Коммерческая недвижимость</h3>
          </div>
          <div
            className="category-card"
            onClick={() => navigate("/properties?type=land")}
          >
            <h3>Земельные участки</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
