import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchPropertyDetails } from "../services/api";
import geoService from "../services/geoService";

const PropertyDetailPage = () => {
  const { id, country, lang } = useParams();
  const intl = useIntl();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Ссылка на DOM-элемент для карты
  const mapContainerRef = React.useRef(null);
  const mapRef = React.useRef(null);

  // Загружаем детальную информацию об объекте
  useEffect(() => {
    const loadPropertyDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchPropertyDetails(id);
        setProperty(data);
      } catch (error) {
        console.error("Failed to load property details:", error);
        setError(error.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    loadPropertyDetails();
  }, [id]);

  // Инициализируем карту после загрузки данных о недвижимости
  useEffect(() => {
    if (loading || !property || !mapContainerRef.current) return;

    // Если карта уже инициализирована, очищаем её
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Для демонстрации создаем произвольные координаты на основе ID
    // В реальном приложении здесь будут настоящие координаты
    const propertyId = parseInt(id, 10);
    const baseCoordinates = {
      UA: [50.4501, 30.5234], // Киев
      PL: [52.2297, 21.0122], // Варшава
      AZ: [40.4093, 49.8671], // Баку
      GE: [41.7151, 44.8271], // Тбилиси
    };

    // Определяем базовые координаты в зависимости от страны
    const baseLatLng = baseCoordinates[property.country] || [51.5074, -0.1278]; // Лондон по умолчанию

    // Добавляем небольшое смещение на основе ID
    const lat = baseLatLng[0] + (propertyId % 100) / 1000;
    const lng = baseLatLng[1] + (propertyId % 100) / 1000;

    // Создаем карту
    const map = L.map(mapContainerRef.current).setView([lat, lng], 14);
    mapRef.current = map;

    // Добавляем слой тайлов
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Добавляем маркер объекта
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(
      `<strong>${property.title}</strong><br>${property.location}`
    );

    // Очищаем карту при размонтировании компонента
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loading, property, id]);

  // Функция для переключения изображений
  const changeImage = (index) => {
    setActiveImageIndex(index);
  };

  // Функция для переключения на следующее изображение
  const nextImage = () => {
    if (!property) return;
    setActiveImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Функция для переключения на предыдущее изображение
  const prevImage = () => {
    if (!property) return;
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>
          {intl.formatMessage({
            id: "loading.propertyDetails",
            defaultMessage: "Loading property details...",
          })}
        </p>
      </div>
    );
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <div className="error-container">
        <h2>
          {intl.formatMessage({ id: "error.title", defaultMessage: "Error" })}
        </h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>
          {intl.formatMessage({
            id: "button.goBack",
            defaultMessage: "Go back",
          })}
        </button>
      </div>
    );
  }

  // Если данные загружены, показываем информацию об объекте
  if (property) {
    // Формируем SEO-заголовок и описание
    const seoTitle = `${property.title} - ${intl.formatMessage({
      id:
        property.transaction_type === "RENT"
          ? "property.rent"
          : "property.sale",
    })}`;

    const seoDescription = `${intl.formatMessage({
      id: `property.type.${property.type}`,
    })} ${
      property.bedrooms
        ? `${property.bedrooms} ${intl.formatMessage({
            id: "property.bedrooms",
          })}`
        : ""
    } - ${property.location}`;

    return (
      <div className="property-detail-page">
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          {/* Структурированные данные для поисковых систем */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type":
                property.transaction_type === "RENT" ? "Apartment" : "House",
              name: property.title,
              description: property.description,
              image: property.images,
              address: {
                "@type": "PostalAddress",
                addressLocality: property.location,
              },
              numberOfRooms: property.bedrooms,
              petsAllowed: "Да",
              price: property.price,
              priceCurrency: property.currency,
            })}
          </script>
        </Helmet>

        <div className="property-header">
          <div className="property-title-section">
            <h1>{property.title}</h1>
            <p className="property-location">{property.location}</p>

            <div className="property-badges">
              <span
                className={`transaction-badge ${
                  property.transaction_type === "RENT"
                    ? "rent-badge"
                    : "sale-badge"
                }`}
              >
                <FormattedMessage
                  id={
                    property.transaction_type === "RENT"
                      ? "property.rent"
                      : "property.sale"
                  }
                  defaultMessage={
                    property.transaction_type === "RENT"
                      ? "For Rent"
                      : "For Sale"
                  }
                />
              </span>

              <span className="type-badge">
                <FormattedMessage
                  id={`property.type.${property.type}`}
                  defaultMessage={property.type}
                />
              </span>

              <span className="views-badge">
                <span className="icon">👁️</span> {property.views}
              </span>
            </div>
          </div>

          <div className="property-price-section">
            <div className="property-price">
              {geoService.formatPrice(property.price, property.currency, lang)}
              {property.transaction_type === "RENT" && (
                <span className="price-period">
                  <FormattedMessage
                    id="property.perMonth"
                    defaultMessage="/month"
                  />
                </span>
              )}
            </div>

            <div className="property-id">ID: {property.id}</div>

            <div className="property-date">
              <FormattedMessage id="property.listed" defaultMessage="Listed" />:{" "}
              {new Date(property.createdAt).toLocaleDateString(lang)}
            </div>
          </div>
        </div>

        <div className="property-content">
          <div className="property-gallery">
            <div className="main-image-container">
              <button className="gallery-nav prev" onClick={prevImage}>
                ❮
              </button>
              <img
                src={property.images[activeImageIndex]}
                alt={`${property.title} - ${activeImageIndex + 1}`}
                className="main-image"
              />
              <button className="gallery-nav next" onClick={nextImage}>
                ❯
              </button>
            </div>

            <div className="thumbnail-container">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    activeImageIndex === index ? "active" : ""
                  }`}
                  onClick={() => changeImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="property-details">
            <div className="property-features">
              {property.bedrooms && (
                <div className="feature">
                  <span className="feature-icon">🛏️</span>
                  <span className="feature-text">
                    {property.bedrooms}{" "}
                    <FormattedMessage
                      id="property.bedrooms"
                      defaultMessage="Bedrooms"
                    />
                  </span>
                </div>
              )}

              {property.bathrooms && (
                <div className="feature">
                  <span className="feature-icon">🚿</span>
                  <span className="feature-text">
                    {property.bathrooms}{" "}
                    <FormattedMessage
                      id="property.bathrooms"
                      defaultMessage="Bathrooms"
                    />
                  </span>
                </div>
              )}

              {property.area && (
                <div className="feature">
                  <span className="feature-icon">📏</span>
                  <span className="feature-text">
                    {property.area}{" "}
                    <FormattedMessage id="area.unit" defaultMessage="m²" />
                  </span>
                </div>
              )}
            </div>

            <div className="property-description">
              <h2>
                <FormattedMessage
                  id="property.description"
                  defaultMessage="Description"
                />
              </h2>
              <p>{property.description}</p>
            </div>

            <div className="property-amenities">
              <h2>
                <FormattedMessage
                  id="property.amenities"
                  defaultMessage="Amenities"
                />
              </h2>
              <ul className="amenities-list">
                {property.features &&
                  property.features.map((feature, index) => (
                    <li key={index} className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">{feature}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="property-map-section">
            <h2>
              <FormattedMessage
                id="property.location"
                defaultMessage="Location"
              />
            </h2>
            <div
              ref={mapContainerRef}
              className="property-map"
              style={{ height: "400px", width: "100%" }}
            ></div>
          </div>

          <div className="property-contact">
            <h2>
              <FormattedMessage
                id="property.contact"
                defaultMessage="Contact"
              />
            </h2>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">
                  <FormattedMessage id="contact.name" defaultMessage="Name" />:
                </span>
                <span className="contact-value">
                  {property.contactInfo.name}
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-label">
                  <FormattedMessage id="contact.phone" defaultMessage="Phone" />
                  :
                </span>
                <span className="contact-value">
                  {property.contactInfo.phone}
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-label">
                  <FormattedMessage id="contact.email" defaultMessage="Email" />
                  :
                </span>
                <span className="contact-value">
                  {property.contactInfo.email}
                </span>
              </div>
            </div>

            <div className="contact-form">
              <h3>
                <FormattedMessage
                  id="contact.sendMessage"
                  defaultMessage="Send a message"
                />
              </h3>
              <form>
                <div className="form-group">
                  <label>
                    <FormattedMessage
                      id="form.name"
                      defaultMessage="Your name"
                    />
                  </label>
                  <input type="text" required />
                </div>

                <div className="form-group">
                  <label>
                    <FormattedMessage
                      id="form.email"
                      defaultMessage="Your email"
                    />
                  </label>
                  <input type="email" required />
                </div>

                <div className="form-group">
                  <label>
                    <FormattedMessage
                      id="form.phone"
                      defaultMessage="Your phone"
                    />
                  </label>
                  <input type="tel" />
                </div>

                <div className="form-group">
                  <label>
                    <FormattedMessage
                      id="form.message"
                      defaultMessage="Message"
                    />
                  </label>
                  <textarea rows="4" required></textarea>
                </div>

                <button type="submit" className="contact-button">
                  <FormattedMessage id="form.send" defaultMessage="Send" />
                </button>
              </form>
            </div>
          </div>

          <div className="property-source">
            <p>
              <FormattedMessage id="property.source" defaultMessage="Source" />:{" "}
              {property.source}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // По умолчанию возвращаем пустой контейнер
  return null;
};

export default PropertyDetailPage;
