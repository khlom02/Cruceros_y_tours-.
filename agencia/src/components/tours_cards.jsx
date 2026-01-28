import React from "react";
import "../styles/tours_cards.css";

export const TourCard = ({ 
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
      className="tour-card"
      style={{
        backgroundColor: colores[colorFondo] || colores.verde,
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), url(${imagen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div className="tour-card__overlay">
        <div className="tour-card__content">
          <h3 className="tour-card__titulo">{titulo}</h3>
          <p className="tour-card__ubicacion">{ubicacion}</p>
          
          <div className="tour-card__fechas">
            <span>{fechaInicio} - {fechaFin}</span>
          </div>

          <div className="tour-card__precio">
            <span className="tour-card__precio-label">from</span>
            <span className="tour-card__precio-valor">€{precio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToursCardsGrid = ({ tours = [] }) => {
  // Tours por defecto si no se proporcionan
  const toursDefault = [
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
    }
  ];

  const datosTours = tours.length > 0 ? tours : toursDefault;

  return (
    <div className="tours-grid">
      {datosTours.map((tour) => (
        <TourCard key={tour.id} {...tour} />
      ))}
    </div>
  );
};

export default ToursCardsGrid;
