import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../backend/supabase_client";
import Similares from "./similares.jsx";
import TopVentas from "./topVentas.jsx";
import { useCart } from "./cartContext/cartContext.jsx";

export default function Detalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenActual, setImagenActual] = useState(null);
  const [imagenPorDefecto, setImagenPorDefecto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducto = async () => {
      try {
        const productoEncontrado = await fetchProductById(id);

        if (!productoEncontrado) {
          setError("Producto no encontrado.");
          return;
        }

        setProducto(productoEncontrado);

        const posiblesRutas = [
          productoEncontrado.imagen,
          productoEncontrado.imagen_url,
          productoEncontrado.img,
          productoEncontrado.url,
        ];

        const imgValida = posiblesRutas.find((r) => r && r.trim() !== "");

        const finalImg = imgValida || "/default.jpg";

        setImagenes([finalImg]);
        setImagenActual(finalImg);
        setImagenPorDefecto(finalImg);
      } catch (err) {
        setError("Error al cargar el producto.");
      }
    };

    loadProducto();
  }, [id]);

  const handlePagar = () => {
    navigate("/pagos", { state: { producto } });
  };

  if (error) {
    return (
      <div className="container mt-4 mb-5">
        <p className="text-center text-danger">{error}</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container mt-4 mb-5">
        <p className="text-center">Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-6 text-center d-flex justify-content-center align-items-center">
          <div className="galeria-container">
            <div className="miniaturas">
              {imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className={img === imagenPorDefecto ? "activa" : ""}
                  onMouseOver={() => setImagenActual(img)}
                  onMouseOut={() => setImagenActual(imagenPorDefecto)}
                  onClick={() => {
                    setImagenPorDefecto(img);
                    setImagenActual(img);
                  }}
                  style={{ cursor: "pointer", maxWidth: 60, margin: 4 }}
                />
              ))}
            </div>

            <div className="imagen-principal">
              <img
                id="imagenPrincipal"
                src={imagenActual || "/default.jpg"}
                alt=""
                style={{ maxWidth: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h2 className="fw-bold">{producto.nombre}</h2>
          <h6 className="fw-semibold text-uppercase mt-2">
            {producto.descripcion || "Sin descripción disponible"}
          </h6>

          <p className="text-muted" style={{ lineHeight: "1.6" }}>
            {producto.detalles || "Detalles no disponibles para este producto."}
          </p>

          <div className="mt-4">
            <button
              className="btn btn_ir_a_productos btn-lg w-100"
              style={{
                backgroundColor: "#f6a74b",
                color: "white",
                border: "none",
              }}
              onClick={handlePagar}
            >
              Comprar ahora
            </button>

            <button
              className="btn btn_ir_a_productos btn-lg w-100 mt-3"
              style={{
                backgroundColor: "#2f3ad3",
                color: "white",
                border: "none",
              }}
              onClick={() => {
                agregarAlCarrito({
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  imagen: imagenActual || imagenPorDefecto,
                  cantidad: 1,
                });
                alert("Producto agregado al carrito");
              }}
            >
              <i className="bi bi-cart-plus"></i> Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="fw-bold">Productos similares</h3>
        <Similares categoria={producto.categoria_nombre} />
      </div>

      <div className="mt-5">
        <h3 className="fw-bold">Productos más vendidos</h3>
        <TopVentas />
      </div>
    </div>
  );
}
