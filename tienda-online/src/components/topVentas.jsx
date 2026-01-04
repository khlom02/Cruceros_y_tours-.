import React, { useEffect, useState } from "react";
import { fetchRandomProducts } from "../backend/supabase_client";

const TopVentas = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      const productosSugeridos = await fetchRandomProducts(4);
      setProductos(productosSugeridos);
    };

    cargarProductos();
  }, []);

  return (
    <section className="container-fluid py-5 bg-light mt-5">
      <div className="container">
        <h2 className="fw-bold mb-4">Productos sugeridos</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {productos.map((producto) => (
            <div className="col" key={producto.id}>
              <div className="card position-relative shadow-sm border border-warning">
                <div className="card-img-container">
                  <img
                    src={producto.imagen_url}
                    className="card-img-top"
                    alt={producto.nombre}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title text-center fw-semibold">
                    {producto.nombre}
                  </h5>
                  <p className="card-text text-center text-muted">
                    {producto.descripcion || "Sin descripción"}
                  </p>
                  <h6 className="marca_producto text-center">
                    ${producto.precio}
                  </h6>
                </div>
                <div className="card-footer text-center bg-transparent border-0">
                  <a href={`/detalles/${producto.id}`} className="btn btn-primary btn_top_ventas animate__animated animate__pulse animate__infinite">
                    Ver detalles
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopVentas;