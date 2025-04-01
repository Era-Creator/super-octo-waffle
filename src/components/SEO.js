import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import geoService from "../services/geoService";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  country,
  language,
  type = "website",
  structuredData,
  canonical,
}) => {
  const intl = useIntl();

  // Используем переданный заголовок или создаем по умолчанию
  const pageTitle = title || geoService.getCountrySeoTitle(country, language);

  // Используем переданное описание или берем из переводов
  const pageDescription =
    description || intl.formatMessage({ id: "seo.home.description" });

  // Формируем keywords, если переданы
  const pageKeywords = keywords
    ? Array.isArray(keywords)
      ? keywords.join(", ")
      : keywords
    : intl.formatMessage({
        id: "seo.keywords",
        defaultMessage: "real estate, property, rent, sale",
      });

  // Определяем полный URL страницы
  const pageUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  // Определяем URL изображения для Open Graph
  const pageImage =
    image ||
    `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/images/og-image.jpg`;

  // Определяем канонический URL
  const canonicalUrl = canonical || pageUrl;

  // Определяем список альтернативных языков
  const getAlternateLinks = () => {
    if (!country) return [];

    return geoService.getSupportedLanguages(country).map((lang) => ({
      rel: "alternate",
      hrefLang: lang,
      href: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/${geoService.countryCodeToSlug(country)}/${lang}`,
    }));
  };

  // Формируем структурированные данные для Schema.org
  const getStructuredData = () => {
    // Базовая структура для всех страниц
    const baseStructure = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "WebPage",
      headline: pageTitle,
      description: pageDescription,
      url: pageUrl,
      inLanguage: language,
      publisher: {
        "@type": "Organization",
        name: "RealEstate",
        logo: {
          "@type": "ImageObject",
          url: `${
            typeof window !== "undefined" ? window.location.origin : ""
          }/images/logo.png`,
        },
      },
    };

    // Если переданы дополнительные структурированные данные, объединяем их
    if (structuredData) {
      return {
        ...baseStructure,
        ...structuredData,
      };
    }

    return baseStructure;
  };

  return (
    <Helmet>
      {/* Основные метатеги */}
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />

      {/* Канонический URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Альтернативные языковые версии */}
      {getAlternateLinks().map((link, index) => (
        <link
          key={index}
          rel={link.rel}
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}

      {/* Open Graph метатеги для социальных сетей */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:locale" content={language} />

      {/* Twitter Card метатеги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Структурированные данные для Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>

      {/* Метатеги для запрета индексации страниц в разработке */}
      {process.env.NODE_ENV !== "production" && (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </Helmet>
  );
};

export default SEO;
