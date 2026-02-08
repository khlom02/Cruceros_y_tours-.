import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cartContext/cartContext.jsx";
import { useAuth } from "../contexts/AuthContext";
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
    // logo del header 
    <>
      {/* Navbar Superior */}
      <nav className="container-fluid">
        <div className="row align-items-center">
          {/* Logo - izquierda */}
          <div className="col-auto">
            <Link to="/" className="header-logo">
              <img
                src="/src/marketing/logo/logo_cruceros_y_tours_completo_color.png"
                alt="Cruceros y Tours Logo"
                className="header-logo__img"
              />
            </Link>
          </div>

          {/* Menú de navegación */}
          <div className="col">
            <ul className="nav d-flex align-items-center flex-wrap gap-1">
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
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/cruceros"
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
                <Link
                  to="/destinos"
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
                  Destinos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/vuelos"
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
                  Vuelos
                </Link>
              </li>
              <li className="nav-item">
                <a
                  href="/#"
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
                  Servicios Especiales
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

          {/* Login y Carrito - derecha */}
          <div className="col-auto d-flex align-items-center justify-content-end" style={{ marginRight: "90px" }}>
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
                  borderRadius: "15px",
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

            {/* Carrito
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
            </div> */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
