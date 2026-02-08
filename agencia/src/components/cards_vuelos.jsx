
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/card_vuelos.css";
import Filtro, { aplicarFiltros } from "./filtro";

export const Card_vuelos = ({ 
  imagen, 
  titulo, 
  ubicacion, 
  fechaInicio, 
  fechaFin, 
  precio,
  colorFondo = "verde",
  onClick = null
}) => {
  const colores = {
    verde: "#5a8a66",
    verdeOscuro: "#4a7556",
    grisClaro: "#c9ccc8",
    naranja: "#f5a745"
  };

  return (
    <div
      className="grid-experiencia__card"
      style={{
        backgroundColor: colores[colorFondo] || colores.verde,
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), url(${imagen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div className="grid-vuelos__overlay">
        <div className="grid-vuelos__content">
          <h3 className="grid-vuelos__titulo">{titulo}</h3>
          <p className="grid-vuelos__ubicacion">{ubicacion}</p>
          
          <div className="grid-vuelos__fechas">
            <span>{fechaInicio} - {fechaFin}</span>
          </div>

          <div className="grid-vuelos__precio">
            <span className="grid-vuelos__precio-label">from</span>
            <span className="grid-vuelos__precio-valor">€ {precio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GridVuelos = ({ vuelos = [] }) => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    guests: "",
    location: "",
    transferType: "",
    priceMin: "",
    priceMax: "",
  });

  // Vuelos por defecto si no se proporcionan
  const vuelosDefault = [
    {
      id: 1,
      imagen: "/src/imagenes/MSC.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Corsica, France",
      fechaInicio: "09/08",
      fechaFin: "14/08/2026",
      precio: "720",
      colorFondo: "verde"
    },
    {
      id: 2,
      imagen: "/src/imagenes/ncl.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Liguria, Italy",
      fechaInicio: "11/08",
      fechaFin: "15/08/2026",
      precio: "510",
      colorFondo: "verdeOscuro"
    },
    {
      id: 3,
      imagen: "/src/imagenes/royal_caribean.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Turkey",
      fechaInicio: "12/08",
      fechaFin: "17/08/2026",
      precio: "680",
      colorFondo: "grisClaro"
    },
    {
      id: 4,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },
    {
     id: 5,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },{
      id: 6,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },
    {
      id: 7,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },
    {
      id: 8,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },
    {
      id: 9,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },
    {
      id: 10,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },
    {
      id: 11,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    },
    {
      id: 12,
      imagen: "/src/imagenes/celebrity.jpg",
      titulo: "Torre de Pareis, Mallorca",
      ubicacion: "Galicia, Spain",
      fechaInicio: "19/08",
      fechaFin: "22/08/2026",
      precio: "490",
      colorFondo: "naranja"
    }
  ];

  const datosExperiencias = experiencias.length > 0 ? experiencias : experienciasDefault;

  const handleFilterChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  // Aplicar filtros a las experiencias
  const experienciasFiltradasFinal = aplicarFiltros(datosExperiencias, filtros);

  return (
    <>
      <Filtro onFilterChange={handleFilterChange} />
      <div className="tours-grid">
        {experienciasFiltradasFinal.length > 0 ? (
          experienciasFiltradasFinal.map((experiencia) => (
            <CardExperiencias
              key={experiencia.id}
              {...experiencia}
              onClick={() => navigate(`/detalles?id=${experiencia.id}`)}
            />
          ))
        ) : (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "40px",
            color: "#666",
            fontSize: "1.1rem"
          }}>
            No experiences found matching your filters.
          </div>
        )}
      </div>
    </>
  );
};

export default GridVuelos;
