import { useState, useEffect } from "react";
import { createReserva } from "../backend/supabase_client";
import "../styles/stickyBookingBar.css";

const RESERVA_INICIAL = {
  nombre: "",
  email: "",
  telefono: "",
  fecha_viaje: "",
  pasajeros: 1,
  comentarios: "",
};

const StickyBookingBar = ({ user, detalle }) => {
  const [form, setForm] = useState(RESERVA_INICIAL);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [enviada, setEnviada] = useState(false);

  useEffect(() => {
    if (user?.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNumberChange = (e) => {
    setForm((prev) => ({ ...prev, pasajeros: Number(e.target.value) || 1 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMsg("Debes iniciar sesión para enviar una solicitud.");
      return;
    }
    setLoading(true);
    setMsg(null);
    const result = await createReserva({
      user_id: user.id,
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono,
      paquete_id: detalle.id || null,
      paquete_nombre: detalle.title,
      fecha_viaje: form.fecha_viaje || null,
      pasajeros: Number(form.pasajeros) || 1,
      comentarios: form.comentarios,
    });
    setLoading(false);
    if (result) {
      setEnviada(true);
      setForm(RESERVA_INICIAL);
    } else {
      setMsg("Error al enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
    }
  };

  const waText = `Hola, quiero información sobre el paquete: ${encodeURIComponent(detalle.title)}`;

  return (
    <aside className="booking-bar">
      {!user ? (
        <div className="booking-bar__login">
          <h3 className="booking-bar__title">¿Te interesa este paquete?</h3>
          <p className="booking-bar__text">Para enviar una solicitud de reserva debes tener una cuenta.</p>
          <div className="booking-bar__actions">
            <a href="/login" className="booking-bar__btn booking-bar__btn--primary">Iniciar sesión</a>
            <a href="/registro" className="booking-bar__btn booking-bar__btn--secondary">Crear cuenta</a>
          </div>
        </div>
      ) : enviada ? (
        <div className="booking-bar__success">
          <span className="booking-bar__success-icon">✓</span>
          <div>
            <strong>¡Solicitud enviada!</strong>
            <p>Nos comunicaremos contigo en las próximas horas.</p>
            <a
              href={`https://wa.me/584142783669?text=Hola,%20hice%20una%20solicitud%20para%20el%20paquete:%20${encodeURIComponent(detalle.title)}`}
              className="booking-bar__whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Escribir por WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <form className="booking-bar__form" onSubmit={handleSubmit}>
          <h3 className="booking-bar__title">Solicitar información</h3>
          <p className="booking-bar__text">Completa tus datos y un agente te contactará sin costo.</p>

          <div className="booking-bar__field">
            <label htmlFor="bb-nombre">Nombre completo *</label>
            <input id="bb-nombre" type="text" value={form.nombre} onChange={handleChange("nombre")} placeholder="Tu nombre" required maxLength={100} />
          </div>

          <div className="booking-bar__field">
            <label htmlFor="bb-email">Correo electrónico *</label>
            <input id="bb-email" type="email" value={form.email} onChange={handleChange("email")} placeholder="tu@correo.com" required maxLength={120} />
          </div>

          <div className="booking-bar__field">
            <label htmlFor="bb-telefono">Teléfono</label>
            <input id="bb-telefono" type="tel" value={form.telefono} onChange={handleChange("telefono")} placeholder="+58 412 000 0000" maxLength={30} />
          </div>

          <div className="booking-bar__row">
            <div className="booking-bar__field">
              <label htmlFor="bb-fecha">Fecha estimada</label>
              <input id="bb-fecha" type="date" value={form.fecha_viaje} onChange={handleChange("fecha_viaje")} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="booking-bar__field booking-bar__field--narrow">
              <label htmlFor="bb-pasajeros">Pasajeros</label>
              <input id="bb-pasajeros" type="number" min="1" max="50" value={form.pasajeros} onChange={handleNumberChange} />
            </div>
          </div>

          <div className="booking-bar__field">
            <label htmlFor="bb-comentarios">Comentarios</label>
            <textarea id="bb-comentarios" value={form.comentarios} onChange={handleChange("comentarios")} placeholder="¿Tienes preferencias, alergias...?" rows={3} maxLength={500} />
          </div>

          {msg && <p className="booking-bar__error">{msg}</p>}

          <button type="submit" className="booking-bar__btn booking-bar__btn--primary" disabled={loading}>
            {loading ? "Enviando..." : "Solicitar información"}
          </button>

          <a href={`https://wa.me/584142783669?text=${waText}`} className="booking-bar__btn booking-bar__btn--wa" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
        </form>
      )}
    </aside>
  );
};

export default StickyBookingBar;
