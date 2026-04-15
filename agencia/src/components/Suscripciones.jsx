import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  createSuscripcion,
  fetchSuscripcionCliente,
} from "../backend/supabase_client";
import '../styles/info-pages.css';

const PLANES = [
  {
    id: "gratuito",
    nombre: "Gratuito",
    precio: "0",
    periodo: "/mes",
    beneficios: [
      "Acceso a todos los destinos",
      "Consulta de precios en tiempo real",
      "Reservas estándar",
      "Soporte por email",
    ],
    featured: false,
  },
  {
    id: "viajero",
    nombre: "Viajero",
    precio: "9.99",
    periodo: "/mes",
    beneficios: [
      "Todo lo del plan Gratuito",
      "Descuentos exclusivos hasta 10%",
      "Acceso anticipado a ofertas",
      "Soporte prioritario",
      "Newsletter con tips de viaje",
    ],
    featured: true,
  },
  {
    id: "premium",
    nombre: "Premium",
    precio: "19.99",
    periodo: "/mes",
    beneficios: [
      "Todo lo del plan Viajero",
      "Descuentos hasta 20%",
      "Agente personal asignado",
      "Cancelación flexible sin cargo",
      "Acceso a paquetes exclusivos",
    ],
    featured: false,
  },
];

const PLAN_LABELS = { gratuito: "Gratuito", viajero: "Viajero", premium: "Premium" };
const ESTADO_LABELS = {
  pendiente_activacion: "Pendiente de activación",
  activa: "Activa",
  cancelada: "Cancelada",
};

const Suscripciones = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [suscripcion, setSuscripcion] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [solicitando, setSolicitando] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingSub(true);
      const data = await fetchSuscripcionCliente(user.id);
      setSuscripcion(data);
      setLoadingSub(false);
    };
    load();
  }, [user]);

  const handleSuscribirse = async (planId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (suscripcion && suscripcion.estado !== "cancelada") return;
    setSolicitando(planId);
    setMsg(null);
    const result = await createSuscripcion(user.id, planId, user.email);
    setSolicitando(null);
    if (result) {
      setSuscripcion(result);
      setMsg({
        type: "success",
        text: `¡Solicitud de plan ${PLAN_LABELS[planId]} enviada! Nuestro equipo la activará pronto y recibirás una confirmación.`,
      });
    } else {
      setMsg({ type: "error", text: "Ocurrió un error al procesar tu solicitud. Intenta de nuevo." });
    }
  };

  const tienePlanActivo = suscripcion && suscripcion.estado !== "cancelada";

  return (
    <main className="info-page">
      <div className="info-page__container">
        <h1 className="info-page__title">Planes de Suscripción</h1>
        <p className="info-page__subtitle">
          Elige el plan que mejor se adapta a tu estilo de viaje y disfruta de beneficios exclusivos.
        </p>

        {/* Plan actual del usuario */}
        {!authLoading && !loadingSub && user && suscripcion && (
          <div className={`subs-current subs-current--${suscripcion.estado}`}>
            <strong>Tu plan actual:</strong>{" "}
            {PLAN_LABELS[suscripcion.plan]}
            {" · "}
            <span className={`subs-estado subs-estado--${suscripcion.estado}`}>
              {ESTADO_LABELS[suscripcion.estado] || suscripcion.estado}
            </span>
            {suscripcion.estado === "pendiente_activacion" && (
              <p className="subs-current__note">
                Tu solicitud está siendo revisada. Te contactaremos pronto para confirmar la activación.
              </p>
            )}
            {suscripcion.estado === "activa" && suscripcion.fecha_inicio && (
              <p className="subs-current__note">
                Activa desde{" "}
                {new Date(suscripcion.fecha_inicio).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        )}

        {/* Mensaje de feedback */}
        {msg && (
          <div className={`subs-msg subs-msg--${msg.type}`} role="alert">
            {msg.text}
          </div>
        )}

        {/* Tarjetas de planes */}
        <div className="subs-cards">
          {PLANES.map((plan) => {
            const esPlanActual =
              suscripcion?.plan === plan.id && suscripcion?.estado !== "cancelada";
            const cargando = authLoading || loadingSub;

            let btnLabel;
            if (esPlanActual) {
              btnLabel = "Plan actual";
            } else if (solicitando === plan.id) {
              btnLabel = "Procesando...";
            } else if (cargando) {
              btnLabel = "Cargando...";
            } else if (!user) {
              btnLabel = "Iniciar sesión para suscribirse";
            } else if (tienePlanActivo) {
              btnLabel = "Ya tienes un plan activo";
            } else {
              btnLabel = plan.precio === "0" ? "Comenzar gratis" : "Solicitar plan";
            }

            return (
              <div
                className={`subs-card${plan.featured ? " featured" : ""}${esPlanActual ? " subs-card--active" : ""}`}
                key={plan.id}
              >
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
                  onClick={() => handleSuscribirse(plan.id)}
                  disabled={esPlanActual || (tienePlanActivo && !esPlanActual) || solicitando !== null || cargando}
                >
                  {btnLabel}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: "32px", fontSize: "0.85rem", color: "var(--color-text-secondary)", textAlign: "center" }}>
          ¿Tienes preguntas sobre los planes?{" "}
          <a href="/contacto">Escríbenos</a> y te ayudamos.
        </p>
        <p style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--color-text-secondary)", textAlign: "center" }}>
          Los pagos en línea estarán disponibles próximamente. Por ahora, tu solicitud será gestionada por nuestro equipo.
        </p>
      </div>
    </main>
  );
};

export default Suscripciones;
