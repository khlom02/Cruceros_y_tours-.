import React, { useState } from "react";
import '../styles/info-pages.css';

const preguntas = [
  {
    q: "¿Cómo reservo un crucero o tour?",
    a: "Navega a la sección correspondiente (Cruceros, Tours o Vuelos), elige tu destino y haz clic en 'Ver detalles'. Desde allí podrás seleccionar fechas y completar tu reserva."
  },
  {
    q: "¿Necesito crear una cuenta para reservar?",
    a: "Sí, necesitas registrarte para poder guardar tu reserva y recibir confirmación por email. El registro es gratuito y toma menos de un minuto."
  },
  {
    q: "¿Puedo cancelar o modificar mi reserva?",
    a: "Sí. Contáctanos por correo o WhatsApp con al menos 48 horas de anticipación. Las políticas de cancelación varían según el proveedor del servicio."
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo en nuestras oficinas. Nuestro equipo te guiará según tu país."
  },
  {
    q: "¿Los precios incluyen impuestos?",
    a: "Los precios mostrados incluyen impuestos locales. Tasas de aeropuerto o portuarias adicionales se detallan antes de confirmar la reserva."
  },
  {
    q: "¿Ofrecen seguros de viaje?",
    a: "Sí, podemos incluir seguro de viaje como parte de tu paquete. Consulta con nuestros agentes para conocer las coberturas disponibles."
  },
  {
    q: "¿Cómo recibo mi documentación de viaje?",
    a: "Una vez confirmada la reserva, recibirás toda la documentación en el email registrado en un plazo de 24 a 48 horas hábiles."
  }
];

const FAQ = () => {
  const [abierto, setAbierto] = useState(null);

  const toggle = (i) => setAbierto(abierto === i ? null : i);

  return (
    <main className="info-page">
      <div className="info-page__container">
        <h1 className="info-page__title">Preguntas Frecuentes</h1>
        <p className="info-page__subtitle">Resolvemos tus dudas más comunes sobre nuestros servicios.</p>

        {preguntas.map((item, i) => (
          <div className="faq-item" key={i}>
            <button
              className={`faq-item__question${abierto === i ? " open" : ""}`}
              onClick={() => toggle(i)}
              aria-expanded={abierto === i}
            >
              {item.q}
              <span>+</span>
            </button>
            <p className={`faq-item__answer${abierto === i ? " open" : ""}`}>{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default FAQ;
