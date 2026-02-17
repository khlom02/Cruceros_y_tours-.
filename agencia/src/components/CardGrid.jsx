import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Filtro, { aplicarFiltros } from "./filtro";
import { fetchCategories, fetchProductsByCategory } from "../backend/supabase_client";

/**
 * Componente de Card genérico reutilizable
 * Proporciona la estructura visual de una tarjeta de producto
 */
export const ProductCard = ({ 
  imagen, 
  titulo, 
  ubicacion, 
  fechaInicio, 
  fechaFin, 
  precio,
  colorFondo = "verde",
  onClick = null,
  cardRootClassName = "card",
  cardBaseClassName = ""
}) => {
  const colores = {
    verde: "#5a8a66",
    verdeOscuro: "#4a7556",
    grisClaro: "#c9ccc8",
    naranja: "#f5a745"
  };

  const rootClass = cardRootClassName || "card";
  const baseClass = cardBaseClassName || (rootClass.endsWith("__card") ? rootClass.slice(0, -6) : rootClass);

  return (
    <div
      className={rootClass}
      style={{
        backgroundColor: colores[colorFondo] || colores.verde,
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), url(${imagen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div className={`${baseClass}__overlay`}>
        <div className={`${baseClass}__content`}>
          <h3 className={`${baseClass}__titulo`}>{titulo}</h3>
          <p className={`${baseClass}__ubicacion`}>{ubicacion}</p>
          
          <div className={`${baseClass}__fechas`}>
            <span>{fechaInicio} - {fechaFin}</span>
          </div>

          <div className={`${baseClass}__precio`}>
            <span className={`${baseClass}__precio-label`}>from</span>
            <span className={`${baseClass}__precio-valor`}>€ {precio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Grid genérico reutilizable para cualquier categoría
 * Maneja:
 * - Carga de datos desde BD (categoryName)
 * - Filtrado de productos
 * - Navegación a detalles
 * - Estados de carga
 */
export const CardGrid = ({ 
  categoryName = "", 
  detalleTipo = "",
  gridClassName = "tours-grid",
  cardRootClassName = "",
  cardBaseClassName = "",
  cardClassName = "",
  withFilters = true
}) => {
  const navigate = useNavigate();
  const [datosProductos, setDatosProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    guests: "",
    location: "",
    transferType: "",
    priceMin: "",
    priceMax: "",
  });

  const resolvedRootClass = cardRootClassName || cardClassName || "card";
  const resolvedBaseClass = cardBaseClassName || (resolvedRootClass.endsWith("__card") ? resolvedRootClass.slice(0, -6) : resolvedRootClass);

  // Cargar datos desde BD cuando se monta o cambia categoryName
  useEffect(() => {
    if (!categoryName) return;

    let isMounted = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        // Obtener categorías
        const categorias = await fetchCategories();
        const categoria = categorias.find(cat => cat.nombre.toLowerCase() === categoryName.toLowerCase());
        
        if (!isMounted) return;

        if (categoria) {
          // Obtener productos de la categoría
          const productos = await fetchProductsByCategory(categoria.id);
          
          if (!isMounted) return;

          // Mapear datos de la DB al formato que espera el componente
          const productosMapeados = productos.map(producto => ({
            id: producto.id,
            imagen: producto.imagen || "/src/imagenes/default.jpg",
            titulo: producto.titulo,
            ubicacion: producto.ubicacion,
            fechaInicio: producto.fecha_inicio?.slice(5, 10) || "N/A",
            fechaFin: producto.fecha_fin?.slice(5, 10) || "N/A",
            precio: producto.precio.toString(),
            colorFondo: producto.color_fondo || "verde"
          }));
          
          setDatosProductos(productosMapeados);
        } else {
          console.warn(`Categoría '${categoryName}' no encontrada en la DB`);
          setDatosProductos([]);
        }
      } catch (error) {
        console.error(`Error al cargar ${categoryName}:`, error);
        setDatosProductos([]);
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  const handleFilterChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  // Aplicar filtros a los productos
  const productosFiltrados = aplicarFiltros(datosProductos, filtros);

  if (cargando) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px",
        color: "#666",
        fontSize: "1.1rem"
      }}>
        Cargando {categoryName}...
      </div>
    );
  }

  const detalleQuery = detalleTipo ? `&tipo=${detalleTipo}` : "";

  return (
    <>
      {withFilters && <Filtro onFilterChange={handleFilterChange} />}
      <div className={gridClassName}>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              {...producto}
              cardRootClassName={resolvedRootClass}
              cardBaseClassName={resolvedBaseClass}
              onClick={() => navigate(`/detalles?id=${producto.id}${detalleQuery}`)}
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
            No se encontraron productos con esos filtros.
          </div>
        )}
      </div>
    </>
  );
};

export default CardGrid;
