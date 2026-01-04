import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cartContext/cartContext.jsx";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { carrito } = useCart();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await signOut();
    if (!error) {
      navigate("/");
    }
    setLoggingOut(false);
  };

  return (
    <>
      {/* Barra de promociones */}
      <div className="promociones text-white text-center fw-semibold py-2">
        Tu delivery sale GRATIS sobre los $10 o más usando el código #KamimaStore001
      </div>

      {/* Header */}
      <header className="">
        <div className="container-fluid bg-black py-3">
          {/* Primera fila: Logo, Búsqueda, Login/Registro y Carrito */}
          <div className="row align-items-center mb-2">
            {/* Logo */}
            <div className="col-md-3 col-lg-2 d-flex align-items-center kamima_store">
              <Link to="/" className="fs-4 fw-bold text-decoration-none kamima_store">
                Kamima Store
              </Link>
            </div>

            {/* Barra de búsqueda */}
            <div className="col-md-4 col-lg-5 d-flex align-items-center">
              <form className="w-100">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-dark text-white border-secondary">
                    <i className="bi bi-search"></i>
                  </span>
                  <input type="search" className="form-control border-secondary" placeholder="Buscar..." aria-label="Buscar" />
                </div>
              </form>
            </div>

            {/* Botones Login / Registro / Usuario y Carrito */}
            <div className="col-md-5 col-lg-5 d-flex align-items-center justify-content-end gap-3">
              {authLoading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : user ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-light btn-sm dropdown-toggle"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {user.email?.split("@")[0] || "Usuario"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li>
                        <span className="dropdown-item-text">
                          <small className="text-muted">{user.email}</small>
                        </span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                          disabled={loggingOut}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/formulario" className="btn btn-outline-light btn-sm">
                    Login
                  </Link>
                  <Link to="/registro" className="btn btn-warning btn-sm text-dark fw-semibold">
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Carrito */}
              <div className="d-flex align-items-center position-relative header-cart">
                <Link to="/carrito" className="nav-link text-white d-flex align-items-center">
                  <i className="bi bi-cart3 me-2"></i> 
                  <span className="d-none d-md-inline">Carrito</span>
                </Link>
                {totalItems > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.75rem", minWidth: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Segunda fila: Menú de navegación */}
          <div className="row">
            <div className="col-12">
              <ul className="nav mb-0 d-flex align-items-center flex-wrap">
                {/* Enlaces de E-commerce */}
                <li className="nav-item">
                  <Link to="/" className="nav-link px-2 text-white">
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/productos" className="nav-link px-2 text-white">
                    Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/formulario" className="nav-link px-2 text-white">
                    Contacto
                  </Link>
                </li>
                {/* Enlaces adicionales */}
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-white">
                    Dirección <i className="bi bi-geo-alt-fill"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-white">
                    WhatsApp <i className="bi bi-whatsapp"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-white">
                    Redes Sociales <i className="bi bi-instagram"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-white">
                    Correo <i className="bi bi-envelope-open-fill"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
