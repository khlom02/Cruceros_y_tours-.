import React, { useState, useEffect } from "react";
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
        padding: "clamp(20px, 5vw, 40px)",
        color: "#666",
        fontSize: "clamp(0.95rem, 2vw, 1.1rem)"
      }}>
        Cargando trenes y vehículos...
      </div>
    );
  }

  // Secciones a mostrar: max 2 cards cada una + boton para ver el resto en servicios_especiales
  const secciones = [
    {
      titulo: "Trenes",
      data: trenesData.slice(0, 2),
      tipo: "tren",
      seccionId: "trenes",
      vacio: "No hay trenes disponibles",
    },
    {
      titulo: "Vehículos",
      data: vehiculosData.slice(0, 2),
      tipo: "vehiculo",
      seccionId: "vehiculos",
      vacio: "No hay vehículos disponibles",
    },
  ];

  return (
    <div className="trenes-vehiculos-container">
      {secciones.map((seccion) => (
        <div className="trenes-vehiculos-section" key={seccion.seccionId}>
          <h2 className="section-title">{seccion.titulo}</h2>
          <div className="cards-horizontal">
            {seccion.data.length > 0 ? (
              seccion.data.map((tour) => (
                <TourCard
                  key={tour.id}
                  {...tour}
                  onClick={() => navigate(`/detalles?id=${tour.id}&tipo=${seccion.tipo}`)}
                />
              ))
            ) : (
              <p style={{ padding: "20px", color: "#666" }}>{seccion.vacio}</p>
            )}
          </div>
          {/* Boton para ver todos los productos de esta categoria */}
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              style={{
                background: "linear-gradient(135deg, #00b4d8 0%, #023e8a 100%)",
                border: "none",
                borderRadius: "50px",
                padding: "clamp(8px, 1.5vw, 10px) clamp(18px, 4vw, 32px)",
                color: "white",
                fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Chicago Police', sans-serif",
                letterSpacing: "0.5px",
              }}
              onClick={() => navigate(`/servicios_especiales/${seccion.seccionId}`)}
            >
              Ver todos los {seccion.titulo.toLowerCase()}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trenesyvehiculos;