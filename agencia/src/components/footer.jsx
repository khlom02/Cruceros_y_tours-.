import React from "react";
import '../styles/footer.css';

const Footer = () => {
  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-section logo-social">
          <a href="/">
            <img src="/src/imagenes/texto_logo_solo_color.png"/>
          </a>
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
