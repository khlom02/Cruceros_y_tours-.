import React from "react";
import '../styles/footer.css';

const Footer = () => {
  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-section logo-social">
          <div className="d-flex align-items-center kamima_store">
            <a href="/" className="fs-4 fw-bold text-decoration-none kamima_store">Cruceros y tours</a>
          </div>
          <div className="social-icons ml-2 re">
            <a href="#" className="social-icon bi-whatsapp"><i className="bi bi-whatsapp"></i></a>
            <a href="#" className="social-icon bi-instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" className="social-icon bi-envelope-open-fill"><i className="bi bi-envelope-open-fill"></i></a>
          </div>
        </div>

        <div className="footer-section help-links">
          <h3>Ayuda</h3>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Servicio al cliente</a></li>
            <li><a href="#">Guía de uso</a></li>
            <li><a href="#">Contáctanos</a></li>
          </ul>
        </div>

        <div className="footer-section other-links">
          <h3>Otros</h3>
          <ul>
            <li><a href="#">Políticas de privacidad</a></li>
            <li><a href="#">Suscripciones</a></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <p className="newsletter-text">Suscríbete a nuestro Blog para recibir datos interesantes sobre todos nuestros productos!</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Ingresa tu email aquí" className="email-input" />
            <button className="subscribe-button">Suscribirse ahora</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
