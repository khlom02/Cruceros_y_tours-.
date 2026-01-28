import React, { useState } from "react";
import "../styles/aerolineas.css";

const Aerolineas = () => {
  const [selectedAirline, setSelectedAirline] = useState(null);

  const airlines = [
    {
      id: 1,
      nombre: "Albatros airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 2,
      nombre: "Turpial Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 3,
      nombre: "Tap Portugal",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 4,
      nombre: "Air Europa",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 5,
      nombre: "Iberia",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 6,
      nombre: "Aeropostal",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 7,
      nombre: "Boliviana de Aviación",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 8,
      nombre: "Aerocaribe",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 9,
      nombre: "Avior Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 10,
      nombre: "Rutaca Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 11,
      nombre: "Laser Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 12,
      nombre: "Venezolana",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 13,
      nombre: "PlusUltra",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 14,
      nombre: "United Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    },
    {
      id: 15,
      nombre: "American Airlines",
      tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%",
      logo: "✈️"
    }
  ];

  const defaultAirline = {
    nombre: "Selecciona una aerolínea",
    tarifa: "Haz clic en una de las opciones para ver los detalles"
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
              onClick={() => setSelectedAirline(airline)}
            >
              {airline.nombre}
            </button>
          ))}
        </div>

        {/* Sección de tarjeta de información */}
        <div className="airline-card">
          <div className="airline-card-content">
            <h3 className="airline-name">{airline.nombre}</h3>
            <p className="airline-tarifa">{airline.tarifa}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aerolineas;
