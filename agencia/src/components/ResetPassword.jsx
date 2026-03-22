import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/auth.css";

function nivelFortaleza(password) {
  if (password.length < 6) return { nivel: 0, texto: "" };
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;
  if (puntos <= 1) return { nivel: 1, texto: "Débil", color: "#dc3545" };
  if (puntos === 2) return { nivel: 2, texto: "Media", color: "#fd7e14" };
  return { nivel: 3, texto: "Fuerte", color: "#198754" };
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listo, setListo] = useState(false);

  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();
  const fortaleza = nivelFortaleza(password);

  // Supabase establece la sesión de recuperación automáticamente al cargar la URL
  // con el token. Esperamos a que AuthContext resuelva el usuario.
  useEffect(() => {
    // Damos un momento para que onAuthStateChange procese el token de la URL
    const timeout = setTimeout(() => setListo(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setError("No se pudo actualizar la contraseña. El enlace puede haber expirado.");
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  if (!listo) {
    return (
      <div className="container mt-5 mb-5 auth-page text-center">
        <div className="spinner-border" style={{ color: "var(--color-primary)" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5 mb-5 auth-page">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg auth-card">
              <div className="card-body p-4 auth-card__body text-center">
                <h3 className="auth-title mb-3">Enlace inválido o expirado</h3>
                <p className="auth-muted">
                  Este enlace de recuperación ya no es válido. Solicita uno nuevo desde la página de inicio de sesión.
                </p>
                <Link to="/login" className="btn rounded-pill auth-btn-primary mt-3">
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 auth-page">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg auth-card">
            <div className="card-body p-4 auth-card__body">
              <h3 className="card-title text-center mb-4 auth-title">
                Nueva contraseña
              </h3>

              {success ? (
                <div className="alert auth-alert text-center">
                  <strong>¡Contraseña actualizada!</strong> Serás redirigido al inicio de sesión...
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold auth-label">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-pill auth-input"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                    />
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div style={{
                          height: "4px",
                          borderRadius: "2px",
                          background: "#e9ecef",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${(fortaleza.nivel / 3) * 100}%`,
                            background: fortaleza.color,
                            transition: "width 0.3s ease",
                          }} />
                        </div>
                        <small style={{ color: fortaleza.color }}>{fortaleza.texto}</small>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold auth-label">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-pill auth-input"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      required
                    />
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                      <small className="text-danger">Las contraseñas no coinciden.</small>
                    )}
                  </div>
                  {error && <p className="text-danger mb-3">{error}</p>}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn rounded-pill auth-btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Guardando..." : "Guardar nueva contraseña"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
