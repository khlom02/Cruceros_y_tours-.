import React from "react";
import '../styles/testimonios.css';

const lista = [
  {
    nombre: "María González",
    pais: "Venezuela",
    texto: "Increíble experiencia. El agente nos guió paso a paso, desde la selección del crucero hasta los traslados. ¡Volveremos a usar su servicio!",
    estrellas: 5,
  },
  {
    nombre: "Carlos Mendoza",
    pais: "Colombia",
    texto: "Nunca había viajado en crucero y tenía muchas dudas. El equipo fue súper paciente y consiguió el mejor precio para nuestra luna de miel.",
    estrellas: 5,
  },
  {
    nombre: "Andreína Rojas",
    pais: "Venezuela",
    texto: "Organizamos un viaje familiar con 6 personas a Europa. Todo salió perfecto. Recomiendo 100% contactar primero al agente.",
    estrellas: 5,
  },
  {
    nombre: "Pedro Castillo",
    pais: "Perú",
    texto: "El servicio de asistencia al viajero que nos recomendaron fue clave cuando tuvimos un inconveniente en Madrid. Excelente cobertura.",
    estrellas: 4,
  },
];

const Testimonios = () => (
  <section className="testimonios">
    <div className="testimonios__container">
      <h2 className="testimonios__title">Lo que dicen nuestros viajeros</h2>
      <p className="testimonios__subtitle">Más de 500 familias han confiado en nosotros para hacer realidad su viaje ideal.</p>
      <div className="testimonios__grid">
        {lista.map((t, i) => (
          <div className="testimonio-card" key={i}>
            <div className="testimonio-card__stars">
              {"★".repeat(t.estrellas)}{"☆".repeat(5 - t.estrellas)}
            </div>
            <p className="testimonio-card__texto">"{t.texto}"</p>
            <div className="testimonio-card__autor">
              <span className="testimonio-card__nombre">{t.nombre}</span>
              <span className="testimonio-card__pais">{t.pais}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonios;
