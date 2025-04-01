// src/components/Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Header = ({ changeLanguage, currentLocale }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "uk", name: "Українська" },
    { code: "pl", name: "Polski" },
    { code: "ka", name: "ქართული" },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">RealEstate</Link>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <ul>
            <li>
              <Link to="/properties">
                <FormattedMessage
                  id="menu.properties"
                  defaultMessage="Properties"
                />
              </Link>
            </li>
            <li>
              <Link to="/properties?transaction=rent">
                <FormattedMessage id="menu.rent" defaultMessage="Rent" />
              </Link>
            </li>
            <li>
              <Link to="/properties?transaction=buy">
                <FormattedMessage id="menu.buy" defaultMessage="Buy" />
              </Link>
            </li>
          </ul>
        </nav>

        <div className="user-controls">
          <div className="language-selector">
            <select
              value={currentLocale}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-links">
            <Link to="/login">
              <FormattedMessage id="auth.login" defaultMessage="Login" />
            </Link>
            <Link to="/register">
              <FormattedMessage id="auth.register" defaultMessage="Register" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
