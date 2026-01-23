import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cartContext/cartContext.jsx";
import { useAuth } from "../contexts/AuthContext";
import bannerImage from "../imagenes/banner.png";
import '../styles/header.css';

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
    <header
      className="position-relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${bannerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar Superior */}
      <nav className="container-fluid py-3">
        <div className="row align-items-center">
          {/* Menú de navegación izquierda */}
          <div className="col-md-8">
            <ul className="nav mb-0 d-flex align-items-center flex-wrap gap-1">
               <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link px-3 text-dark"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "1.5rem",
                    transition: "all 0.3s",
                    borderBottom: "2px solid transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.borderBottom = "2px solid #40E0D0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderBottom = "2px solid transparent")
                  }
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/experiencias"
                  className="nav-link px-3 text-dark"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "1.5rem",
                    transition: "all 0.3s",
                    borderBottom: "2px solid transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.borderBottom = "2px solid #40E0D0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderBottom = "2px solid transparent")
                  }
                >
                  Experiencias
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link px-3 text-dark"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "1.5rem",
                    transition: "all 0.3s",
                    borderBottom: "2px solid transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.borderBottom = "2px solid #40E0D0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderBottom = "2px solid transparent")
                  }
                >
                  Cruceros
                </Link>
              </li>
              <li className="nav-item">
                <a
                  href="#tours"
                  className="nav-link px-3 text-dark"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "1.5rem",
                    transition: "all 0.3s",
                    borderBottom: "2px solid transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.borderBottom = "2px solid #40E0D0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderBottom = "2px solid transparent")
                  }
                >
                  Tours
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/contacto"
                  className="nav-link px-3 text-dark"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "1.5rem",
                    transition: "all 0.3s",
                    borderBottom: "2px solid transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.borderBottom = "2px solid #40E0D0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderBottom = "2px solid transparent")
                  }
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Sign In y Carrito - derecha */}
          <div className="col-md-4 d-flex align-items-center justify-content-end gap-3">
            {authLoading ? (
              <div
                className="spinner-border spinner-border-sm text-white"
                role="status"
              >
                <span className="visually-hidden">Cargando...</span>
              </div>
            ) : user ? (
              <div className="d-flex align-items-center gap-2">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      fontFamily: "'Lora', serif",
                      borderRadius: "25px",
                      padding: "8px 20px",
                    }}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user.email?.split("@")[0] || "Usuario"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <span className="dropdown-item-text">
                        <small className="text-muted">{user.email}</small>
                      </span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
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
              <Link
                to="/registro"
                className="btn"
                style={{
                  fontFamily: "'Lora', serif",
                  borderRadius: "25px",
                  padding: "8px 25px",
                  transition: "all 0.3s",
                  fontSize: "1.5rem",
                  border: "2px solid #333",
                  color: "#333",
                  backgroundColor: "transparent"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#40E0D0";
                  e.target.style.borderColor = "#40E0D0";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderColor = "#333";
                  e.target.style.color = "#333";
                }}
              >
                Log in
              </Link>
            )}

            {/* Carrito */}
            <div className="position-relative">
              <Link
                to="/carrito"
                className="text-dark d-flex align-items-center text-decoration-none"
              >
                <i className="bi bi-cart3" style={{ fontSize: "1.5rem" }}></i>
                {totalItems > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: "0.7rem",
                      minWidth: "18px",
                      height: "18px",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Central */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3">
        <h1
          className="display-2 text-white fw-bold mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            letterSpacing: "1px",
          }}
        >
          Encuentra tu destino perfecto
        </h1>
        <p
          className="lead text-white mb-5"
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "1.3rem",
            opacity: "0.95",
            textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          Explora las mejores ofertas en cruceros y tours en venezuela y alrededor del mundo.
        </p>

        {/* Barra de Búsqueda Smart Search */}
        {/* <div
          className="search-container bg-white p-2 d-flex align-items-center"
          style={{
            borderRadius: "50px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            maxWidth: "950px",
            width: "100%",
            gap: "0",
          }}
         >
          <div
            className="d-flex align-items-center px-3"
            style={{ borderRight: "1px solid #e0e0e0" }}
          >
            <label
              className="fw-semibold text-secondary mb-0 text-nowrap"
              style={{ fontSize: "0.9rem" }}
            >
              Busqueda inteligente
            </label>
          </div>

          <div
            className="d-flex align-items-center gap-1 px-3"
            style={{ borderRight: "1px solid #e0e0e0" }}
          >
            <i className="bi bi-geo-alt text-secondary"></i>
            <select
              className="form-select border-0"
              style={{ minWidth: "130px", fontSize: "0.95rem" }}
            >
              <option>¿A dónde?</option>
              <option>Caribe</option>
              <option>Europa</option>
              <option>Asia</option>
              <option>África</option>
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-1 px-3"
            style={{ borderRight: "1px solid #e0e0e0" }}
          >
            <i className="bi bi-calendar text-secondary"></i>
            <select
              className="form-select border-0"
              style={{ minWidth: "110px", fontSize: "0.95rem" }}
            >
              <option>Fecha</option>
              <option>Enero 2026</option>
              <option>Febrero 2026</option>
              <option>Marzo 2026</option>
            </select>
          </div>

          <div className="d-flex align-items-center gap-1 px-3 flex-grow-1">
            <i className="bi bi-people text-secondary"></i>
            <select
              className="form-select border-0"
              style={{ minWidth: "110px", fontSize: "0.95rem" }}
            >
              <option>Pasajeros</option>
              <option>1 Pasajero</option>
              <option>2 Pasajeros</option>
              <option>3-4 Pasajeros</option>
              <option>5+ Pasajeros</option>
            </select>
          </div>

          <button
            className="btn btn-lg fw-semibold"
            style={{
              backgroundColor: "#ff6b35",
              color: "white",
              borderRadius: "50px",
              padding: "10px 35px",
              border: "none",
              transition: "all 0.3s",
              marginLeft: "auto",
              marginRight: "5px",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e85a2a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6b35")}
          >
            Buscar
          </button>
        </div> */}
      </div>

      {/* Curvas decorativas (Wave Shape) */}
      <div
        className="position-absolute bottom-0 w-100"
        style={{ marginBottom: "-1px", lineHeight: 0 }}
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </header>
  );
};

export default Header;
