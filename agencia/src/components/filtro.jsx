import React, { useState } from "react";
import "../styles/filtro.css";

export const Filtro = ({ onFilterChange }) => {
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    guests: "",
    location: "",
    transferType: "",
    priceMin: "",
    priceMax: "",
  });

  const ubicaciones = [
    "Corsica, France",
    "Liguria, Italy",
    "Turkey",
    "Galicia, Spain",
  ];

  const tiposTransferencia = [
    "With transfer",
    "Without transfer",
    "Flexible",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nuevosFiltros = { ...filtros, [name]: value };
    setFiltros(nuevosFiltros);
    
    if (onFilterChange) {
      onFilterChange(nuevosFiltros);
    }
  };

  const resetFiltros = () => {
    const filtrosVacios = {
      fechaInicio: "",
      fechaFin: "",
      guests: "",
      location: "",
      transferType: "",
      priceMin: "",
      priceMax: "",
    };
    setFiltros(filtrosVacios);
    if (onFilterChange) {
      onFilterChange(filtrosVacios);
    }
  };

  return (
    <div className="filtro-container">
      <div className="filtro-wrapper">
        <div className="filtro-group">
          <label htmlFor="fechaInicio">Dates</label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleInputChange}
            placeholder="Select dates"
          />
        </div>

        <div className="filtro-group">
          <label htmlFor="guests">Guests</label>
          <select
            id="guests"
            name="guests"
            value={filtros.guests}
            onChange={handleInputChange}
          >
            <option value="">How many guests?</option>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            name="location"
            value={filtros.location}
            onChange={handleInputChange}
          >
            <option value="">Select location</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion} value={ubicacion}>
                {ubicacion}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="transferType">Transfer type</label>
          <select
            id="transferType"
            name="transferType"
            value={filtros.transferType}
            onChange={handleInputChange}
          >
            <option value="">Select transfer</option>
            {tiposTransferencia.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group filtro-price">
          <label>Price Range</label>
          <div className="price-inputs">
            <input
              type="number"
              name="priceMin"
              value={filtros.priceMin}
              onChange={handleInputChange}
              placeholder="Min"
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              name="priceMax"
              value={filtros.priceMax}
              onChange={handleInputChange}
              placeholder="Max"
              min="0"
            />
          </div>
        </div>

        <button className="filtro-reset" onClick={resetFiltros}>
          Reset
        </button>
      </div>
    </div>
  );
};

// Función auxiliar para aplicar filtros a las experiencias
export const aplicarFiltros = (experiencias, filtros) => {
  return experiencias.filter((exp) => {
    // Si no hay filtros activos, mostrar todas las experiencias
    const hayFiltrosActivos = Object.values(filtros).some(v => v !== "");
    if (!hayFiltrosActivos) {
      return true;
    }

    // Filtro por ubicación
    if (filtros.location && exp.ubicacion !== filtros.location) {
      return false;
    }

    // Filtro por rango de precio
    const precio = parseInt(exp.precio);
    if (filtros.priceMin && precio < parseInt(filtros.priceMin)) {
      return false;
    }
    if (filtros.priceMax && precio > parseInt(filtros.priceMax)) {
      return false;
    }

    return true;
  });
};

export default Filtro;
