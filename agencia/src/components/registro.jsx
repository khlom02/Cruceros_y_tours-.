import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SEO from './SEO.jsx';
import "../styles/auth.css";

const MAX_INTENTOS = 3;
const BLOQUEO_MS = 5 * 60 * 1000;

function traducirError(mensaje) {
  if (!mensaje) return "Error desconocido.";
  const m = mensaje.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Este correo ya está registrado.";
  if (m.includes("password should be at least"))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("email not confirmed"))
    return "Debes confirmar tu correo antes de iniciar sesión.";
  if (m.includes("too many requests") || m.includes("rate limit"))
    return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
  if (m.includes("network") || m.includes("fetch"))
    return "Error de conexión. Verifica tu internet.";
  return mensaje;
}

function nivelFortaleza(password) {
  if (password.length < 8) return { nivel: 0, texto: "" };
  let puntos = 0;
  if (password.length >= 12) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;
  if (puntos <= 1) return { nivel: 1, texto: "Débil", color: "var(--bs-danger)" };
  if (puntos === 2) return { nivel: 2, texto: "Media", color: "var(--bs-warning)" };
  return { nivel: 3, texto: "Fuerte", color: "var(--bs-success)" };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const { signUp, signInWithOAuth, user } = useAuth();
  const navigate = useNavigate();
  const fortaleza = nivelFortaleza(password);
  const emailRef = useRef(null);
  const timerRef = useRef(null);
  const successTimerRef = useRef(null);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(successTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!bloqueadoHasta) return;
    timerRef.current = setInterval(() => {
      const restante = Math.ceil((bloqueadoHasta - Date.now()) / 1000);
      if (restante <= 0) {
        clearInterval(timerRef.current);
        setBloqueadoHasta(null);
        setTiempoRestante(0);
      } else {
        setTiempoRestante(restante);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [bloqueadoHasta]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (tiempoRestante > 0) return;

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      if (emailRef.current) emailRef.current.focus();
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      const nuevosIntentos = parseInt(sessionStorage.getItem("reg_intentos") || "0", 10) + 1;
      sessionStorage.setItem("reg_intentos", String(nuevosIntentos));
      if (nuevosIntentos >= MAX_INTENTOS) {
        setBloqueadoHasta(Date.now() + BLOQUEO_MS);
        sessionStorage.removeItem("reg_intentos");
        setError("Demasiados intentos. Espera 5 minutos.");
      } else {
        setError(`${traducirError(error.message)} (${nuevosIntentos}/${MAX_INTENTOS} intentos)`);
      }
      if (emailRef.current) emailRef.current.focus();
    } else {
      sessionStorage.removeItem("reg_intentos");
      setSuccess(true);
      successTimerRef.current = setTimeout(() => navigate("/"), 3000);
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

  const regErrorId = "reg-error";
  const regEmailId = "reg-email";
  const regPasswordId = "reg-password";
  const regConfirmId = "reg-confirm";
  const regPasswordReqsId = "reg-password-reqs";

  return (
    <>
      <SEO
        title="Crear Cuenta"
        description="Regístrate en Cruceros y Tours para acceder a reservas, planes de suscripción y ofertas exclusivas. Crea tu cuenta gratis en minutos."
        canonical="/registro"
        noindex
      />
      <div className="container mt-5 mb-5 auth-page">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg auth-card">
              <div className="card-body p-4 auth-card__body">
                <h1 className="card-title text-center mb-4 auth-title">Crear Cuenta</h1>
              <form onSubmit={handleRegister} noValidate>
                <div className="mb-3">
                  <label htmlFor={regEmailId} className="form-label fw-semibold auth-label">
                    Correo Electrónico
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    id={regEmailId}
                    name="reg-email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control rounded-pill auth-input"
                    placeholder="Ingresa tu correo"
                    autoComplete="email"
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? regErrorId : undefined}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor={regPasswordId} className="form-label fw-semibold auth-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id={regPasswordId}
                    name="reg-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="form-control rounded-pill auth-input"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    aria-describedby={regPasswordReqsId}
                    aria-invalid={password.length > 0 && fortaleza.nivel < 2 ? "true" : undefined}
                  />
                  <p id={regPasswordReqsId} className="visually-hidden">
                    La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.
                  </p>
                  {password.length > 0 && (
                    <div className="mt-2" role="status" aria-live="polite" aria-label={`Fortaleza: ${fortaleza.texto}`}>
                      <div style={{
                        height: "4px",
                        borderRadius: "2px",
                        background: "var(--color-background-light)",
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
                  <label htmlFor={regConfirmId} className="form-label fw-semibold auth-label">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    id={regConfirmId}
                    name="reg-confirm"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control rounded-pill auth-input"
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    aria-invalid={confirmPassword.length > 0 && password !== confirmPassword ? "true" : undefined}
                  />
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <small className="text-danger" role="alert">Las contraseñas no coinciden.</small>
                  )}
                </div>
                {error && (
                  <p id={regErrorId} className="text-danger mb-3" role="alert" aria-live="assertive">
                    {error}
                    {tiempoRestante > 0 && ` Tiempo restante: ${tiempoRestante}s`}
                  </p>
                )}
                {success && (
                  <div className="alert auth-alert mb-3" role="status" aria-live="polite">
                    <strong>¡Registro exitoso!</strong> Revisa tu correo para confirmar tu cuenta.
                    Serás redirigido en unos segundos...
                  </div>
                )}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn rounded-pill auth-btn-primary"
                    disabled={loading || tiempoRestante > 0}
                  >
                    {tiempoRestante > 0
                      ? `Bloqueado (${tiempoRestante}s)`
                      : loading
                      ? "Registrando..."
                      : "Registrarse"}
                  </button>
                </div>
              </form>

              <div className="text-center my-4">
                <span className="auth-muted">O regístrate con:</span>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  className="btn rounded-pill auth-btn-outline auth-btn-google"
                  disabled={loading}
                >
                  <i className="bi bi-google me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Google"}
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth("facebook")}
                  className="btn rounded-pill auth-btn-outline auth-btn-facebook"
                  disabled={loading}
                >
                  <i className="bi bi-facebook me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Facebook"}
                </button>
              </div>
              <p className="mt-4 text-center">
                ¿Ya tienes una cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;
