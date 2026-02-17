import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tours_cards.css";
import { fetchCategories, fetchProductsByCategory } from "../backend/supabase_client";

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

export const Trenesyvehiculos = () => {
  const navigate = useNavigate();
  const [trenesData, setTrenesData] = useState([]);
  const [vehiculosData, setVehiculosData] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar datos desde DB al montar el componente (solo UNA VEZ)
  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        // Obtener categorías
        const categorias = await fetchCategories();
        
        if (!isMounted) return;
        
        // Cargar Trenes
        const categoriaTrenes = categorias.find(cat => cat.nombre.toLowerCase() === "trenes");
        if (categoriaTrenes) {
          const productosTrenes = await fetchProductsByCategory(categoriaTrenes.id);
          if (isMounted) {
            const trenesMapeados = productosTrenes.map(producto => ({
              id: producto.id,
              imagen: producto.imagen || "/src/imagenes/tren-default.jpg",
              titulo: producto.titulo,
              ubicacion: producto.ubicacion,
              fechaInicio: producto.fecha_inicio?.slice(5, 10) || "N/A",
              fechaFin: producto.fecha_fin?.slice(5, 10) || "N/A",
              precio: producto.precio.toString(),
              colorFondo: producto.color_fondo || "verde"
            }));
            setTrenesData(trenesMapeados);
          }
        }
        
        if (!isMounted) return;

        // Cargar Vehículos
        const categoriaVehiculos = categorias.find(cat => cat.nombre.toLowerCase() === "vehículos");
        if (categoriaVehiculos) {
          const productosVehiculos = await fetchProductsByCategory(categoriaVehiculos.id);
          if (isMounted) {
            const vehiculosMapeados = productosVehiculos.map(producto => ({
              id: producto.id,
              imagen: producto.imagen || "/src/imagenes/vehiculo-default.jpg",
              titulo: producto.titulo,
              ubicacion: producto.ubicacion,
              fechaInicio: producto.fecha_inicio?.slice(5, 10) || "N/A",
              fechaFin: producto.fecha_fin?.slice(5, 10) || "N/A",
              precio: producto.precio.toString(),
              colorFondo: producto.color_fondo || "verde"
            }));
            setVehiculosData(vehiculosMapeados);
          }
        }
      } catch (error) {
        console.error("Error al cargar trenes y vehículos:", error);
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, []); // Dependencias vacías - carga solo una vez

  if (cargando) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px",
        color: "#666",
        fontSize: "1.1rem"
      }}>
        Cargando trenes y vehículos...
      </div>
    );
  }

  return (
    <div className="trenes-vehiculos-container">
      <div className="trenes-vehiculos-section">
        <h2 className="section-title">Trenes</h2>
        <div className="cards-horizontal">
          {trenesData.length > 0 ? (
            trenesData.map((tour) => (
              <TourCard 
                key={tour.id} 
                {...tour}
                onClick={() => navigate(`/detalles?id=${tour.id}&tipo=tren`)}
              />
            ))
          ) : (
            <p style={{ padding: "20px", color: "#666" }}>No hay trenes disponibles</p>
          )}
        </div>
      </div>
      
      <div className="trenes-vehiculos-section">
        <h2 className="section-title">Vehículos</h2>
        <div className="cards-horizontal">
          {vehiculosData.length > 0 ? (
            vehiculosData.map((tour) => (
              <TourCard 
                key={tour.id} 
                {...tour}
                onClick={() => navigate(`/detalles?id=${tour.id}&tipo=vehiculo`)}
              />
            ))
          ) : (
            <p style={{ padding: "20px", color: "#666" }}>No hay vehículos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trenesyvehiculos;