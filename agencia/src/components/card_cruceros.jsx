
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/card_cruceros.css";
import Filtro, { aplicarFiltros } from "./filtro";

export const Card_cruceros = ({ 
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
      className="card_cruceros"
      style={{
        backgroundColor: colores[colorFondo] || colores.verde,
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), url(${imagen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div className="card_cruceros__overlay">
        <div className="card_cruceros__content">
          <h3 className="card_cruceros__titulo">{titulo}</h3>
          <p className="card_cruceros__ubicacion">{ubicacion}</p>
          
          <div className="card_cruceros__fechas">
            <span>{fechaInicio} - {fechaFin}</span>
          </div>

          <div className="card_cruceros__precio">
            <span className="card_cruceros__precio-label">from</span>
            <span className="card_cruceros__precio-valor">€ {precio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GridCruceros = ({ cruceros = [] }) => {
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

  // Experiencias por defecto si no se proporcionan
  const crucerosDefault = [
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
    }
  ];

  const datosCruceros = cruceros.length > 0 ? cruceros : crucerosDefault;

  const handleFilterChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  // Aplicar filtros a las experiencias
  const crucerosFiltradosFinal = aplicarFiltros(datosCruceros, filtros);

  return (
    <>
      <Filtro onFilterChange={handleFilterChange} />
      <div className="tours-grid">
        {crucerosFiltradosFinal.length > 0 ? (
          crucerosFiltradosFinal.map((crucero) => (
            <Card_cruceros
              key={crucero.id}
              {...crucero}
              onClick={() => navigate(`/detalles?id=${crucero.id}&tipo=crucero`)}
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
            No se encontraron cruceros con esos filtros.
          </div>
        )}
      </div>
    </>
  );
};

export default GridCruceros;
