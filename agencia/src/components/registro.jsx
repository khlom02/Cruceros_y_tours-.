import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "../styles/auth.css";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithOAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { data, error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Opcional: redirigir después de 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    
    const { error } = await signInWithOAuth("google");
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Si es exitoso, el usuario será redirigido automáticamente por OAuth
  };

  const handleFacebookSignUp = async () => {
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
              <h3 className="card-title text-center mb-4 auth-title">Crear Cuenta</h3>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold auth-label">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control rounded-pill auth-input"
                    placeholder="Ingresa tu correo"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold auth-label">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control rounded-pill auth-input"
                    placeholder="Crea una contraseña"
                  />
                </div>
                {error && <p className="text-danger mb-3">{error}</p>}
                {success && (
                  <div className="alert auth-alert mb-3">
                    <strong>¡Registro exitoso!</strong> Revisa tu correo para confirmar tu cuenta. 
                    Serás redirigido en unos segundos...
                  </div>
                )}
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn rounded-pill auth-btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Registrando..." : "Registrarse"}
                  </button>
                </div>
              </form>
              
              {/* Divider */}
              <div className="text-center my-4">
                <span className="auth-muted">O regístrate con:</span>
              </div>

              {/* OAuth Buttons */}
              <div className="d-grid gap-2">
                <button
                  onClick={handleGoogleSignUp}
                  className="btn rounded-pill auth-btn-outline auth-btn-google"
                  disabled={loading}
                >
                  <i className="bi bi-google me-2"></i>
                  {loading ? "Conectando..." : "Continuar con Google"}
                </button>
                <button
                  onClick={handleFacebookSignUp}
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
  );
};

export default Register;