import React from "react";
import '../styles/info-pages.css';

const planes = [
  {
    nombre: "Gratuito",
    precio: "0",
    periodo: "/mes",
    beneficios: [
      "Acceso a todos los destinos",
      "Consulta de precios en tiempo real",
      "Reservas estándar",
      "Soporte por email"
    ],
    featured: false
  },
  {
    nombre: "Viajero",
    precio: "9.99",
    periodo: "/mes",
    beneficios: [
      "Todo lo del plan Gratuito",
      "Descuentos exclusivos hasta 10%",
      "Acceso anticipado a ofertas",
      "Soporte prioritario",
      "Newsletter con tips de viaje"
    ],
    featured: true
  },
  {
    nombre: "Premium",
    precio: "19.99",
    periodo: "/mes",
    beneficios: [
      "Todo lo del plan Viajero",
      "Descuentos hasta 20%",
      "Agente personal asignado",
      "Cancelación flexible sin cargo",
      "Acceso a paquetes exclusivos"
    ],
    featured: false
  }
];

const Suscripciones = () => {
  return (
    <main className="info-page">
      <div className="info-page__container">
        <h1 className="info-page__title">Planes de Suscripción</h1>
        <p className="info-page__subtitle">
          Elige el plan que mejor se adapta a tu estilo de viaje y disfruta de beneficios exclusivos.
        </p>

        <div className="subs-cards">
          {planes.map((plan) => (
            <div className={`subs-card${plan.featured ? " featured" : ""}`} key={plan.nombre}>
              <p className="subs-card__name">{plan.nombre}</p>
              <p className="subs-card__price">
                ${plan.precio}<span>{plan.periodo}</span>
              </p>
              <ul>
                {plan.beneficios.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <button
                className="subs-card__btn"
                onClick={() => window.location.href = "/contacto"}
              >
                {plan.precio === "0" ? "Comenzar gratis" : "Suscribirme"}
              </button>
            </div>
          ))}
        </div>

        <p style={{ marginTop: "32px", fontSize: "0.85rem", color: "var(--color-text-secondary)", textAlign: "center" }}>
          ¿Tienes preguntas sobre los planes? <a href="/contacto">Escríbenos</a> y te ayudamos.
        </p>
      </div>
    </main>
  );
};

export default Suscripciones;
