import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../backend/supabase_client";
import SEO from './SEO.jsx';
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

  const { updatePassword, signOut, user } = useAuth();
  const navigate = useNavigate();
  const fortaleza = nivelFortaleza(password);

  // Esperar a que Supabase procese el token de recovery del hash de la URL
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // 1. Intentar obtener sesión directamente (si el hash ya se procesó)
      const { data: { session } } = await supabase.auth.getSession();
      if (!cancelled && session?.user) {
        setListo(true);
        return;
      }

      // 2. Si no hay sesión aún, escuchar el evento de auth
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!cancelled && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "PASSWORD_RECOVERY") && session?.user) {
          setListo(true);
        }
      });

      // 3. Timeout de seguridad por si algo falla silenciosamente
      const safetyTimeout = setTimeout(() => {
        if (!cancelled) setListo(true);
      }, 15000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(safetyTimeout);
      };
    };

    init();

    return () => { cancelled = true; };
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

    // Refrescar la sesión antes de actualizar por si el token expiró
    const { data: { session } } = await supabase.auth.refreshSession();
    if (!session) {
      setLoading(false);
      setError("Tu sesión ha expirado. Solicita un nuevo enlace de recuperación desde la página de inicio de sesión.");
      return;
    }

    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes("expired") || msg.includes("invalid") || msg.includes("token"))
        setError("El enlace de recuperación ha expirado. Solicita uno nuevo desde la página de inicio de sesión.");
      else
        setError("No se pudo actualizar la contraseña. Intenta de nuevo.");
    } else {
      await signOut();
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
    <>
      <SEO
        title="Restablecer Contraseña"
        description="Crea una nueva contraseña para tu cuenta de Cruceros y Tours. El enlace de recuperación es de un solo uso."
        canonical="/reset-password"
        noindex
      />
      <div className="container mt-5 mb-5 auth-page">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg auth-card">
              <div className="card-body p-4 auth-card__body">
                <h1 className="card-title text-center mb-4 auth-title" style={{fontSize:'1.5rem'}}>
                  Nueva contraseña
                </h1>

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
    </>
  );
}
