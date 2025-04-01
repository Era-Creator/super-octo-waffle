// src/pages/CountryHomePage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import geoService from "../services/geoService";
import PropertyCard from "../components/PropertyCard";
import { fetchPropertiesByCountry } from "../services/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const CountryHomePage = () => {
  const { country, lang } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  
  const [searchParams, setSearchParams] = useState({
    location: "",
    type: "all",
    transaction: "all",
  });
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const mapRef = React.useRef(null);
  const mapContainerRef = React.useRef(null);
  const markersRef = React.useRef([]);
  
  // Определяем центр карты для выбранной страны и загружаем свойства
  useEffect(() => {
    const loadCountryData = async () => {
      setLoading(true);
      
      // Преобразуем slug страны в код страны
      const countryCode = geoService.slugToCountryCode(country);
      
      // Загружаем данные о стране из внешнего API или используем заготовленные координаты
      const countryCoordinates = {
        ukraine: [49.0139, 31.2858],
        poland: [51.9194, 19.1451],
        azerbaijan: [40.1431, 47.5769],
        georgia: [42.3154, 43.3569],
        global: [0, 0] // Глобальный вид
      };
      
      // Устанавливаем центр карты
      const center = countryCoordinates[country] || countryCoordinates.global;
      setMapCenter(center);
      
      // Загружаем свойства для выбранной страны
      try {
        const data = await fetchPropertiesByCountry(countryCode);
        setProperties(data);
        setCountryData({
          code: countryCode,
          name: intl.formatMessage({ id: `country.${country}` }),
          currency: geoService.getDefaultCurrency(countryCode)
        });
      } catch (error) {
        console.error(`Failed to load properties for ${country}:`, error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCountryData();
  }, [country, lang, intl]);
  
  // Инициализируем карту после загрузки данных
  useEffect(() => {
    if (loading || !mapCenter || !mapContainerRef.current) return;
    
    // Если карта уже инициализирована, очищаем её
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = [];
    }
    
    // Создаем карту, центрированную на выбранной стране
    const map = L.map(mapContainerRef.current).setView(mapCenter, 6); // Масштаб для страны
    mapRef.current = map;
    
    // Добавляем слой тайлов
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    // Добавляем маркеры для объектов недвижимости
    properties.forEach((property) => {
      // Для демо используем генерируемые координаты вокруг центра страны
      // В реальном приложении здесь будут использоваться настоящие координаты
      const offsetLat = ((property.id * 0.01) % 0.2) - 0.1;
      const offsetLng = ((property.id * 0.015) % 0.3) - 0.15;
      const position = [
        mapCenter[0] + offsetLat,
        mapCenter[1] + offsetLng,
      ];
      
      // Создаем маркер
      const marker = L.marker(position).addTo(map);
      
      // Добавляем всплывающее окно
      const popupContent = document.createElement("div");
      popupContent.innerHTML = `
        <h4>${property.title}</h4>
        <p>${property.location}</p>
        <p class="popup-price">
          ${geoService.formatPrice(property.price, property.currency, lang)}
          ${property.transaction_type === "RENT" ? intl.formatMessage({ id: "property.perMonth" }) : ""}
        </p>
      `;
      
      // Создаем кнопку для перехода на страницу объекта
      const button = document.createElement("button");
      button.textContent = intl.formatMessage({ id: "button.details", defaultMessage: "Details" });
      button.onclick = () => navigate(`/${country}/${lang}/properties/${property.id}`);
      button.className = "popup-button";
      popupContent.appendChild(button);
      
      marker.bindPopup(popupContent);
      
      // Сохраняем маркер, чтобы можно было удалить его позже
      markersRef.current.push(marker);
    });
    
    // Очищаем карту при размонтировании компонента
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [loading, properties, mapCenter, navigate, country, lang, intl]);
  
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
    
    navigate(`/${country}/${lang}/properties?${queryParams.toString()}`);
  };
  
  // Формируем SEO-заголовок для страницы
  const seoTitle = geoService.getCountrySeoTitle(geoService.slugToCountryCode(country), lang);
  
  return (
    <div className="home-page split-screen">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={intl.formatMessage({ id: "seo.home.description" })} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <div className="content-section">
        <div className="search-section">
          <h1>
            <FormattedMessage
              id="home.title"
              defaultMessage="Find Your Perfect Property"
            />
            {countryData && ` ${intl.formatMessage({ id: "in" }, { country: countryData.name })}`}
          </h1>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input">
              <input
                type="text"
                placeholder={intl.formatMessage({ id: "search.location" })}
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
                <option value="all">
                  {intl.formatMessage({ id: "search.allTypes" })}
                </option>
                <option value="apartment">
                  {intl.formatMessage({ id: "property.type.apartment" })}
                </option>
                <option value="house">
                  {intl.formatMessage({ id: "property.type.house" })}
                </option>
                <option value="commercial">
                  {intl.formatMessage({ id: "property.type.commercial" })}
                </option>
                <option value="land">
                  {intl.formatMessage({ id: "property.type.land" })}
                </option>
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
                <option value="all">
                  {intl.formatMessage({ id: "search.transactionType" })}
                </option>
                <option value="buy">
                  {intl.formatMessage({ id: "menu.buy" })}
                </option>
                <option value="rent">
                  {intl.formatMessage({ id: "menu.rent" })}
                </option>
              </select>
            </div>
            
            <button type="submit" className="search-button">
              {intl.formatMessage({ id: "search.button" })}
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
            <div className="loading">
              {intl.formatMessage({ id: "loading.properties", defaultMessage: "Loading properties..." })}
            </div>
          ) : (
            <div className="featured-properties-scroll">
              {properties.length > 0 ? (
                properties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} countrySlug={country} language={lang} />
                ))
              ) : (
                <div className="no-properties">
                  {intl.formatMessage({ id: "no.properties", defaultMessage: "No properties available in this region yet." })}
                </div>
              )}
            </div>
          )}
          
          <div className="view-all-button">
            <button onClick={() => navigate(`/${country}/${lang}/properties`)}>
              {intl.formatMessage({ id: "button.viewAll", defaultMessage: "View all properties" })}
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
              onClick={() => navigate(`/${country}/${lang}/properties?type=apartment`)}
            >
              <h3>{intl.formatMessage({ id: "property.type.apartment" })}</h3>
            </div>
            <div
              className="category-card"
              onClick={() => navigate(`/${country}/${lang}/properties?type=house`)}
            >
              <h3>{intl.formatMessage({ id: "property.type.house" })}</h3>
            </div>
            <div
              className="category-card"
              onClick={() => navigate(`/${country}/${lang}/properties?type=commercial`)}
            >
              <h3>{intl.formatMessage({ id: "property.type.commercial" })}</h3>
            </div>
            <div
              className="category-card"
              onClick={() => navigate(`/${country}/${lang}/properties?type=land`)}
            >
              <h3>{intl.formatMessage({ id: "property.type.land" })}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="map-section">
        <div
          ref={mapContainerRef}
          className="map-container"
          style={{ height: "100%", width: "100%" }}
        >
          {(!mapCenter || loading) && (
            <div className="map-loading">
              {intl.formatMessage({ id: "loading.map", defaultMessage: "Loading map..." })}
            </div>
          )}
        </div>
      </div>
    </div>
  );