import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 text-success">
                Iniciar Sesión
              </h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-pill"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-pill"
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
                    className="btn btn-success rounded-pill"
                    disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </div>
              </form>
              
              {/* Divider */}
              <div className="text-center my-4">
                <span className="text-muted">O inicia sesión con:</span>
              </div>

              {/* OAuth Buttons */}
              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="btn btn-outline-danger rounded-pill"
                  disabled={loading}
                >
                  <i className="bi bi-google me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Google"}
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="btn btn-outline-primary rounded-pill"
                  disabled={loading}
                >
                  <i className="bi bi-facebook me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Facebook"}
                </button>
              </div>

              <div className="text-center mt-3">
                <a
                  href="#"
                  className="text-decoration-none text-muted"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <p className="mt-4 text-center">
                ¿No tienes cuenta? <Link to="/registro" className="text-success text-decoration-none">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}