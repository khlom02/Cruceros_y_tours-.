import React from "react";
import { Link } from "react-router-dom";
import SEO from './SEO.jsx';
import '../styles/info-pages.css';
import '../styles/not-found.css';

const NotFound = React.memo(() => {
  return (
    <main className="notfound-page">
      <SEO
        title="Página no encontrada — Error 404"
        description="La página que buscas no existe o fue movida. Explora nuestros cruceros, tours y vuelos para encontrar tu próximo destino."
        noindex
      />
      <div className="notfound-content">
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Página no encontrada</h1>
        <p className="notfound-text">
          Parece que esta página no existe o fue movida. Pero no te preocupes,
          nuestros agentes están listos para ayudarte a encontrar tu próximo destino.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn notfound-btn--primary">Volver al inicio</Link>
          <Link to="/contacto" className="notfound-btn notfound-btn--secondary">Hablar con un agente</Link>
        </div>
      </div>
    </main>
  );
});

export default NotFound;
