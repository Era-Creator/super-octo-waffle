// src/utils/sitemapGenerator.js
import geoService from "../services/geoService";

/**
 * Утилита для генерации файла sitemap.xml
 *
 * В реальном приложении эта логика должна выполняться на сервере
 * Здесь представлена концепция для понимания структуры
 */
export const generateSitemap = async (
  baseUrl = "https://realestate.example.com"
) => {
  // Список поддерживаемых стран
  const countries = [
    { code: "UA", slug: "ukraine" },
    { code: "PL", slug: "poland" },
    { code: "AZ", slug: "azerbaijan" },
    { code: "GE", slug: "georgia" },
    { code: "US", slug: "global" },
  ];

  // Список поддерживаемых языков
  const languages = ["en", "uk", "pl", "ka"];

  // Список статических страниц
  const staticPages = [
    "", // Главная
    "/properties", // Список объектов
    "/about", // О нас
    "/contact", // Контакты
    "/privacy", // Политика конфиденциальности
    "/terms", // Условия использования
  ];

  let sitemapEntries = [];

  // Добавляем статические страницы для каждой комбинации страны и языка
  countries.forEach((country) => {
    const supportedLangs = geoService.getSupportedLanguages(country.code);

    supportedLangs.forEach((lang) => {
      staticPages.forEach((page) => {
        const path = `/${country.slug}/${lang}${page}`;
        const priority = page === "" ? "1.0" : "0.8"; // Приоритет для главной страны выше

        sitemapEntries.push({
          loc: `${baseUrl}${path}`,
          lastmod: new Date().toISOString().split("T")[0],
          changefreq: page === "" ? "daily" : "weekly",
          priority,
        });
      });
    });
  });

  // Функция генерации тегов для sitemap.xml
  const generateSitemapXML = (entries) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    entries.forEach((entry) => {
      xml += `  <url>\n`;
      xml += `    <loc>${entry.loc}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;

      // Добавляем альтернативные языковые версии (hreflang)
      if (entry.alternates) {
        entry.alternates.forEach((alt) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />\n`;
        });
      }

      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  // В реальном приложении здесь была бы логика получения динамических данных
  // Например, получение всех объектов недвижимости из базы данных
  // И добавление их в sitemap

  // Пример:
  // const properties = await api.fetchAllProperties();
  // properties.forEach(property => {
  //   countries.forEach(country => {
  //     languages.forEach(lang => {
  //       if (property.country === country.code) {
  //         sitemapEntries.push({
  //           loc: `${baseUrl}/${country.slug}/${lang}/properties/${property.id}`,
  //           lastmod: property.updatedAt.split("T")[0],
  //           changefreq: "monthly",
  //           priority: "0.7"
  //         });
  //       }
  //     });
  //   });
  // });

  // Генерируем финальный XML
  const sitemapXML = generateSitemapXML(sitemapEntries);
  return sitemapXML;
};

// Экспортируем функцию для использования, например, в бэкенде
export default generateSitemap;
