import React from "react";
import PropertyCard from "./PropertyCard";

const PropertyFeatured = () => {
  // Это временные демо-данные
  const featuredProperties = [
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
      main_image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
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
      main_image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500",
    },
    {
      id: 3,
      title: "Офисное помещение класса A",
      price: 250000,
      currency: "USD",
      location: 'Москва, Бизнес-центр "Высота"',
      bedrooms: null,
      bathrooms: 1,
      area: 200,
      type: "commercial",
      transaction_type: "SALE",
      main_image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500",
    },
  ];

  return (
    <div className="featured-properties">
      {featuredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyFeatured;
