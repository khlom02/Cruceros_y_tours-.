import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./cartContext/cartContext.jsx";
import '../styles/pagos.css';

const Pagos = () => {
  const { carrito } = useCart();

  if (carrito.length === 0) {
    return (
      <div className="container py-4">
        <p className="text-center text-danger">
          No se encontraron productos en el carrito.
        </p>
        <div className="text-center">
          <Link to="/experiencias" className="btn btn-primary">
            Volver a Experiencias
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
                    "https://via.placeholder.com/100"
                  }
                  alt="Producto"
                  className="cart-img me-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" }}
                />
                <div>
                  <h5 className="mb-1">{producto.nombre}</h5>
                  <p className="mb-0 text-muted">
                    ${producto.precio} x {producto.cantidad}
                  </p>
                </div>
              </div>
              <div>
                <p className="fw-bold mb-0">
                  ${producto.precio * producto.cantidad}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Columna derecha */}
        <div className="col-md-6">
          <div className="datos-envio-card">
            <h2 className="section-title mb-4">Datos de envío</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  placeholder="Calle, número, ciudad"
                />
              </div>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="resumen-pedido-card mt-4">
            <h3 className="mb-3">Resumen del pedido</h3>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${total}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <hr className="divider-line" />
            <div className="d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <strong className="price">${total}</strong>
            </div>
            <button className="btn btn-primary w-100 btn_ir_a_productos">
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
