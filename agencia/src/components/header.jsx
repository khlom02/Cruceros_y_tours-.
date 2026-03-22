import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../styles/header.css';

const Header = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

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
                src="/logo_cruceros_y_tours_completo_color.png"
                alt="Cruceros y Tours Logo"
                className="header-logo__img"
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>

          {/* Menú de navegación - solo visible en desktop */}
          <div className="col header-desktop-nav-col">
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
                  href="/servicios_especiales"
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

          {/* Login y Carrito + Hamburger - derecha */}
          <div className="col-auto d-flex align-items-center justify-content-end gap-2">
            {authLoading ? (
              <div
                className="spinner-border spinner-border-sm text-white"
                role="status"
              >
                <span className="visually-hidden">Cargando...</span>
              </div>
            ) : user ? (
              <div className="d-flex align-items-center gap-2">
                <div className="dropdown header-user-dropdown">
                  <button
                    className="btn header-user-btn dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user.email?.split("@")[0] || "Usuario"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end header-user-menu"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link to="/admin" className="dropdown-item">
                        <i className="bi bi-sliders me-2"></i>
                        Panel de Administración
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
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
                className="btn header-login-btn"
              >
                Log in
              </Link>
            )}

            {/* Botón hamburguesa - solo visible en móvil */}
            <button
              className={`header-hamburger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil overlay */}
      {menuOpen && (
        <div className="header-nav-mobile" onClick={closeMenu}>
          <div className="header-nav-mobile__panel" onClick={(e) => e.stopPropagation()}>
            {/* Botón cerrar */}
            <button className="header-nav-mobile__close" onClick={closeMenu} aria-label="Cerrar menú">
              ×
            </button>

            <nav className="header-nav-mobile__links">
              <Link to="/" className="header-nav-mobile__link" onClick={closeMenu}>Inicio</Link>
              <Link to="/cruceros" className="header-nav-mobile__link" onClick={closeMenu}>Cruceros</Link>
              <Link to="/destinos" className="header-nav-mobile__link" onClick={closeMenu}>Destinos</Link>
              <Link to="/vuelos" className="header-nav-mobile__link" onClick={closeMenu}>Vuelos</Link>
              <Link to="/servicios_especiales" className="header-nav-mobile__link" onClick={closeMenu}>Servicios Especiales</Link>
              <Link to="/contacto" className="header-nav-mobile__link" onClick={closeMenu}>Contacto</Link>
            </nav>

            {/* Autenticación en menú móvil */}
            <div className="header-nav-mobile__auth">
              {authLoading ? null : user ? (
                <>
                  <Link to="/admin" className="header-nav-mobile__link" onClick={closeMenu}>
                    <i className="bi bi-sliders me-2"></i>Panel de Administración
                  </Link>
                  <button
                    className="header-nav-mobile__logout"
                    onClick={() => { closeMenu(); handleLogout(); }}
                    disabled={loggingOut}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                  </button>
                </>
              ) : (
                <Link to="/registro" className="header-nav-mobile__cta" onClick={closeMenu}>
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
