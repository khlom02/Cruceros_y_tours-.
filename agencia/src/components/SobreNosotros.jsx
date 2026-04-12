import React from "react";
import '../styles/info-pages.css';
import '../styles/sobre-nosotros.css';

const SobreNosotros = () => {
  return (
    <main className="info-page">
      <div className="info-page__container">
        <h1 className="info-page__title">Sobre Nosotros</h1>
        <p className="info-page__subtitle">
          Somos una agencia de viajes venezolana con pasión por conectar personas con el mundo.
        </p>

        <section className="about-mission">
          <div className="about-mission__text">
            <h2>Nuestra Misión</h2>
            <p>
              En Cruceros y Tours creemos que cada viaje es una historia única. Nuestra misión es hacer
              realidad el viaje que siempre soñaste, asesorándote de manera personalizada desde la primera
              consulta hasta tu regreso a casa.
            </p>
            <p>
              Trabajamos directamente con las mejores navieras, aerolíneas y operadores turísticos del mundo
              para ofrecerte precios competitivos y experiencias inigualables.
            </p>
          </div>
        </section>

        <section className="about-stats">
          <div className="about-stat">
            <span className="about-stat__number">+500</span>
            <span className="about-stat__label">Viajeros felices</span>
          </div>
          <div className="about-stat">
            <span className="about-stat__number">+50</span>
            <span className="about-stat__label">Destinos disponibles</span>
          </div>
          <div className="about-stat">
            <span className="about-stat__number">+10</span>
            <span className="about-stat__label">Años de experiencia</span>
          </div>
          <div className="about-stat">
            <span className="about-stat__number">24/7</span>
            <span className="about-stat__label">Soporte al viajero</span>
          </div>
        </section>

        <section className="about-values">
          <h2>Nuestros Valores</h2>
          <div className="about-values__grid">
            <div className="about-value">
              <span className="about-value__icon">🤝</span>
              <h3>Confianza</h3>
              <p>Tu inversión está en las mejores manos. Transparencia en cada proceso.</p>
            </div>
            <div className="about-value">
              <span className="about-value__icon">✈️</span>
              <h3>Experiencia</h3>
              <p>Más de una década organizando viajes únicos para familias y empresas.</p>
            </div>
            <div className="about-value">
              <span className="about-value__icon">💬</span>
              <h3>Atención personalizada</h3>
              <p>Un agente dedicado para ti desde la consulta hasta el regreso.</p>
            </div>
            <div className="about-value">
              <span className="about-value__icon">🌍</span>
              <h3>Alcance global</h3>
              <p>Acceso a destinos en todos los continentes con los mejores operadores.</p>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <h2>¿Listo para tu próxima aventura?</h2>
          <p>Habla con uno de nuestros agentes hoy mismo.</p>
          <a href="/contacto" className="about-cta__btn">Contactar un agente</a>
        </section>
      </div>
    </main>
  );
};

export default SobreNosotros;
