// src/components/PropertyCard.js
import React from "react";
import { Link } from "react-router-dom";
import { FormattedNumber, FormattedMessage } from "react-intl";

const PropertyCard = ({ property }) => {
  // Деструктурируем свойства с проверкой на null/undefined
  const {
    id,
    title = "Название недоступно", // Значения по умолчанию
    price = 0,
    currency = "USD",
    location = "Местоположение не указано",
    bedrooms = null,
    bathrooms = null,
    area = null,
    type = "unknown",
    transaction_type = "SALE",
    main_image = "https://via.placeholder.com/300x200?text=No+Image",
  } = property || {};

  return (
    <div className="property-card">
      <div className="property-image">
        <img
          src={main_image}
          alt={title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=Error";
          }}
        />
        <div className="property-badge">
          {transaction_type === "RENT" ? (
            <span className="rent-badge">
              <FormattedMessage id="property.rent" defaultMessage="For Rent" />
            </span>
          ) : (
            <span className="sale-badge">
              <FormattedMessage id="property.sale" defaultMessage="For Sale" />
            </span>
          )}
        </div>
      </div>

      <div className="property-content">
        <h3 className="property-title">
          <Link to={`/properties/${id}`}>{title}</Link>
        </h3>

        <p className="property-location">{location}</p>

        <div className="property-price">
          <FormattedNumber
            value={price}
            style="currency"
            currency={currency || "USD"}
          />
          {transaction_type === "RENT" && (
            <span className="price-period">
              <FormattedMessage
                id="property.perMonth"
                defaultMessage="/month"
              />
            </span>
          )}
        </div>

        <div className="property-features">
          {bedrooms && (
            <div className="feature">
              <span className="feature-icon">🛏️</span>
              <span className="feature-text">{bedrooms}</span>
            </div>
          )}

          {bathrooms && (
            <div className="feature">
              <span className="feature-icon">🚿</span>
              <span className="feature-text">{bathrooms}</span>
            </div>
          )}

          {area && (
            <div className="feature">
              <span className="feature-icon">📏</span>
              <span className="feature-text">{area} м²</span>
            </div>
          )}

          {type && (
            <div className="feature">
              <span className="feature-icon">🏠</span>
              <span className="feature-text">
                <FormattedMessage
                  id={`property.type.${type.toLowerCase()}`}
                  defaultMessage={type}
                />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
