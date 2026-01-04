import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 text-primary">
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
                    className="btn btn-primary rounded-pill"
                    disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </div>
              </form>
              
              {/* Divider */}
              <div className="text-center my-4">
                <span className="text-muted">O</span>
              </div>

              {/* Google OAuth Button */}
              <div className="d-grid mb-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="btn btn-outline-danger rounded-pill"
                  disabled={loading}
                >
                  <i className="bi bi-google me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Google"}
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
              <div className="text-center mt-4">
                <p>
                  ¿No tienes cuenta?{" "}
                  <a
                    href="/registro"
                    className="btn btn-success mt-2 rounded-pill"
                  >
                    Regístrate
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}