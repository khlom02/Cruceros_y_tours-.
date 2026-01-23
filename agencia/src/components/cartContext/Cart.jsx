import React from "react";
import { useCart } from "./cartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/cart.css';

const Cart = () => {
  const { carrito, actualizarCantidad } = useCart();
  const navigate = useNavigate();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleCantidadChange = (id, incremento) => {
    actualizarCantidad(id, incremento);
  };

  const handleProceedToPayment = () => {
    if (carrito.length > 0) {
      navigate("/pagos", { state: { carrito } });
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Tu Carrito de Compras</h1>

      {carrito.length === 0 ? (
        <div className="alert alert-info" role="alert">
          Tu carrito está vacío. <Link to="/productos">¡Explora nuestros productos!</Link>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-8">
              {carrito.map((item) => (
                <div key={item.id} className="card mb-3 shadow-sm">
                  <div className="row g-0 align-items-center">
                    <div className="col-md-3">
                      <img
                        src={item.imagen || item.imagen_url || "static/imagenes/default.jpg"}
                        className="img-fluid rounded-start"
                        alt={item.nombre}
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="card-body py-2">
                        <h5 className="card-title mb-1">{item.nombre}</h5>
                        <p className="card-text fw-bold">
                          Precio unitario: ${item.precio}
                        </p>
                        <p className="card-text fw-bold">
                          Precio total: ${item.precio * item.cantidad}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3 text-end pe-3">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm px-2"
                          onClick={() => handleCantidadChange(item.id, -1)}
                        >
                          −
                        </button>
                        <span className="mx-2">{item.cantidad}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm px-2"
                          onClick={() => handleCantidadChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">Resumen del Pedido</h4>
                  <hr />
                  <p className="d-flex justify-content-between">
                    <span>Total de artículos:</span>
                    <span className="fw-bold">{totalItems}</span>
                  </p>
                  <p className="d-flex justify-content-between fs-5">
                    <span>Total a pagar:</span>
                    <span className="fw-bold text-success">
                      ${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}
                    </span>
                  </p>
                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={handleProceedToPayment}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
