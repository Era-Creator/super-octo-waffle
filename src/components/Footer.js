import React from "react";
import { Link, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import geoService from "../services/geoService";

const Footer = ({ locale }) => {
  const intl = useIntl();
  const params = useParams();

  // Получаем slug страны из URL или используем глобальный
  const countrySlug = params.country || "global";

  // Получаем текущий язык из URL или из props
  const language = params.lang || locale || "en";

  // Список поддерживаемых языков для футера
  const languages = [
    { code: "en", name: "English" },
    { code: "uk", name: "Українська" },
    { code: "pl", name: "Polski" },
    { code: "ka", name: "ქართული" },
  ];

  // Список поддерживаемых стран для футера
  const countries = [
    {
      code: "UA",
      name: intl.formatMessage({ id: "country.ukraine" }),
      slug: "ukraine",
    },
    {
      code: "PL",
      name: intl.formatMessage({ id: "country.poland" }),
      slug: "poland",
    },
    {
      code: "AZ",
      name: intl.formatMessage({ id: "country.azerbaijan" }),
      slug: "azerbaijan",
    },
    {
      code: "GE",
      name: intl.formatMessage({ id: "country.georgia" }),
      slug: "georgia",
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-languages">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              to={`/${countrySlug}/${lang.code}`}
              className={`footer-language ${
                language === lang.code ? "active" : ""
              }`}
            >
              {lang.name}
            </Link>
          ))}
        </div>

        <div className="footer-links">
          {countries.map((country) => (
            <Link key={country.code} to={`/${country.slug}/${language}`}>
              {country.name}
            </Link>
          ))}
        </div>

        <div className="footer-links">
          <Link to={`/${countrySlug}/${language}/about`}>
            <FormattedMessage id="footer.about" defaultMessage="About" />
          </Link>
          <Link to={`/${countrySlug}/${language}/contact`}>
            <FormattedMessage id="footer.contact" defaultMessage="Contact" />
          </Link>
          <Link to={`/${countrySlug}/${language}/privacy`}>
            <FormattedMessage
              id="footer.privacy"
              defaultMessage="Privacy Policy"
            />
          </Link>
          <Link to={`/${countrySlug}/${language}/terms`}>
            <FormattedMessage
              id="footer.terms"
              defaultMessage="Terms of Service"
            />
          </Link>
          <Link to={`/${countrySlug}/${language}/sitemap`}>
            <FormattedMessage id="footer.sitemap" defaultMessage="Sitemap" />
          </Link>
        </div>

        <div className="footer-social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <span className="social-icon">📘</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <span className="social-icon">🐦</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <span className="social-icon">📸</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <span className="social-icon">💼</span>
          </a>
        </div>

        <p>
          &copy; {new Date().getFullYear()} RealEstate.{" "}
          <FormattedMessage
            id="footer.rights"
            defaultMessage="All rights reserved."
          />
        </p>

        {/* Микроразметка для поисковых систем */}
        <div
          itemScope
          itemType="http://schema.org/Organization"
          style={{ display: "none" }}
        >
          <span itemProp="name">RealEstate</span>
          <div
            itemProp="address"
            itemScope
            itemType="http://schema.org/PostalAddress"
          >
            <span itemProp="streetAddress">123 Main Street</span>
            <span itemProp="addressLocality">City</span>
            <span itemProp="addressRegion">Region</span>
            <span itemProp="postalCode">12345</span>
            <span itemProp="addressCountry">
              {geoService.slugToCountryCode(countrySlug)}
            </span>
          </div>
          <span itemProp="telephone">+1-234-567-8900</span>
          <span itemProp="email">contact@example.com</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
