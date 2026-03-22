import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/auth.css";

const MAX_INTENTOS = 5;
const BLOQUEO_MS = 60_000; // 60 segundos

function traducirError(mensaje) {
  if (!mensaje) return "Error desconocido.";
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials"))
    return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed"))
    return "Debes confirmar tu correo antes de iniciar sesión.";
  if (m.includes("too many requests") || m.includes("rate limit"))
    return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
  if (m.includes("user not found"))
    return "No existe una cuenta con ese correo.";
  if (m.includes("network") || m.includes("fetch"))
    return "Error de conexión. Verifica tu internet.";
  return mensaje;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Rate limiting
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  // Vista: "login" | "forgot"
  const [vista, setVista] = useState("login");
  const [emailRecovery, setEmailRecovery] = useState("");
  const [recoveryEnviado, setRecoveryEnviado] = useState(false);

  const { signIn, signInWithOAuth, resetPasswordForEmail, user } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Contador de bloqueo
  useEffect(() => {
    if (!bloqueadoHasta) return;
    timerRef.current = setInterval(() => {
      const restante = Math.ceil((bloqueadoHasta - Date.now()) / 1000);
      if (restante <= 0) {
        clearInterval(timerRef.current);
        setBloqueadoHasta(null);
        setIntentosFallidos(0);
        setTiempoRestante(0);
      } else {
        setTiempoRestante(restante);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [bloqueadoHasta]);

  const estaBloquado = bloqueadoHasta && Date.now() < bloqueadoHasta;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (estaBloquado) return;
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);
      if (nuevosIntentos >= MAX_INTENTOS) {
        setBloqueadoHasta(Date.now() + BLOQUEO_MS);
        setError(`Demasiados intentos fallidos. Espera 60 segundos.`);
      } else {
        setError(
          `${traducirError(error.message)} (${nuevosIntentos}/${MAX_INTENTOS} intentos)`
        );
      }
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  const handleOAuth = async (provider) => {
    setError(null);
    setLoading(true);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setError(traducirError(error.message));
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await resetPasswordForEmail(emailRecovery);
    setLoading(false);
    if (error) {
      setError(traducirError(error.message));
    } else {
      setRecoveryEnviado(true);
    }
  };

  // ─── Vista: Olvidé mi contraseña ─────────────────────────────────────────
  if (vista === "forgot") {
    return (
      <div className="container mt-5 mb-5 auth-page">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg auth-card">
              <div className="card-body p-4 auth-card__body">
                <h3 className="card-title text-center mb-4 auth-title">
                  Recuperar contraseña
                </h3>

                {recoveryEnviado ? (
                  <div className="alert auth-alert text-center">
                    <strong>¡Correo enviado!</strong> Revisa tu bandeja de entrada
                    y sigue el enlace para restablecer tu contraseña.
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword}>
                    <p className="auth-muted mb-3 text-center">
                      Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                    <div className="mb-3">
                      <label htmlFor="emailRecovery" className="form-label fw-semibold auth-label">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control rounded-pill auth-input"
                        id="emailRecovery"
                        value={emailRecovery}
                        onChange={(e) => setEmailRecovery(e.target.value)}
                        placeholder="Ingresa tu correo"
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
                        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none auth-muted p-0"
                    onClick={() => { setVista("login"); setError(null); setRecoveryEnviado(false); }}
                  >
                    ← Volver al inicio de sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Vista: Login ─────────────────────────────────────────────────────────
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
                    disabled={estaBloquado}
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
                    disabled={estaBloquado}
                  />
                </div>
                {error && (
                  <p className="text-danger mb-3">
                    {error}
                    {estaBloquado && ` Tiempo restante: ${tiempoRestante}s`}
                  </p>
                )}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn rounded-pill auth-btn-primary"
                    disabled={loading || estaBloquado}
                  >
                    {estaBloquado
                      ? `Bloqueado (${tiempoRestante}s)`
                      : loading
                      ? "Iniciando sesión..."
                      : "Iniciar Sesión"}
                  </button>
                </div>
              </form>

              <div className="text-center my-4">
                <span className="auth-muted">O inicia sesión con:</span>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  className="btn rounded-pill auth-btn-outline auth-btn-google"
                  disabled={loading || estaBloquado}
                >
                  <i className="bi bi-google me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Google"}
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth("facebook")}
                  className="btn rounded-pill auth-btn-outline auth-btn-facebook"
                  disabled={loading || estaBloquado}
                >
                  <i className="bi bi-facebook me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Facebook"}
                </button>
              </div>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none auth-link p-0"
                  onClick={() => { setVista("forgot"); setError(null); }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <p className="mt-4 text-center">
                ¿No tienes cuenta?{" "}
                <Link to="/registro" className="auth-link">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
