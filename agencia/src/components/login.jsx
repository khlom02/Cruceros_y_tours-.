import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/auth.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithOAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    const { error } = await signInWithOAuth("google");
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Si es exitoso, el usuario será redirigido automáticamente por OAuth
  };

  const handleFacebookLogin = async () => {
    setError(null);
    setLoading(true);
    
    const { error } = await signInWithOAuth("facebook");
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5 auth-page">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg auth-card">
            <div className="card-body p-4 auth-card__body">
              <h3 className="card-title text-center mb-4 auth-title">
                Iniciar Sesión
              </h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold auth-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-pill auth-input"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold auth-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-pill auth-input"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                {error && <p className="text-danger mb-3">{error}</p>}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn rounded-pill auth-btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </div>
              </form>
              
              {/* Divider */}
              <div className="text-center my-4">
                <span className="auth-muted">O inicia sesión con:</span>
              </div>

              {/* OAuth Buttons */}
              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="btn rounded-pill auth-btn-outline auth-btn-google"
                  disabled={loading}
                >
                  <i className="bi bi-google me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Google"}
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="btn rounded-pill auth-btn-outline auth-btn-facebook"
                  disabled={loading}
                >
                  <i className="bi bi-facebook me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Facebook"}
                </button>
              </div>

              <div className="text-center mt-3">
                <a
                  href="#"
                  className="text-decoration-none auth-muted"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <p className="mt-4 text-center">
                ¿No tienes cuenta? <Link to="/registro" className="auth-link">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}