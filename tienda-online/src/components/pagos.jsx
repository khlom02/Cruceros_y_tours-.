import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./cartContext/cartContext.jsx";

const Pagos = () => {
  const { carrito } = useCart();

  if (carrito.length === 0) {
    return (
      <div className="container py-4">
        <p className="text-center text-danger">
          No se encontraron productos en el carrito.
        </p>
        <div className="text-center">
          <Link to="/productos" className="btn btn-primary">
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="pagos container py-4">
      {/* Grid principal */}
      <div className="row gx-5 gy-4 align-items-start">
        {/* Columna izquierda */}
        <div className="col-md-6">
          <h2 className="section-title mb-3">Resumen del carrito</h2>
          {/* Lista de productos */}
          {carrito.map((producto) => (
            <div
              key={producto.id}
              className="product-card d-flex justify-content-between align-items-center mb-4"
            >
              <div className="d-flex align-items-center">
                <img
                  src={
                    producto.imagen ||
                    producto.imagen_url ||
                    "static/imagenes/default.jpg"
                  }
                  alt="Producto"
                  className="cart-img me-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div>
                  <h6 className="mb-1 fw-semibold">{producto.nombre}</h6>
                  <p className="text-muted small mb-0">
                    Cantidad: {producto.cantidad}
                  </p>
                </div>
              </div>
              <span className="fw-semibold price">
                ${producto.precio * producto.cantidad}
              </span>
            </div>
          ))}

          {/* Total */}
          <div className="d-flex justify-content-between mt-4">
            <h5 className="fw-bold">Total:</h5>
            <h5 className="fw-bold text-success">
              ${total.toFixed(2)}
            </h5>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-md-6">
          <h2 className="section-title mb-3">Detalles del pago</h2>
          <form>
            <div className="mb-3">
              <label
                htmlFor="nombre"
                className="form-label small text-muted"
              >
                Nombre
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="nombre"
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label small text-muted"
              >
                Email
              </label>
              <input
                type="email"
                className="form-control form-control-sm"
                id="email"
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="direccion"
                className="form-label small text-muted"
              >
                Dirección
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="direccion"
                placeholder="Tu dirección"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="telefono"
                className="form-label small text-muted"
              >
                Teléfono
              </label>
              <input
                type="tel"
                className="form-control form-control-sm"
                id="telefono"
                placeholder="Tu teléfono"
              />
            </div>
            <button
              type="submit"
              className="btn btn-warning w-100 py-2 fw-semibold"
            >
              Pagar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
