import React, { useState } from "react";
import '../styles/footer.css';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from "../backend/supabase_client";
import { getSupabaseImageUrl } from "../utils/imageHelper";

const Footer = React.memo(() => {
  const [emailNews, setEmailNews] = useState("");
  const [statusNews, setStatusNews] = useState(null);

  const handleSubscribe = async () => {
    if (!emailNews) return;
    const result = await subscribeNewsletter(emailNews);
    if (result.success) {
      setStatusNews({ ok: true, msg: "¡Suscrito exitosamente!" });
      setEmailNews("");
    } else {
      setStatusNews({ ok: false, msg: result.msg });
    }
  };

  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-section logo-social">
          <Link to="/">
            <img
              src={getSupabaseImageUrl("imagenes/texto_logo_solo_color.png")}
              alt="Cruceros y Tours"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <section className="socials_media">
            <a href="https://instagram.com/crucerosytours" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="bi bi-instagram icon-instagram" aria-hidden="true"></i>
            </a>
            <a href="https://wa.me/584142783669?text=Hola,%20quiero%20información%20sobre%20un%20viaje" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="bi bi-whatsapp icon-whatsapp" aria-hidden="true"></i>
            </a>
            <a href="mailto:crucerosytoursagencia@gmail.com" aria-label="Correo">
              <i className="bi bi-envelope icon-gmail" aria-hidden="true"></i>
            </a>
          </section>
        </div>

        <div className="footer-section help-links">
          <h3>Ayuda</h3>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contacto">Servicio al cliente</Link></li>
            <li><Link to="/guia-de-uso">Guía de uso</Link></li>
            <li><Link to="/contacto">Contáctanos</Link></li>
          </ul>
        </div>

        <div className="footer-section other-links">
          <h3>Otros</h3>
          <ul>
            <li><Link to="/nosotros">Sobre Nosotros</Link></li>
            <li><Link to="/politicas-privacidad">Políticas de privacidad</Link></li>
            <li><Link to="/suscripciones">Suscripciones</Link></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <p className="newsletter-text">Suscríbete a nuestro Blog para recibir datos interesantes sobre todos nuestros productos!</p>
          <div className="subscribe-form">
            <input
              type="email"
              placeholder="Ingresa tu email aquí"
              className="email-input"
              value={emailNews}
              onChange={(e) => setEmailNews(e.target.value)}
            />
            <button className="subscribe-button" onClick={handleSubscribe}>Suscribirse ahora</button>
          </div>
          {statusNews && (
            <p className={`newsletter-status ${statusNews.ok ? "newsletter-status--ok" : "newsletter-status--error"}`}>
              {statusNews.msg}
            </p>
          )}
        </div>

        <div className="footer-phone">
          <a href="tel:+584142783669">📞 +584142783669</a>
        </div>
      </footer>
    </div>
  );
});

export default Footer;
