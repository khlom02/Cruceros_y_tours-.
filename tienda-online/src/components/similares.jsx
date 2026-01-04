import React, { useEffect, useState } from "react";
import { fetchRandomProducts } from "../backend/supabase_client";

export default function Similares() {
  const [productosSimilares, setProductosSimilares] = useState([]);

  useEffect(() => {
    const loadProductosSimilares = async () => {
      try {
        const productos = await fetchRandomProducts(4); // Obtener 4 productos aleatorios
        setProductosSimilares(productos);
      } catch (error) {
        console.error("Error al cargar productos similares:", error);
      }
    };

    loadProductosSimilares();
  }, []);

  return (
    <>
      <h2 className="text-center">Productos Similares</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4 mb-5">
        {productosSimilares.map((producto) => (
          <div
            key={producto.id}
            className="col producto"
            data-categoria={producto.categoria_id}
          >
            <div className="card h-100 text-center shadow-sm">
              <img
                src={producto.imagen_url || "static/imagenes/default.jpg"}
                className="card-img-top"
                alt={producto.nombre}
              />
              <div className="card-body">
                <h6 className="card-title mb-1">{producto.nombre}</h6>
                <p className="card-text text-muted">${producto.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}