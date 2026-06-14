import React, { useState } from "react";
import '../styles/contacto.css';
import { createContact } from '../backend/supabase_client';
import SEO from './SEO.jsx';

const RATE_LIMIT_KEY = "contacto_ultimo_envio";
const RATE_LIMIT_MS = 60_000; // 60 segundos entre envíos
const MAX_NOMBRE = 100;
const MAX_ASUNTO = 200;
const MAX_MENSAJE = 1000;

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  });
  const [honeypot, setHoneypot] = useState(""); // campo trampa para bots
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Anti-bot: si el honeypot tiene valor, simular éxito silenciosamente
    if (honeypot) {
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
      return;
    }

    // Rate limiting: un envío por minuto
    const ultimoEnvio = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || "0", 10);
    if (Date.now() - ultimoEnvio < RATE_LIMIT_MS) {
      const segundos = Math.ceil((RATE_LIMIT_MS - (Date.now() - ultimoEnvio)) / 1000);
      setError(`Por favor espera ${segundos} segundos antes de enviar otro mensaje.`);
      return;
    }

    // Validación de longitud
    if (formData.nombre.trim().length > MAX_NOMBRE) {
      setError(`El nombre no puede superar ${MAX_NOMBRE} caracteres.`);
      return;
    }
    if (formData.asunto.trim().length > MAX_ASUNTO) {
      setError(`El asunto no puede superar ${MAX_ASUNTO} caracteres.`);
      return;
    }
    if (formData.mensaje.trim().length > MAX_MENSAJE) {
      setError(`El mensaje no puede superar ${MAX_MENSAJE} caracteres.`);
      return;
    }

    setCargando(true);

    try {
      const resultado = await createContact(
        formData.nombre.trim(),
        formData.email.trim(),
        formData.telefono.trim(),
        formData.asunto.trim(),
        formData.mensaje.trim()
      );

      if (resultado) {
        localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
        setEnviado(true);
        setFormData({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
        setTimeout(() => setEnviado(false), 3000);
      } else {
        setError("Hubo un problema al enviar el mensaje. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error al enviar contacto:", err);
      setError("Error al enviar el mensaje. Por favor intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contacto-page">
      <SEO
        title="Contacto y Soporte"
        description="¿Tienes preguntas sobre tu viaje? Contáctanos y un asesor de Cruceros y Tours te atenderá a la brevedad. Estamos para ayudarte."
        canonical="/contacto"
      />
      {/* Hero Section */}
      <div className="contacto-hero">
        <h1 className="contacto-title">Contacto y soporte</h1>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4 mb-5">
          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="contact-card">
              <h2 className="card-title-contact mb-4">Contacta con nosotros</h2>
              
              {enviado && (
                <div className="alert alert-success mb-3">
                  ¡Mensaje enviado exitosamente!
                </div>
              )}

              {error && (
                <div className="alert alert-danger mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Campo trampa anti-bot: invisible para humanos, los bots lo llenan */}
                <div style={{ display: "none" }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <div className="input-group-contact">
                    <i className="bi bi-person-fill input-icon"></i>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control-contact"
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group-contact">
                    <i className="bi bi-envelope-fill input-icon"></i>
                    <input
                      type="email"
                      name="email"
                      className="form-control-contact"
                      placeholder="Tu correo"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group-contact">
                    <i className="bi bi-telephone-fill input-icon"></i>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control-contact"
                      placeholder="Tu teléfono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group-contact">
                    <i className="bi bi-subject-fill input-icon"></i>
                    <input
                      type="text"
                      name="asunto"
                      className="form-control-contact"
                      placeholder="Asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="input-group-contact">
                    <i className="bi bi-chat-dots-fill input-icon"></i>
                    <textarea
                      name="mensaje"
                      className="form-control-contact"
                      placeholder="Mensaje"
                      rows="4"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      maxLength={MAX_MENSAJE}
                    ></textarea>
                  </div>
                  <small style={{ color: formData.mensaje.length > MAX_MENSAJE * 0.9 ? "#dc3545" : "#6c757d" }}>
                    {formData.mensaje.length}/{MAX_MENSAJE}
                  </small>
                </div>

                <button type="submit" className="btn-send-message" disabled={cargando}>
                  {cargando ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            </div>
          </div>

          {/* Travel Expert Section */}
          <div className="col-lg-6">
            <div className="contact-card text-center">
              <h2 className="card-title-contact mb-4">Habla con un asesor de viajes</h2>
              
              <div className="expert-image-container mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" 
                  alt="Asesor de viajes" 
                  className="expert-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <p className="expert-text mb-4">
                ¿Tienes dudas? Nuestros asesores de viajes estan aqui para ayudarte.
              </p>

              <button className="btn-live-chat">
                Chat en vivo
              </button>
            </div>
          </div>
        </div>

        {/* Global Locations Section */}
        <div className="locations-section">
          <h2 className="locations-title text-center mb-5">Nuestras ubicaciones globales</h2>
          
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="map-container">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg" 
                  alt="Mapa del mundo" 
                  className="world-map"
                  loading="lazy"
                  decoding="async"
                />
                {/* Location Markers */}
                <div className="map-marker" style={{top: '38%', left: '30%'}} title="Caracas, Venezuela">📍</div>
                <div className="map-marker" style={{top: '60%', left: '29%'}} title="Santiago, Chile">📍</div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="location-info">
                <div className="location-item mb-3">
                  <i className="bi bi-geo-alt-fill text-warning me-2"></i>
                  <span>Calle Viajes 1234, Oficina 100,<br/>Ciudad Aventura, CA 98765</span>
                </div>
                <div className="location-item mb-3">
                  <i className="bi bi-telephone-fill text-warning me-2"></i>
                  <span>+1 (800) 123-4567</span>
                </div>
                <div className="location-item">
                  <i className="bi bi-envelope-fill text-warning me-2"></i>
                  <span>info@travelagency.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
