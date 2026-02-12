import React, { useState } from "react";
import "../styles/aerolineas.css";

const Aerolineas = () => {
  const [selectedAirline, setSelectedAirline] = useState(null);
  const defaultLogo = "/src/imagenes/tap_air.png";
  const resolveLogo = (logo) => (logo && logo.trim() ? logo : defaultLogo);
  const getLogoStyle = (airline) => ({
    objectFit: airline.logoFit || "cover",
    transform: `scale(${airline.logoScale ?? 1})`,
  });

  const airlines = [
    {
      id: 1,
      nombre: "Tap air Portugal",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/tap_air.png",
      logoFit: "contain",
      logoScale: 1
    },
    {
      id: 2,
      nombre: "Copa Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/copa_airlines.jpg",
      logoFit: "cover",
      logoScale: 1.1
    },
    {
      id: 3,
      nombre: "turpial airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/turpial.png",
      logoFit: "contain",
      logoScale: 1.5
    },
    {
      id: 4,
      nombre: "Iberia",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/iberia.png",
      logoFit: "contain",
      logoScale: 1.5
    },
    {
      id: 5,
      nombre: "Air Europa",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/air_europa.png",
      logoFit: "contain",
      logoScale: 3
    },
    {
      id: 6,
      nombre: "Latam Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/latam.png",
      logoFit: "contain",
      logoScale: 1
    },
    {
      id: 7,
      nombre: "Avior Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/avior.jpg",
      logoFit: "cover",
      logoScale: 1
    },
    {
      id: 8,
      nombre: "Aeropostal",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/aeropostal.png",
      logoFit: "contain",
      logoScale: 1.5
    },
    {
      id: 9,
      nombre: "Aerocaribe",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/aerocaribe.png",
      logoFit: "contain",
      logoScale: 1
    },
    {
      id: 10,
      nombre: "Venezolana de aviación",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/venezolana.png",
      logoFit: "contain",
      logoScale: 1
    },
    {
      id: 11,
      nombre: "Rutaca Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/rutaca.jpeg",
      logoFit: "cover",
      logoScale: 1
    },
    {
      id: 12,
      nombre: "Turkish Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/turkish.png",
      logoFit: "contain",
      logoScale: 1
    },
    {
      id: 13,
      nombre: "American Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/american_airlines.png",
      logoFit: "contain",
      logoScale: 2
    },
    {
      id: 14,
      nombre: "Estelar Latinoamérica",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/estelar.jpeg",
      logoFit: "cover",
      logoScale: 1
    },
    {
      id: 15,
      nombre: "Plus Ultra Líneas Aéreas",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/plus_ultra.png",
      logoFit: "contain",
      logoScale: 1
    },
      {
      id: 16,
      nombre: "Conviasa",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/conviasa.png",
      logoFit: "contain",
      logoScale:1
    },
      {
      id: 17,
      nombre: "Gol Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/gol.png",
      logoFit: "contain",
      logoScale: 1
    },  {
      id: 18,
      nombre: "Bolivariana de Aviación",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "/src/imagenes/bolivariana.png",
      logoFit: "contain",
      logoScale: 1.5
    }
  ];

  const defaultAirline = {
    tarifa: "Haz clic en una de las opciones para ver los detalles",
    logo: "",
    logoFit: "cover",
    logoScale: 1
  };

  const airline = selectedAirline || defaultAirline;

  return (
    <div className="aerolineas-container">
      <div className="aerolineas-content">
        {/* Sección de botones */}
        <div className="aerolineas-buttons">
          {airlines.map((airline) => (
            <button
              key={airline.id}
              className={`airline-btn ${selectedAirline?.id === airline.id ? "active" : ""}`}
              data-airline={airline.nombre?.toLowerCase() || ""}
              onClick={() => setSelectedAirline(airline)}
            >
              <img
                className="airline-btn-logo"
                src={resolveLogo(airline.logo)}
                style={getLogoStyle(airline)}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>

        {/* Sección de tarjeta de información */}
        <div className="airline-card">
          <div className="airline-card-content">
            <img
              className="airline-card-logo"
              src={resolveLogo(airline.logo)}
              style={getLogoStyle(airline)}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <p className="airline-tarifa">{airline.tarifa}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aerolineas;
